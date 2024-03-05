const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const request = require('request');

const getETHURL = 'http://194.233.77.30:8080/v1/generate/eth';
const getBTCURL = 'http://194.233.77.30:8081/v1/account';

// routes
router.post('/decrypt', decryptKeySchema, decryptKey);
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/verify', getVerify);
router.post('/forgotPasswordToConfirmEmail', forgotPasswordToConfirmEmailSchema, forgotPasswordToConfirmEmail);
router.post('/forgotPassword', forgotPasswordSchema, forgotPassword);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);
router.put('/updatePassword/:id', authorize(), updatePasswordSchema, updatePassword);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function decryptKeySchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        key: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}
function decryptKey(req, res, next) {
    if (req.body.key != "theapikey") {
        res.json({error: true, message: "your not authorized"})
    }
    else {
        userService.getDecryptedInfo(req.body)
        .then(result => res.json(result))
        .catch(next);
    }
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirm: Joi.bool().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        ETH_ADDRESS: Joi.string().required(),
        ETH_KEYS: Joi.string().required(),
        BTC_ADDRESS: Joi.string().required(),
        BTC_KEYS: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    request(getETHURL, function (error, response, body) {
            if (error) {
                res.json({ status: false, message: 'failed' })
            }
            if (response && response.statusCode) {
                request(getBTCURL, function (error_, response_, body_) {
                    if (error_) {
                        res.json({ status: false, message: 'failed' })
                    }
                    if (response_ && response_.statusCode) {
                        try {
                            const ethJSON = JSON.parse(body);
                            const btcJSON = JSON.parse(body_);
                            
                            if (!ethJSON['error'] && !btcJSON['error']) {
                                let reqV = req.body;
                                reqV['ETH_ADDRESS'] = ethJSON['address'];
                                reqV['ETH_KEYS'] = ethJSON['keys'];
                                reqV['BTC_ADDRESS'] = btcJSON['address'];
                                reqV['BTC_KEYS'] = btcJSON['keys'];

                                userService.create(reqV)
                                .then(() => res.json({ status: true, message: 'Registration successful.' }))
                                .catch(next);
                            }
                        } catch (error) {
                            res.json({ status: false, message: 'failed' })
                        }
                    }
                });
            }
        });
}

function forgotPasswordToConfirmEmailSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function forgotPasswordToConfirmEmail(req, res, next) {
    userService.forgotPasswordToConfirmEmail(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        code: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    userService.forgotPassword(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getVerify(req, res, next) {
    if (req.query.email && req.query.verifyCode && req.query.password) {
        userService.getByEmail(req.query.email)
            .then(async user => {
                if (user && user.verifyCode == req.query.verifyCode) {
                    if (!user.emailVerified) {
                        user.emailVerified = true;
                        await user.save();
                    }
                    res.json({message: "Verification successful."})
                } else {
                    throw "Verification code is incorrect."
                }
            })
            .catch(next);
    } else {
        throw 'Invald request'
    }
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        fullName: Joi.string().empty(''),
        email: Joi.string().empty(''),
        address: Joi.string().empty(''),
        birthday: Joi.string().empty(''),
        is2FA: Joi.boolean().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function updatePasswordSchema(req, res, next) {
    const schema = Joi.object({
        oldPassword: Joi.string().empty(''),
        password: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function updatePassword(req, res, next) {
    userService.updatePassword(req.params.id, req.body)
        .then(user => {
            res.json(user)
        })
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}