WALLET LINK - https://wallet-transaction.netlify.app/wallet

BE URL - https://wallet-be-production-6afe.up.railway.app

**API's** 
1. get wallet          - **GET**   /wallet/:wallet_id
2. setup wallet        - **POST**  /setup
                          body - {"name" : "abc","balance":100} raw data in JSON format
3. add transactions    - **POST**  /transact/:wallet_id 
                          body - {"amount" : 100,"transaction_type":1/0,"description":''} raw data in JSON format
4. fetch transactions  - **GET**  /transactions?walletId=wallet_id&skip=skip&limit=limit&transaction_type=transaction_type
                            wallet_id - wallet id, skip - skip value (initial value 0) , limit - limit to show in table (initial 10) , transaction_type(optional) -  for credit: 1, for debit: 0
5. Export transactions - **GET**  /export_transactions/:wallet_id 
                   
