const Joi = require('joi');

const commonService = require('../../utils/commonServices');

exports.getWalletValidator          = getWalletValidator;
exports.setupValidator              = setupValidator;
exports.transactValidator           = transactValidator;
exports.transactionsValidator       = transactionsValidator;
exports.exportTransactionsValidator = exportTransactionsValidator;

async function getWalletValidator(req, res, next) {
    const schema = Joi.object().keys({
        wallet_id  : Joi.number().positive().greater(0).required()
    });
    
    req.body.wallet_id = req.params.id ? req.params.id : '';

    const validFields = commonService.validateFields(req.body, res, schema);
    if (validFields) {
        next()
    };
};

async function setupValidator(req, res, next) {
    const schema = Joi.object().keys({
        balance  : Joi.number().precision(4).required(),
        name     : Joi.string().required()
    });

    const validFields = commonService.validateFields(req.body, res, schema);
    if (validFields) {
        next()
    };
};

async function transactValidator(req, res, next) {
    const schema = Joi.object().keys({
        wallet_id        : Joi.number().positive().greater(0).required(),
        amount           : Joi.number().precision(4).required(),
        transaction_type : Joi.number().valid(0,1).required(),
        description      : Joi.string().optional().allow(''),
    });

    req.body.wallet_id = req.params.walletId ? req.params.walletId : '';

    const validFields = commonService.validateFields(req.body, res, schema);
    if (validFields) {
        next()
    };
};

async function transactionsValidator(req, res, next) {
    const schema = Joi.object().keys({
        wallet_id        : Joi.number().positive().greater(0).required(),
        skip             : Joi.number().greater(-1).required(),
        limit            : Joi.number().positive().greater(0).required(),
        transaction_type : Joi.number().valid(0,1).optional()
    });

    req.body.wallet_id = req.query.walletId ? req.query.walletId : '';
    req.body.skip = req.query.skip ? req.query.skip : '';
    req.body.limit = req.query.limit ? req.query.limit : '';
    if(req.query.transaction_type >=0){
        req.body.transaction_type = req.query.transaction_type;
    }
    const validFields = commonService.validateFields(req.body, res, schema);
    if (validFields) {
        next()
    };
};

async function exportTransactionsValidator(req, res, next) {
    const schema = Joi.object().keys({
        wallet_id  : Joi.number().positive().greater(0).required()
    });
    
    req.body.wallet_id = req.params.id ? req.params.id : '';

    const validFields = commonService.validateFields(req.body, res, schema);
    if (validFields) {
        next()
    };
};