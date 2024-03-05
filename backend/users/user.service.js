const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const sgMail = require('@sendgrid/mail');
const CryptoJS = require("crypto-js");

module.exports = {
    authenticate,
    forgotPasswordToConfirmEmail,
    forgotPassword,
    getAll,
    getById,
    getByEmail,
    create,
    update,
    updatePassword,
    delete: _delete,
    getUsernameById,
    getEmailById,
    myDecrypt,
    getDecryptedInfo
};

async function authenticate({ email, password, confirm }) {
    const user = await db.User.scope('withHash').findOne({ where: { email }, attributes: [ 'id', 'password', 'emailVerified', 'is2FA', 'fullName', 'role', 'status'] });

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Email or password is incorrect';

    if (user.status == 'Block')
        throw 'Your account was blocked by admin.';

    if (user.status == 'Suspend')
        throw 'Your account was suspended by admin.';

    if (!user.emailVerified)
        throw 'check-email';

    // authentication successful
    if ((user.role || user.is2FA) && confirm) {
        let verificationCode = generateVerificationCode();
        user['verifyCode'] = verificationCode;

        sgMail.setApiKey(config.mail.sendgrid_api);

        const htmlContent = '<html>'
        +'<head>'
        +'<title>Unicash Team</title>'
        +'<style>'
        +'* {'
        +'      font-family: Arial, Helvetica, sans-serif;'
        +'}'
        +'</style>'
        +'</head>'
        +'<body aria-readonly="false">'
        +'<h3>Dear '+user.fullName+',</h3>'

        +'<h4>Thank you for signing up to use Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'

        +'<h4>This is your verification code to sign in.</h4>'

        +'<h2 style="padding-left: 30px">'+verificationCode+'</h2>'

        +'<h4>Once signed in you will be able to update your payment details in order to be able to use Unicash for your transactions.</h4>'

        +'<h4>We welcome your feedback on how we can serve you better.</h4>'

        +'<h4>Enjoy a safe and secure transaction experience!</h4>'

        +'<h3>Unicash Team</h3>'
        +'</body>'
        +'</html>';

        const msg = {
            to: email,
            from: config.mail.from,
            subject: 'Welcome to Unicash',
            text: 'Sign in with the code',
            html: htmlContent
        };

        await sgMail.send(msg);

        await user.save();
    }
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function forgotPasswordToConfirmEmail({ email }) {
    const user = await getUserByEmail(email);
    const verificationCode = generateVerificationCode();
    user['verifyCode'] = verificationCode;

    sgMail.setApiKey(config.mail.sendgrid_api);

    const htmlContent = '<html>'
    +'<head>'
    +'<title>Unicash Team</title>'
    +'<style>'
    +'* {'
    +'      font-family: Arial, Helvetica, sans-serif;'
    +'}'
    +'</style>'
    +'</head>'
    +'<body aria-readonly="false">'
    +'<h3>Dear '+user.fullName+',</h3>'


    +'<h4>Thank you for signing up to use Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'

    +'<h4>If you forgot your password, please reset the password with following code.</h4>'

    +'<h2 style="padding-left: 30px">'+verificationCode+'</h2>'

    +'<h4>Once signed in you will be able to update your payment details in order to be able to use Unicash for your transactions.</h4>'

    +'<h4>Enjoy a safe and secure transaction experience!</h4>'

    +'<h3>Unicash Team</h3>'
    +'</body>'
    +'</html>';

    const msg = {
        to: email,
        from: config.mail.from,
        subject: 'Welcome to Unicash',
        text: 'Forgot your password?',
        html: htmlContent
      };
      
    //await sgMail.send(msg);

    sgMail
    .send(msg)
    .then(() => {}, error => {
        console.error(error);

        if (error.response) {
        console.error(error.response.body)
        }
    });

    await user.save();
    return user;
}

async function forgotPassword(params) {
    const user = await db.User.scope('withHash').findOne({ where: { email: params.email } });
    
    // validate
    if (!user || user.verifyCode !== params.code ) {
        throw 'User not found.';
    }
    
    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function getByEmail(email) {
    return await getUserByEmail(email);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    params.ETH_KEYS = myEncrypt(params.ETH_KEYS)
    params.BTC_KEYS = myEncrypt(params.BTC_KEYS)

    // Sending the email to verify the account
    let verificationCode = generateVerificationCode();

    params['verifyCode'] = verificationCode;
    params['emailVerified'] = 0;
    params['role'] = 0;
    params['is2FA'] = 0;
    params['status'] = 'Active';

    sgMail.setApiKey(config.mail.sendgrid_api);

    const htmlContent = '<html>'
    +'<head>'
    +'<title>Unicash Team</title>'
    +'<style>'
    +'* {'
    +'      font-family: Arial, Helvetica, sans-serif;'
    +'}'
    +'</style>'
    +'</head>'
    +'<body aria-readonly="false">'
    +'<h3>Dear '+params.fullName+',</h3>'

    +'<h4>Thank you for signing up to use Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'

    +'<h4>This is your verification code to activate your account.</h4>'

    +'<h2 style="padding-left: 30px">'+verificationCode+'</h2>'

    +'<h4>Once signed in you will be able to update your payment details in order to be able to use Unicash for your transactions.</h4>'

    +'<h4>We welcome your feedback on how we can serve you better.</h4>'

    +'<h4>Enjoy a safe and secure transaction experience!</h4>'

    +'<h3>Unicash Team</h3>'
    +'</body>'
    +'</html>';

    const msg = {
        to: params.email,
        from: config.mail.from,
        subject: 'Welcome to Unicash',
        text: 'Verify your account',
        html: htmlContent
      };
      
    //await sgMail.send(msg);

    sgMail
    .send(msg)
    .then(() => {}, error => {
        console.error(error);

        if (error.response) {
        console.error(error.response.body)
        }
    });

    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);
    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function updatePassword(id, params) {
    const user = await db.User.scope('withHash').findOne({ where: { id } });

    // validate
    if (!user || !(await bcrypt.compare(params.oldPassword, user.password))) {
        throw 'Old password is incorrect';
    }
    
    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function getUsernameById(id) {
    const user = await db.User.findByPk(id);
    if (!user) return 'Unknown user';
    return user.fullName;
}
async function getEmailById(id) {
    const user = await db.User.findByPk(id);
    if (!user) return 'Unknown user';
    return user.email;
}

async function getUserByEmail(mail) {
    const user = await db.User.findOne({ where: { email: mail }});
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}

function generateVerificationCode() {
    var length = 8;
    var charset = "0123456789ABCDEF";
    var retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

function myEncrypt(content) {
    const ciphertext = CryptoJS.AES.encrypt(content, config.secret);
    return ciphertext.toString();
}

async function myDecrypt(content) {
    const bytes = CryptoJS.AES.decrypt(content, config.secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

async function getDecryptedInfo({ email, key }) {
    const user = await getUserByEmail(email);
    return {
        email: email,
        eth_address: user.ETH_ADDRESS,
        eth_key: await myDecrypt(user.ETH_KEYS),
        btc_address: user.BTC_ADDRESS,
        btc_key: await myDecrypt(user.BTC_KEYS)
    }
}