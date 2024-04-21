const walletValidator  = require('./validator/walletValidator')
const walletController = require('./controller/walletController');

//GET Requests
app.get('/wallet/:id', walletValidator.getWalletValidator, walletController.getWalletController);
app.get('/transactions', walletValidator.transactionsValidator, walletController.transactionsController);
app.get('/export_transactions/:id', walletValidator.exportTransactionsValidator, walletController.exportTransactionsController);

//POST Requests
app.post('/setup', walletValidator.setupValidator, walletController.setupController);
app.post('/transact/:walletId', walletValidator.transactValidator, walletController.transactController);