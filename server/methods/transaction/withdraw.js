import { Meteor } from "meteor/meteor";
import { Client } from '../coinbase/index.js';

Meteor.methods({

    'withdraw': (userId, address, amount) => {
        return processWithdraw(userId, address, amount);
    },

    'sendBitcoin': (userId, password) => {
        return processFinal(userId, password);
    },

    'loadWithdraw': (userId) => {

        if (isEmpty(userId)) { throw new Meteor.Error('error'); }
        trimInputID(userId);

        let details = []; let check = ''; let status = 'none';

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

            if (userId.toString() === doc.userId) check = 'true';

            status = doc.withdrawPaymentStatus;
            details[0] = doc.addressWithdraw;
            details[1] = doc.amountWithdraw;
        });

        if (check.toString() === 'true') {
            if (status.toString() === 'none') throw new Meteor.Error('error');
            if (status.toString() === 'processing') throw new Meteor.Error('process');
        }
        else throw new Meteor.Error('error');

        return details;
    },

    'cancelTransaction': (userId) => {

        if (isEmpty(userId)) { throw new Meteor.Error('error'); }
        trimInputID(userId);

        let check = ''; let cashOut = 0;

        UserDetails.find({ 'userId': userId }).map((doc) => {
            if (userId.toString() === doc.userId) check = 'true';
            cashOut = doc.amountWithdraw;
        });

        if (check.toString() === 'true') {

            let cancel = UserDetails.findOne({ 'userId': userId }).withdrawPaymentStatus;
            if (cancel.toString() === 'processing') throw new Meteor.Error('error');
            else {
                UserDetails.update({ 'userId': userId }, {
                    $inc: { 'balance': +cashOut, 'countcodeWithdraw': +1 },
                    $set: { 'amountWithdraw': 0, 'addressWithdraw': 'none', 'withdrawPaymentStatus': 'none' }
                });
            }
        }

        else throw new Meteor.Error('error');
    },

    'loadLimit': () => {
        return withdrawLimit();
    }
});

apiKey = () => { return 'e7JVNoiWTuKGzKeR'; }

apiSecretKey = () => { return 'bUvFLwE41iLPMRKImypIZNgkbZIevIDX'; }

apiKeyId = () => { return 'fd891985-e186-5d73-bf9e-aff5932e5ccf'; }

processWithdraw = (userId, address, amount) => {

    if (isEmpty(userId)) throw new Meteor.Error('error');
    else if (isEmpty(address)) throw new Meteor.Error('error');
    else if (isEmpty(amount)) throw new Meteor.Error('error');

    trimInputID(userId); trimInput(address); trimInput(amount);

    if (!checkFloat(amount)) throw new Meteor.Error('error');
    else if (isInvalidAddress(address)) throw new Meteor.Error('error');

    else {

        let userExist = 'none';
        let balance = 0;
        let right = 'denied';

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) userExist = 'exist';
            balance = doc.balance;
            // right = doc.withdrawRight;
        });

        if (userExist.toString() === 'none') throw new Meteor.Error('error');

        else if (userExist.toString() === 'exist') {

            let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
            let todayDate = month + '/' + day + '/' + year;

            let rightDate = UserDetails.findOne({ 'userId': userId }).withdrawRightDate;

            if (todayDate.toString() !== rightDate.toString()) {
                // console.log('Date not matched executed in withdraw');
                UserDetails.update({ 'userId': userId }, {
                    $set: { 'withdrawRightDate': todayDate, 'countcodeWithdraw': 0, 'withdrawRight': 'allowed' }
                }, (err) => {
                    if (err) throw new Meteor.Error('error');
                });
            }

            right = UserDetails.findOne({ 'userId': userId }).withdrawRight;
            if (right.toString() === 'denied') throw new Meteor.Error('max');

            let countcode = UserDetails.findOne({ 'userId': userId }).countcodeWithdraw;

            // console.log('The today attemps are: ' + countcode);
            // here we can add some fee for the withdraw but send the current amount to withdraw

            if (parseInt(countcode) < 30) {

                amount = parseFloat(amount).toFixed(6);
                amount = formatBalance(amount);
                balance = formatBalance(balance);

                if ((parseFloat(balance) > 0) &&
                    (parseFloat(balance) >= parseFloat(amount)) &&
                    (parseFloat(amount) >= withdrawLimit())) {

                    // let emailAddress = Meteor.users.findOne({ _id: userId }).emails[0].address;

                    // let password = '';
                    // for (let i = 0; i < 6; i++) { password = password + Math.round(Math.random() * 9); }

                    UserDetails.update({ 'userId': userId }, {
                        $inc: { 'balance': - amount, 'countcodeWithdraw': + 1 },
                        $set: {
                            'amountWithdraw': amount,
                            'addressWithdraw': address,
                            // 'codeWithdraw': password,
                            'withdrawPaymentStatus': 'pending'
                        }
                    }, (err) => {

                        if (err) {
                            throw new Meteor.Error('error');
                        }
                        // else {
                        //     // send an email to the user email address
                        //     // customEmailWithdraw(emailAddress, password, amount, address, todayDate);
                        //     // console.log('The withdrawal password : ' + password + ' for ' + emailAddress);
                        // }
                    });
                }
                else throw new Meteor.Error('error');
            }

            else {
                throw new Meteor.Error('max');
            }
        }
        else throw new Meteor.Error('error');
    }
}

