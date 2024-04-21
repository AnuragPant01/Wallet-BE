const lodash = require('lodash');
const moment = require('moment');

const commonService        = require('../../utils/commonServices');
const constants            = require('../../utils/constants');
const walletServices       = require('../services/walletServices');
const transactionServices  = require('../services/transactionServices');

exports.getWalletController          = getWalletController;
exports.setupController              = setupController;
exports.transactController           = transactController;
exports.transactionsController       = transactionsController;
exports.exportTransactionsController = exportTransactionsController

async function getWalletController(req, res) {
    try {
        const walletId = req.body.wallet_id;

        const walletDetails = await walletServices.getWallet({
            walletId : walletId
        });
        if (lodash.isEmpty(walletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };
        return commonService.sendResponse(res, constants.responseMessages.ACTION_COMPLETE, constants.responseFlags.ACTION_COMPLETE, {
            id      : walletDetails[0].wallet_id,
            balance : walletDetails[0].balance,
            name    : walletDetails[0].name,
            date    : walletDetails[0].date
        });
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in getWalletController", ERROR : error}));
        return commonService.sendResponse(res, constants.responseMessages.ERROR_IN_EXECUTION, constants.responseFlags.ERROR_IN_EXECUTION);
    };
};

async function setupController(req, res) {
    try {
        const balance = req.body.balance;
        const name = req.body.name;
        const date = moment(new Date()).format('YYYY-MM-DD');

        const walletDetails = await walletServices.addNewWallet({
            name    : name,
            balance : 0,
            date    : date
        });
        if (lodash.isEmpty(walletDetails) || !walletDetails.insertId) {
            return commonService.sendResponse(res, constants.responseMessages.CANNOT_ADD_WALLET, constants.responseFlags.ERROR_IN_EXECUTION);
        };

        const walletId = walletDetails.insertId;

        const TransactionDetails = await transactionServices.addTransaction({
            amount          : balance,
            balance         : balance,
            transactionType : balance < 0 ? constants.transactionTypes.DEBIT : constants.transactionTypes.CREDIT,
            walletId        : walletId,
            description     : constants.setupWalletKeys.DESCRIPTION,
            date            : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
        if (lodash.isEmpty(TransactionDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.CANNOT_PROCESS_BALANCE_AMOUNT, constants.responseFlags.ERROR_IN_EXECUTION);
        };
        const transactionId = TransactionDetails.insertId;

        const updatedWalletDetails = await walletServices.updateWallet({
            balance  : balance,
            walletId : walletId
        });
        if (lodash.isEmpty(updatedWalletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.CANNOT_PROCESS_BALANCE_AMOUNT, constants.responseFlags.ERROR_IN_EXECUTION);
        };

        return commonService.sendResponse(res, constants.responseMessages.ACTION_COMPLETE, constants.responseFlags.ACTION_COMPLETE, {
            id : walletId,
            balance : balance,
            transactionId : transactionId,
            name : name,
            date : date
        });
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in setupController", ERROR : error}));
        return commonService.sendResponse(res, constants.responseMessages.ERROR_IN_EXECUTION, constants.responseFlags.ERROR_IN_EXECUTION);
    };
};

async function transactController(req, res) {
    try {
        const amount = req.body.amount;
        const walletId = req.body.wallet_id;
        const transactionType = req.body.transaction_type;
        const description = req.body.description ? req.body.description : '';

        const walletDetails = await walletServices.getWallet({
            walletId : walletId
        });
        if (lodash.isEmpty(walletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };

        let balance = walletDetails[0].balance;
        if (transactionType === constants.transactionTypes.DEBIT) {
            balance -= amount;
        } else {
            balance += amount;
        };

        const transactionDetails = await transactionServices.addTransaction({
            amount          : amount,
            transactionType : transactionType,
            walletId        : walletId,
            balance         : balance,
            description     : description
        });
        if (lodash.isEmpty(transactionDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.CANNOT_ADD_TRANSACTION, constants.responseFlags.ERROR_IN_EXECUTION);
        };

        const updatedWalletDetails = await walletServices.updateWallet({
            balance  : balance,
            walletId : walletId
        });
        if (lodash.isEmpty(updatedWalletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.CANNOT_PROCESS_BALANCE_AMOUNT, constants.responseFlags.ERROR_IN_EXECUTION);
        };

        return commonService.sendResponse(res, constants.responseMessages.ACTION_COMPLETE, constants.responseFlags.ACTION_COMPLETE, {
            balance : balance,
            transactionId : transactionDetails.insertId
        });
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in transactController", ERROR : error}));
        return commonService.sendResponse(res, constants.responseMessages.ERROR_IN_EXECUTION, constants.responseFlags.ERROR_IN_EXECUTION);
    };
};

async function transactionsController(req, res) {
    try {
        const walletId = req.body.wallet_id;
        const skip = req.body.skip;
        const limit = req.body.limit;

        const walletDetails = await walletServices.getWallet({
            walletId : walletId
        });
        if (lodash.isEmpty(walletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };

        const opts = {
            columns  : " id, wallet_id AS walletId, amount, balance, description, date",
            walletId : walletId,
            skip     : skip,
            limit    : limit,
            orderBy  : 'id DESC'
        };
        console.log('``````````````````',req.body.transaction_type)
        req.body.transaction_type ? opts.transaction_type = req.body.transaction_type : "";
        console.log('----------body',req.body)
        let total_count =0
        if(req.body.skip == 0){
            const options = {
                columns  : "COUNT(1) as total_count",
                walletId : walletId,
            };
            const count = await transactionServices.getTransactions(options);
            if (lodash.isEmpty(count) || count[0].total_count == 0) {
                return commonService.sendResponse(res, constants.responseMessages.NO_DATA_FOUND, constants.responseFlags.NO_DATA_FOUND);
            };
            total_count = count[0].total_count;
        }
        const transactions = await transactionServices.getTransactions(opts);
        if (lodash.isEmpty(transactions)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };
        const responseData = {
            transactions : transactions
        };
        total_count ? responseData.total_count = total_count : "";
        return commonService.sendResponse(res, constants.responseMessages.ACTION_COMPLETE, constants.responseFlags.ACTION_COMPLETE, responseData);
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in transactController", ERROR : error}));
        return commonService.sendResponse(res, constants.responseMessages.ERROR_IN_EXECUTION, constants.responseFlags.ERROR_IN_EXECUTION);
    };
};

async function exportTransactionsController(req, res) {
    try {
        const walletId = req.body.wallet_id;

        const walletDetails = await walletServices.getWallet({
            walletId : walletId
        });
        if (lodash.isEmpty(walletDetails)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };

        const opts = {
            columns  : " id, wallet_id AS walletId, amount, balance, description, date, CASE WHEN transaction_type = 0 THEN 'DEBIT' ELSE 'CREDIT' END AS type ",
            walletId : walletId,
            orderBy  : 'id DESC'
        };

        const transactions = await transactionServices.getTransactions(opts);
        if (lodash.isEmpty(transactions)) {
            return commonService.sendResponse(res, constants.responseMessages.NO_RECORD_FOUND, constants.responseFlags.NO_RECORD_FOUND);
        };

        const exportFields = ["id", "walletId", "amount", "balance", "description", "date", "type"];

        const exportData = await commonService.convertJSON2CSVPromisified({
            fields: exportFields,
            data: transactions
        });
        console.log(JSON.stringify({EVENT : "exportTransactionsController", exportFields : exportFields, exportData : exportData}));
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=' + "tasks.csv" + ';');
        res.end(exportData);
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in transactController", ERROR : error}));
        return commonService.sendResponse(res, constants.responseMessages.ERROR_IN_EXECUTION, constants.responseFlags.ERROR_IN_EXECUTION);
    };
};