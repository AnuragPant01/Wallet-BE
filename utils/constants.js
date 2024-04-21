exports.setupWalletKeys = {
    DESCRIPTION : 'Initial Setup Balance'
};

exports.transactionTypes = {
    DEBIT  : 0,
    CREDIT : 1
};
exports.reverseTransactionTypes = {
    0 : 'DEBIT',
    1 : 'CREDIT'
};

exports.responseFlags = {
    ACTION_COMPLETE        : 201,
    PARAMETER_MISSING      : 400,
    ERROR_IN_EXECUTION     : 500,
    NO_RECORD_FOUND        : 200,
    NO_DATA_FOUND          : 200
};

exports.responseMessages = {
    ACTION_COMPLETE               : "Your Request has been executed Successfully",
    CANNOT_ADD_WALLET             : "Unable to add wallet, Please try after some time",
    CANNOT_ADD_TRANSACTION        : "Unable to add transaction, Please try after some time",
    CANNOT_PROCESS_BALANCE_AMOUNT : "unable to process the balance amount, Please try after some time",
    ERROR_IN_EXECUTION            : "We are facing an issue while executing your request, Please try after some time",
    NO_RECORD_FOUND               : "No Record Found for the given request",
    NO_DATA_FOUND                 : "No Data Found",
    MYSQL_ERROR                   : "Unable to connect to the database, Please try after some time",
}