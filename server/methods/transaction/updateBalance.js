import { Meteor } from "meteor/meteor";
import { Client } from '../coinbase/index.js';

// this method will be used to load and process the balance of users inside of woh app
// after every calcuated amount of time it will be executed to update users balance account
// it should be fetching data to the coinbase api

apiKeyBalance = () => 'e7JVNoiWTuKGzKeR';
apiSecretKeyBalance = () => 'bUvFLwE41iLPMRKImypIZNgkbZIevIDX';

loadUserUpdateBalance = (userId) => {
    // logic here to execute
    const apiKey = apiKeyBalance();
    const apiSecret = apiSecretKeyBalance();
    let id = 'fd891985-e186-5d73-bf9e-aff5932e5ccf';

    const bound = Meteor.bindEnvironment((callback) => { callback(); });

    let client = new Client({
        'apiKey': apiKey,
        'apiSecret': apiSecret
    });

    client.getAccount(id, (err, account) => {

        // console.log('The account details are: ' + account);
        // client.getNotifications({}, (err, ntfs) => {
        //     console.log('Notifications are: ' + ntfs);
        // });

        bound(() => {
            if (err) {
                // console.log('The coinbase account error is: ' + err);
            }
            else {

                UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

                    // get the current user address
                    // let userAddress = '';
                    // let thisUserId = '';

                    let userAddress = doc.btcAddress;
                    // get the user Id
                    let thisUserId = doc.userId;
                    // console.log('user address Up: ' + doc.btcAddress);

                    if (userAddress.toString() !== 'none') {

                        // console.log('user address In: ' + doc.btcAddress);
                        // console.log('User Email: ' + Meteor.users.findOne({ _id: doc.userId }).emails[0].address);
                        // 37U9iyEz57Loq4UMVLKGKZsxqffEoPdrkb
                        // 3KDy8YkKsjhehbN3Ua3Y6p8hRvbnnb3u8n
                        // get the current address details

                        account.getAddress(userAddress, (err, address) => {
                            // console.log('The Address details are: ' + address);

                            bound(() => {
                                if (err) {
                                    // console.log('The error address');
                                }
                                else {
                                    // get the address transactions details
                                    address.getTransactions({}, (err, data) => {
                                        // console.log('Address data: ' + data);
                                        bound(() => {
                                            if (err) {
                                                // console.log('loading address error: ' + err);
                                            }

                                            else {

                                                if (data.length > 0) {
                                                    // get the balance attached to the transaction
                                                    let balance = data[0].amount.amount;
                                                    // get the status of transaction - completed
                                                    let status = data[0].status;
                                                    // get the type of transaction - send
                                                    let type = data[0].type;
                                                    // get the currency of transaction - BTC
                                                    let currency = data[0].amount.currency;

                                                    // get the year
                                                    let year = new Date().getFullYear();
                                                    // get the month
                                                    let month = new Date().getMonth() + 1;
                                                    // get the date of the current date
                                                    let day = new Date().getDate();
                                                    // store the date in a variable
                                                    let todayDate = month + '/' + day + '/' + year;
                                                    // Type: send Status: completed amount: 0.00135225 currency: BTC

                                                    // verify the type, status, currency 
                                                    if ((type.toString() === 'send') && (status.toString() === 'completed') && (currency.toString() === 'BTC')) {

                                                        // console.log('Type: ' + data[0].type + ' Status: ' + data[0].status + ' amount: ' + data[0].amount.amount +
                                                        //     ' currency: ' + data[0].amount.currency);

                                                        // if the update is completed
                                                        // then insert it into the transaction collection

                                                        UserDetails.update({ 'userId': thisUserId },
                                                            {
                                                                $set: { 'btcAddress': 'none' }

                                                            }, (err) => {
                                                                if (err) {
                                                                    // console.log('the error while updating the address is: ' + err);
                                                                }
                                                                else {
                                                                    Transaction.update({ 'btcAddress': userAddress },
                                                                        {
                                                                            $set: { 'status': 'COMLETED' }

                                                                        }, (err) => {
                                                                            // if (err) {
                                                                            //     // console.log('The error on updating is: ' + err);
                                                                            // }
                                                                            // else {
                                                                            //     // balance: 0.000102 BTC
                                                                            //     // pending: 0.00010050 BTC
                                                                            //     // expected: 0.00020250 -> 0.000202
                                                                            //     // console.log('Transaction STOP is: ' + Transaction.findOne({ 'btcAddress': userAddress }).status);
                                                                            //     // console.log('User ID STOP: ' + Transaction.findOne({ 'btcAddress': userAddress }).userId);
                                                                            //     // console.log('Address STOP: ' + Transaction.findOne({ 'btcAddress': userAddress }).btcAddress);
                                                                            //     // console.log('The transaction has been updated to complete');
                                                                            // }
                                                                        });
                                                                }
                                                            })


                                                        //     }
                                                        // });

                                                    }

                                                    else if ((type.toString() === 'send') && (status.toString() === 'pending') && (currency.toString() === 'BTC')) {

                                                        let existTrans = 'none';

                                                        Transaction.find({ 'btcAddress': userAddress }, { limit: 1 }).map((doc) => {
                                                            if (doc._id.toString() !== 'none') existTrans = 'exist';
                                                        });

                                                        // console.log('The address in inside is: ' + userAddress);
                                                        // Transaction.remove({ 'btcAddress': userAddress });
                                                        if (existTrans.toString() === 'none') {

                                                            // console.log('The address to insert is: ' + userAddress);

                                                            UserDetails.update({ 'userId': thisUserId }, {
                                                                $inc: { 'balance': + balance }
                                                            }, (err) => {

                                                                if (err) {
                                                                    // console.log('user update error');
                                                                }
                                                                else {

                                                                    Transaction.insert({
                                                                        'userId': thisUserId,
                                                                        'amount': balance,
                                                                        'date': todayDate,
                                                                        'status': 'PENDING',
                                                                        'operation': 'DEPOSIT',
                                                                        'btcAddress': userAddress,
                                                                        'createdAt': new Date(),
                                                                    }, (err) => {
                                                                        // if (err) {
                                                                        //     // console.log('error is: ' + err);
                                                                        // }
                                                                        // else {
                                                                        //     console.log('Transaction inserted for the firt time');
                                                                        //     console.log('Address add is: ' + Transaction.findOne({ 'btcAddress': userAddress }).btcAddress);
                                                                        // }
                                                                    });

                                                                }
                                                            });


                                                        }
                                                        // else {
                                                        //     console.log('Transaction is: ' + Transaction.findOne({ 'btcAddress': userAddress }).status);
                                                        //     console.log('User ID: ' + Transaction.findOne({ 'btcAddress': userAddress }).userId);
                                                        //     console.log('Address: ' + Transaction.findOne({ 'btcAddress': userAddress }).btcAddress);
                                                        //     console.log('Trans already inserted');
                                                        //     // Transaction.remove({ 'btcAddress': userAddress });
                                                        // }
                                                    }

                                                    // else {
                                                    //     // console.log('bitcoin not valid');
                                                    // }

                                                }
                                                // else {
                                                //     console.log('No address info');
                                                // }
                                            }
                                        });

                                        // console.log('Type: ' + data.type + ' Status: ' + data.status + ' amount: ' + data.amount + ' Currency: ' + data.amount);
                                        // type: send
                                        // status: completed
                                        // amount.amount: 0.25BTC amount.currency  = BTC
                                    });
                                }
                            });
                        });
                    }

                    // else if (userAddress.toString() === 'none') {

                    //     console.log('The address is for sure none for this btc address');

                    // }


                    // else {
                    //     // console.log('No address to verify transactions');
                    // }
                    // console.log('Checking transactions for: ' + userAddress);
                });
            }
        });
    });
}

// loadSequence = () => {
//     // load the initials details
//     // loadUserNotification();
//     Meteor.setInterval(() => {
//         // update the user details every 60s i.e. update the users balance
//         loadUserNotification();
//         // console.log('This method will execute right after 60s of completion of updating users details');
//     }, 60000);
// }

// loadSequence();
