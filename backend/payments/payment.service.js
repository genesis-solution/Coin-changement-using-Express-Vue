const db = require('_helpers/db');
const config = require('config.json');
const { param } = require('./payments.controller');
const userService = require('../users/user.service');
const sgMail = require('@sendgrid/mail');
const Op = require('Sequelize').Op

module.exports = {
    createPaymentmethod,
    updatePaymentmethod,
    getPaymentMethods,
    getPaymentMethodsByUserIdAndName,
    deletePaymentMethod,
    getConversionBetweenUSDPHP,
    
    createTransaction,
    getTransactionById,
    getAllTransactionsByUserId,
    getTransactions,
    getAllTransactions,
    getAllTransactionsByDate,
    getTotalAmountPerDay,
    updateTransaction,

    getAdminsetting,
    updateAdminsetting,
    createAdminsetting,
    getProfit,
    getExchangeLimit
};

async function createPaymentmethod(params) {
    // validate
    if (await db.Paymentmethod.findOne({ where: { userId: params.userId, selectedCurrency: params.selectedCurrency } })) {
        throw '"' + params.name + '" is already added by you';
    }

    await db.Paymentmethod.create(params);
}

async function updatePaymentmethod(id, params) {
    const paymentMethod = await getPaymentMethod(id);
    Object.assign(paymentMethod, params);
    await paymentMethod.save();

    return paymentMethod.get();
}

async function getPaymentMethods(userId) {
    return await getPaymentMethodsByUserId(userId);
}

async function getPaymentMethodsByUserIdAndName(userId, name) {
    const paymentmethod = await db.Paymentmethod.findOne({ where: { userId: userId, name: name }});
    if (!paymentmethod) throw 'Payment method doesn\'t exist.';
    return paymentmethod;
}

async function getPaymentMethod(id) {
    const paymentMethod = await db.Paymentmethod.findByPk(id);
    if (!paymentMethod) throw 'Payment method not found';
    return paymentMethod;
}

async function getPaymentMethodsByUserId(userId) {
    const paymentmethods = await db.Paymentmethod.findAll({ where: { userId: userId }});
    if (!paymentmethods) throw 'NO PAYMENT METHOD YET';
    return paymentmethods;
}

async function deletePaymentMethod(id) {
    const paymentMethod = await getPaymentMethod(id);
    await paymentMethod.destroy();
}

async function getConversionBetweenUSDPHP() {
    const conversionRate = await db.Conversion.findOne({ where: { fromCurrency: "USD", toCurrency: "PHP" }});
    if (!conversionRate) return 50.01;
    return conversionRate.rate;
}

