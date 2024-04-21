const json2Csv = require('json2csv');

const constants = require('./constants');

exports.validateFields             = validateFields;
exports.sendResponse               = sendResponse;
exports.convertJSON2CSVPromisified = convertJSON2CSVPromisified;

function sendResponse(res, msg, status, data, values) {
    const response = {
      message: msg,
      status : status,
      data   : data || {}
    };
    if(values){
      response.values = values;
    }
    res.send(JSON.stringify(response));
};

function validateFields(reqBody, res, schema) {
    const validation = schema.validate(reqBody);
    if(validation.error) {
        const errorReason =
                validation.error.details !== undefined
                    ? validation.error.details[0].message
                    : 'Parameter missing or parameter type is wrong';
        sendResponse(res, errorReason, constants.responseFlags.PARAMETER_MISSING);
        return false;
    };
    return true;
};

function convertJSON2CSVPromisified(opts) {
  return new Promise((resolve, reject) => {
    json2Csv({data: opts.data, fields: opts.fields}, function (err, csv) {
      if (err){
        console.error(JSON.stringify({EVENT : "Error in convertJSON2CSVPromisified", ERROR : err}));
        return reject(err);
      }
      return resolve(csv);
    });
  });  
}