processFinal = (userId, password) => {

    if (isEmpty(userId)) throw new Meteor.Error('error');
    if (isEmpty(password)) throw new Meteor.Error('error');
    // if (!checkNumber(password)) throw new Meteor.Error('error');
    // if (!codeLength(password)) throw new Meteor.Error('error');
    if (maxPasswordLength(password)) throw new Meteor.Error('error');

    trimInputID(userId);
    trimInput(password);

    if (isNotPassword(password)) throw new Meteor.Error('error');
    // console.log('The api keys are: ' + apiKey());

    // throw new Meteor.Error('gone');

    let userExist = 'none';
    // let codeWithdraw = '';
    // used to catch callbacks of api functions
    const bound = Meteor.bindEnvironment((callback) => { callback(); });

    UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
        if (userId.toString() === doc.userId) userExist = 'exist';
    });

    if (userExist.toString() === 'none') throw new Meteor.Error('error');
    else if (userExist.toString() === 'exist') {


        let email = Meteor.users.findOne({ '_id': userId }).emails[0].address;
        let user = Accounts.findUserByEmail(email);
        let result = Accounts._checkPassword(user, password);

        if (result.error === undefined) {
            // Accounts.setPassword(userId, newPassword);
            // Complete the withdraw process
            // address to send to
            let btcAddress = UserDetails.findOne({ 'userId': userId }).addressWithdraw;
            // amount to send to
            let btcValue = UserDetails.findOne({ 'userId': userId }).amountWithdraw;
            // Maximum should be 100 => 10 daily withdraws over 10 attempts 
            let countcode = UserDetails.findOne({ 'userId': userId }).countcodeWithdraw;
            // let codeWithdraw = UserDetails.findOne({ 'userId': userId }).codeWithdraw;

            let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
            let todayDate = month + '/' + day + '/' + year;

            let rightDate = UserDetails.findOne({ 'userId': userId }).withdrawRightDate;

            // if the date are differents, then make the new date to be equal to the today's date
            if (todayDate.toString() !== rightDate.toString()) {
                // console.log('Date not matched executed in password entering');
                UserDetails.update({ 'userId': userId }, {
                    $set: { 'withdrawRightDate': todayDate, 'countcodeWithdraw': 0, 'withdrawRight': 'allowed' }
                }, (err) => {
                    if (err) throw new Meteor.Error('error');
                });
            }

            // console.log('Counting code is: ' + countcode);

            // check if the user has the right to withdraw
            let right = UserDetails.findOne({ 'userId': userId }).withdrawRight;
            if (right.toString() === 'denied') throw new Meteor.Error('max');

            let checkDeposits = 'none';
            // check if the user has some pending deposits balances in his account
            Transaction.find({ 'userId': userId }).map((doc) => {
                if ((doc.operation.toString() === 'DEPOSIT') && (doc.status.toString() === 'PENDING')) {
                    checkDeposits = 'denied';
                }
            });

            if (checkDeposits.toString() === 'denied') {
                throw new Meteor.Error('not-allow');
            }
            else if (checkDeposits.toString() === 'none') {

                if (countcode < 30) {

                    if (btcAddress.toString() !== 'none') {

                        UserDetails.update({ 'userId': userId }, { $set: { 'withdrawPaymentStatus': 'processing' } });

                        // console.log('Code 1 is: ' + codeWithdraw + ' new from user password is: ' + password);
                        // var Client = require('coinbase').Client;

                        let client = new Client({
                            'apiKey': apiKey(),
                            'apiSecret': apiSecretKey()
                        });

                        // let i = 0; let value = 'none';

                        client.getAccount(apiKeyId(), (err, account) => {

                            // console.log('The account info is: ' + account);

                            bound(() => {

                                if (err) {
                                    // console.log('The error from coinbase api is: ' + err);
                                    UserDetails.update({ 'userId': userId }, { $set: { 'withdrawPaymentStatus': 'pending' } });
                                    // throw new Meteor.Error('gone');
                                    // console.log(UserDetails.findOne({ 'userId': userId }).withdrawPaymentStatus);
                                }
                                else {
                                    // console.log('This condition was touched');
                                    // initial value = 0.00135225 BTC
                                    // sending amount = 0.001 BTC

                                    // real sending = -0.00103094 BTC

                                    // expected balance = 0.00035225 BTC
                                    // real balance = 0.00032131 BTC
                                    // 0.00003094 BTC

                                    // receiver expected amount = 0.001 BTC
                                    // receiver balance = 0.00085 BTC

                                    // let transferFee = parseFloat(withdrawLimit() / 2);
                                    // we calculate the transaction fee in pourcentage charged by coinbase platform
                                    let transferFee = (btcValue * 0.05);

                                    // if (parseFloat(btcValue) <= 0.000199) {
                                    //     btcValue = 0.000140;
                                    // }

                                    let sendingAmount = parseFloat(btcValue) - parseFloat(transferFee);

                                    // console.log('The transfer fee is: ' + transferFee);
                                    // console.log('The Initial amount is: ' + btcValue);
                                    // console.log('The Sending amount is: ' + sendingAmount);

                                    account.sendMoney(
                                        {
                                            'to': btcAddress,
                                            'amount': sendingAmount,
                                            'currency': 'BTC'

                                        }, (err) => {

                                            bound(() => {

                                                if (err) {
                                                    // console.log('The sending error is: ' + err);
                                                    UserDetails.update({ 'userId': userId }, { $set: { 'withdrawPaymentStatus': 'pending' } });
                                                    // throw new Meteor.Error('gone');
                                                }
                                                else {

                                                    // value = tx;
                                                    // while (i < 1) {
                                                    //     if (value.toString() === 'none') {
                                                    //         i = 0;
                                                    //     }
                                                    //     else {

                                                    // console.log('The transaction details are: ' + tx);

                                                    // i = 10;
                                                    // Update the user details to initials
                                                    UserDetails.update({ 'userId': userId },
                                                        {
                                                            $inc: { 'countcodeWithdraw': +1 },
                                                            $set: {
                                                                'amountWithdraw': 0,
                                                                'addressWithdraw': 'none',
                                                                'withdrawPaymentStatus': 'none'
                                                            }
                                                        });

                                                    // Insert the record inside of the transaction collection
                                                    Transaction.insert({
                                                        'userId': userId,
                                                        'amount': btcValue,
                                                        'date': todayDate,
                                                        'status': 'COMLETED',
                                                        'operation': 'WITHDRAW',
                                                        'btcAddress': btcAddress,
                                                        'createdAt': new Date(),
                                                    });
                                                }
                                            });
                                        });
                                }
                            });
                        });
                    }
                }
                else {

                    UserDetails.update({ 'userId': userId }, { $set: { 'withdrawRight': 'denied' } }, (err) => {
                        if (err) throw new Meteor.Error('error');
                    });

                    throw new Meteor.Error('max');
                }

            }

            else {
                throw new Meteor.Error('error');
            }

        }
        else if (result.error.toString() === 'Error: Incorrect password [403]') {

            UserDetails.update({ 'userId': userId }, {
                $inc: { 'countcodeWithdraw': +1 }
            });

            throw new Meteor.Error('wrong');
        }
        else throw new Meteor.Error('wrong');
    }
    else throw new Meteor.Error('error');
}