///////////////////////////////////// Transaction ////////////////////////////////////
async function createTransaction(params) {
    const orderId = randomOrderId();
    params['orderId'] = orderId;
    const newTransaction = await db.Transaction.create(params);

    sgMail.setApiKey(config.mail.sendgrid_api);
    const user = await userService.getById(params.userId)

    let adminEmail = config.admin
    const adminSetting = await db.Adminsetting.findAll();
    if (adminSetting) {
        adminEmail = adminSetting[0].email;
    }

    const todayD = new Date();

    let htmlContentForAdmin = '<html>'
                        +'<head>'
                        +'<title>Unicash Team</title>'
                        +'<style>'
                        +'  * {'
                            +'      font-family: Arial, Helvetica, sans-serif;'
                            +'}'
                            +'</style>'
                            +'</head>'
                        +'<body aria-readonly="false">'
                        +'<h3>Dear Admin,</h3>'
                        
                        
                        +'<h4>New transaction has been made.</h4>'
                        
                        +'<h4>Here is the exchange transaction information, and it is currently processing.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">'+params.status+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Email:</h4> <h3 style="font-weight: 800;">'+user.email+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Date:</h4> <h3 style="font-weight: 800;">'+todayD.toLocaleDateString()+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">BTC or ETH address:</h4> <h3 style="font-weight: 800;">'+ (params.from == 'BTC' ? user.BTC_ADDRESS : user.ETH_ADDRESS) +'</h3></div>'
                        
                        +'<h4>We will send you email transaction information once completed.</h4>'
                        
                        +'<h4>Having trouble in your transaction? Please send us email support at <a href="email:'+config.mail.from+'">'+config.mail.from+'</a></h4>'
                        
                        +'<h3>Unicash Team</h3>'
                        +'</body>'
                        +'</html>'

    let htmlContent = '<html>'
                        +'<head>'
                        +'<title>Unicash Team</title>'
                        +'<style>'
                        +'  * {'
                            +'      font-family: Arial, Helvetica, sans-serif;'
                            +'}'
                            +'</style>'
                            +'</head>'
                        +'<body aria-readonly="false">'
                        +'<h3>Dear '+params.fullName+',</h3>'
                        
                        
                        +'<h4>Thank you for using Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'
                        
                        +'<h4>Here is your exchange transaction information, and it is currently processing.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">'+params.status+'</h3></div>'
                        
                        +'<h4>We will send you email transaction information once completed.</h4>'
                        
                        +'<h4>Having trouble in your transaction? Please send us email support at <a href="email:'+config.mail.from+'">'+config.mail.from+'</a></h4>'
                        
                        +'<h3>Unicash Team</h3>'
                        +'</body>'
                        +'</html>'
    if (params.status === 'Completed') 
            htmlContent = '<html>'
                        +'<head>'
                        +'<title>Unicash Team</title>'
                        +'<style>'
                        +'  * {'
                            +'      font-family: Arial, Helvetica, sans-serif;'
                            +'}'
                            +'</style>'
                            +'</head>'
                        +'<body aria-readonly="false">'
                        +'<h3>Dear '+params.fullName+',</h3>'
                        
                        
                        +'<h4>Thank you for using Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'
                        
                        +'<h4>Here is your exchange transaction information, and it is currently processing.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">'+params.status+'</h3></div>'
                        
                        +'<h4>Please give us a feedback <a href="https://www.unicash.ph/feedback">https://www.unicash.ph/feedback</a></h4>'
                        
                        +'<h4>Having trouble in your transaction? Please send us email support at <a href="email:'+config.mail.from+'">'+config.mail.from+'</a></h4>'
                        
                        +'<h3>Unicash Team</h3>'
                        +'</body>'
                        +'</html>'
        
    const msg = {
        to: user.email,
        from: config.mail.from,
        subject: 'Welcome to Unicash',
        text: 'Transaction',
        html: htmlContent
      };

    if (params.status === 'Processing') // to Admin
    {
        const msgForAdmin = {
            to: adminEmail,
            from: config.mail.from,
            subject: 'Welcome to Unicash',
            text: 'Transaction',
            html: htmlContentForAdmin
          };
        sgMail
        .send(msgForAdmin)
        .then(() => {}, error => {
               // console.error(error);

            if (error.response) {
             //   console.error(error.response.body)
            }
        });
    } 

    sgMail
        .send(msg)
        .then(() => {}, error => {
        //    console.error(error);

            if (error.response) {
            // console.error(error.response.body)
            }
        });

    return newTransaction;
}

async function updateTransaction(id, params) {
    const transaction = await getTransaction(id);
    Object.assign(transaction, params);
    await transaction.save();

    const customerName = await userService.getUsernameById(params.userId);
    const customerEmail = await userService.getEmailById(params.userId);

    let headerIntemplate = '<html>'
                        +'<head>'
                        +'<title>Unicash Team</title>'
                        +'<style>'
                        +'  * {'
                            +'      font-family: Arial, Helvetica, sans-serif;'
                            +'}'
                            +'</style>'
                            +'</head>'
                        +'<body aria-readonly="false">'
                        +'<h3>Dear '+customerName+',</h3>'
                        
                        +'<h4>Thank you for using Unicash. A secure and trusted exchange service that will serve your transaction needs.</h4>'
    let footerIntemplate = '<h4>Having trouble in your transaction? Please send us email support at <a href="email:'+config.mail.from+'">'+config.mail.from+'</a></h4>'
                        
                        +'<h3>Unicash Team</h3>'
                        +'</body>'
                        +'</html>'

    let htmlContent = headerIntemplate
                        
                        +'<h4>Here is your exchange transaction information, and it is canceled.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+params.orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">Canceled</h3></div>'
                        
                        + footerIntemplate;
    if (params.image) {
        htmlContent = headerIntemplate
                        
                        +'<h4>Here is your exchange transaction information, and it is canceled.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+params.orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">Canceled</h3></div>'
                        
                        +'<a href="'+params.image+'">Please see the attached receipt.</a>'
                        
                        + footerIntemplate;
    }

    if (params.status === 'Completed') {
        htmlContent = headerIntemplate
                        
                        +'<h4>Here is your exchange transaction information, and it is completed.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+params.orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">Completed</h3></div>'
                        
                        + footerIntemplate;
        if (params.image) {
            htmlContent = headerIntemplate
                            
                        +'<h4>Here is your exchange transaction information, and it is completed.</h4>'
                                    
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+params.orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">Completed</h3></div>'
                        
                        +'<a href="'+params.image+'">Please see the attached receipt.</a>'
                        
                        + footerIntemplate;
        }
    }
    if (params.status === 'Refunded') 
        htmlContent = headerIntemplate
                        
                        +'<h4>Here is your exchange transaction information, and it is refunded.</h4>'
                        
                        +'<div style="display: flex;"><h4 style="width: 140px;">You send:</h4> <h3 style="font-weight: 800;">'+params.sendAmount + ' ' + params.from +'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">You received:</h4> <h3 style="font-weight: 800;">'+params.amount+' PHP '+params.to+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Order Id:</h4> <h3 style="font-weight: 800;">'+params.orderId+'</h3></div>'
                        +'<div style="display: flex;margin-top: -35px"><h4 style="width: 140px;">Status:</h4> <h3 style="font-weight: 800;">Refunded</h3></div>'
                        
                        + footerIntemplate;
        
    const msg = {
        to: customerEmail,
        from: config.mail.from,
        subject: 'Welcome to Unicash',
        text: 'Transaction',
        html: htmlContent
      };

    sgMail
        .send(msg)
        .then(() => {}, error => {
            if (error.response) {}
        });

    return transaction.get();
}

