const moment = require('moment');

const mysqlLib = require('../../utils/mysqlLib');

exports.getWallet    = getWallet;
exports.addNewWallet = addNewWallet;
exports.updateWallet = updateWallet;

async function getWallet(opts) {
    try {
        const sql = ` SELECT ${opts.columns || '*'} FROM tb_wallets WHERE wallet_id = ? `;
        const params = [Number(opts.walletId)];
        const result = await mysqlLib.mysqlQueryPromise('getWallet', sql, params);
        return result;
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in getWallet", ERROR : error}));
        throw error;
    };
};

async function addNewWallet(opts) {
    try {
        const sql = 'INSERT INTO tb_wallets (name, balance, date) values (?, ?, ?)';
        const params = [];

        params.push(opts.name ? opts.name : 'default name');
        params.push(opts.balance ? opts.balance : 0);
        params.push(opts.date ? opts.date : moment(new Date()).format('YYYY-MM-DD'));

        const result = await mysqlLib.mysqlQueryPromise('addNewWallet', sql, params);
        return result;
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in addNewWallet", ERROR : error}));
        throw error;
    };
};

async function updateWallet(opts) {
    try {
        console.log("#######", opts);
        let sql = ' UPDATE tb_wallets SET ';
        let whereSql = ' WHERE 1=1 ';
        const params = [];

        if (opts.name) {
            sql += ' name = ? ';
            params.push(opts.name);
        };
        if (opts.hasOwnProperty('balance')) {
            sql += ' balance = ? ';
            params.push(Number(opts.balance));
        };

        if (opts.walletId) {
            whereSql += ' AND wallet_id = ? ';
            params.push(Number(opts.walletId));
        };

        sql = sql + whereSql;
        const result = await mysqlLib.mysqlQueryPromise('updateWallet', sql, params);
        return result;
    } catch (error) {
        console.error(JSON.stringify({EVENT : "Error in updateWallet", ERROR : error}));
        throw error;
    };
};