const moment = require('moment');

const mysqlLib = require('../../utils/mysqlLib');

exports.addTransaction  = addTransaction;
exports.getTransactions = getTransactions;

async function addTransaction(opts) {
    try {
        const sql = ' INSERT INTO tb_wallet_history (wallet_id, amount, balance, description, date, transaction_type) values (?, ?, ?, ?, ?, ?) ';
        const params = [];

        params.push(opts.walletId);
        params.push(opts.amount ? opts.amount : 0);
        params.push(opts.balance ? opts.balance : 0);
        params.push(opts.description ? opts.description : '');
        params.push(opts.date ? opts.date : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        params.push(opts.transactionType);
        const result = await mysqlLib.mysqlQueryPromise('addTransaction', sql, params);
        return result;
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in addTransaction", ERROR : error}));
        throw error;
    };
};

async function getTransactions(opts) {
    try {
        let sql = ` SELECT ${opts.columns || '*'} FROM tb_wallet_history WHERE 1=1 `;
        const params = [];
        if (opts.walletId) {
            sql += ' AND wallet_id = ?';
            params.push(opts.walletId);
        };
        if (opts.transaction_type) {
            sql += ' AND transaction_type = ?';
            params.push(opts.transaction_type);
        }
        if (opts.orderBy) {
            sql += ' ORDER BY ' + opts.orderBy;
        };
        if (opts.skip && opts.limit) {
            sql += ' LIMIT ?, ?';
            params.push(Number(opts.skip));
            params.push(Number(opts.limit));
        };
        const result = await mysqlLib.mysqlQueryPromise('getTransactions', sql, params);
        return result;
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in getTransactions", ERROR : error}));
        throw error;
    };
};