async function getTransactionById(id) {
    return await getTransaction(id);
}
async function getAllTransactionsByUserId(id) {
    const transactions = await db.Transaction.findAll({ order: [['id', 'DESC']], where: { userId: id }});
    if (!transactions) throw 'NO TRANSACTION';
    return transactions;
}
async function getTransactions() { // Limited 5
    const transactions = await db.Transaction.findAll({ limit: 5, where: { status: 'Completed' }, order: [['id', 'DESC']]});
    if (!transactions) throw 'NO TRANSACTION';

    let result = [];
    transactions.forEach((transaction, index) => {
        result.push({
            ...transaction.dataValues,
            userName: "unknown"
        })
    });
    return result;
}
async function getAllTransactions() {
    const transactions = await db.Transaction.findAll({ order: [['id', 'DESC']]}); // where: { status: 'Processing' },
    if (!transactions) throw 'NO TRANSACTION';

    let result = [];
    transactions.forEach((transaction, index) => {
        result.push({
            ...transaction.dataValues,
            userName: "unknown",
            email: "unknown"
        })
    });
    return result;
}

async function getAllTransactionsByDate(params) {
    const transactions = await db.Transaction.findAll({ order: [['id', 'DESC']], where: { createdAt: {
        [Op.gte]: params.from,
        [Op.lte]: params.to
    }} }); // where: { status: 'Processing' },

    if (!transactions || Object.assign([], transactions).length == 0) throw 'NO TRANSACTION';

    let result = [];
    transactions.forEach((transaction, index) => {
        result.push({
            ...transaction.dataValues,
            userName: "unknown",
            email: "unknown"
        })
    });
    return result;
}

async function getTransaction(id) {
    const transaction = await db.Transaction.findByPk(id);
    if (!transaction) throw 'Transaction not found';
    return transaction;
}

async function getTotalAmountPerDay(user, currDate) {
    const todayD = new Date();
    const year = todayD.getFullYear()
    const month = todayD.getMonth();
    const date = todayD.getDate();
    const startTime = new Date(year, month, date, 0, 0, 0);
    const transactions = await db.Transaction.findAll({attributes: ['amount'], where: { userId: user, status: {[Op.or]: ['Completed', 'Processing']}, createdAt: {
        [Op.gte]: startTime,
        [Op.lte]: todayD
    }}})
    if (!transactions) throw 'Transaction not found';

    let totalAmount = 0;
    transactions.forEach(transaction => {
        totalAmount += Number(transaction.amount)
    });
    return totalAmount;
}

function randomOrderId() {
    return Math.floor(Math.random() * 1000000);
  }

async function getAdminsetting() {
    const adminSetting = await db.Adminsetting.findAll();
    if (!adminSetting) throw 'NO Configuration';
    return adminSetting;
}

async function updateAdminsetting(id, params) {
    const adminsetting = await getAdminsettingById(id);
    Object.assign(adminsetting, params);
    await adminsetting.save();

    return adminsetting.get();
}

async function getAdminsettingById(id) {
    const adminsetting = await db.Adminsetting.findByPk(id);
    if (!adminsetting) throw 'Transaction not found';
    return adminsetting;
}

async function createAdminsetting(params) {
    const adminsetting = await db.Adminsetting.create(params);
    return adminsetting;
}

async function getProfit() {
    const adminSetting = await db.Adminsetting.findAll();
    if (adminSetting) {
        return adminSetting[0].profit;
    }
    return 0
}

async function getExchangeLimit() {
    const adminSetting = await db.Adminsetting.findAll();
    if (adminSetting) {
        return { data: adminSetting[0].exchangeLimit, content: adminSetting[0].exchangeLimitMessage };
    }
    return { data: false, content: '' };
}