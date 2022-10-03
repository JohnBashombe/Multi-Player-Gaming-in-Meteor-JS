import { Meteor } from "meteor/meteor";

Meteor.methods({

    'loadBalance': (userId) => {

        let arrayBalance = [];

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let checkUser = 'none'; let normalBalance = 0; let challengeBalance = 0;

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) checkUser = 'valid';
            normalBalance = doc.balance;
            challengeBalance = doc.challengeBalance;
        });

        if (checkUser.toString() === 'none') throw new Meteor.Error('error');

        else {
            arrayBalance[0] = formatBalance(normalBalance);
            arrayBalance[1] = formatBalance(challengeBalance);
        }
        return arrayBalance;
    },

    'updateBalance': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            // insert the code to update the user balance from coinbase api
            if (doc.btcAddress.toString() !== 'none') {
                // load the address details from coinbase
                loadUserUpdateBalance(userId);
                // console.log('The btc address is: ' + doc.btcAddress);
            }
            // else {
            //     console.log('The btc address is: ' + doc.btcAddress);
            // }
        });

        // if (checkUser.toString() === 'none') throw new Meteor.Error('error');
    },

    'userMax': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userBalance = 0; let maxGames = 0;
        let checkuser = 'none';

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) checkuser = 'valid';
            userBalance = doc.balance;
        });

        // console.log('The user balance is: ' + userBalance);
        if (checkuser.toString() === 'none') throw new Meteor.Error('error');
        else if (checkuser.toString() === 'valid') {
            userBalance = formatBalance(userBalance);
            maxGames = Math.floor(parseFloat(userBalance) / minimumCost());
        }

        else throw new Meteor.Error('error');
        return parseInt(maxGames);
    },

    'loadCoupon': (userId) => {

        let userValid = 'none'; let coupon = 0;

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) userValid = 'exist';
            coupon = doc.coupon;
        });

        if (userValid.toString() === 'none') throw new Meteor.Error('error');

        return coupon;
    },

    'totalWin': (games) => {

        if (isEmpty(games)) throw new Meteor.Error('error');
        if (!checkNumber(games)) throw new Meteor.Error('error');
        if (games <= 0) throw new Meteor.Error('error');
        let bonus = ((minimumCost() * profitDegree()) / 100) * games;
        return formatBalance(bonus);

    },

    'totalCost': (games) => {

        if (isEmpty(games)) throw new Meteor.Error('error');
        if (!checkNumber(games)) throw new Meteor.Error('error');
        if (parseInt(games) <= 0) throw new Meteor.Error('error');

        let total = ((games * minimumCost())).toFixed(6);
        if (total <= 0) total = 0;

        return formatBalance(total);
    },

    'totalCostId': (games, userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(games)) throw new Meteor.Error('error');
        if (!checkNumber(games)) throw new Meteor.Error('error');

        if (parseInt(games) <= 0) throw new Meteor.Error('error');
        if (parseInt(games) > 100000) games = 100000;

        trimInputID(userId);

        let findUser = 'none';
        let total = 0;
        let coupon = 0;

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) { findUser = 'exist'; }
            coupon = doc.coupon;
        });

        if (findUser.toString() === 'none') throw new Meteor.Error('error');

        else if (findUser.toString() === 'exist') {

            let reduce = 0;
            reduce = parseInt(coupon) * couponCredit();
            reduce = formatBalance(reduce);
            // console.log('Coupon credit amount is: ' + couponCredit());
            // console.log('Coupon amount is: ' + coupon);
            // console.log('Reduce amount is: ' + reduce);
            // console.log('Games amount is: ' + games);

            // if (games === 1) {
            //     total = minimumCost() - reduce;
            //     console.log('For 1 is: ' + total);
            // }
            // else {
            total = ((games * minimumCost()) - reduce).toFixed(6);
            // console.log('For more than 1 is: ' + total);
            // }
            // console.log('Original Total is: ' + total);

            if (total <= 0) total = 0;
            // console.log('Total from 1 is: ' + total);
            total = formatBalance(total);
            // console.log('Total from 2 after formatting is: ' + total);
        }

        else throw new Meteor.Error('error');
        return total;
    }
});

formatBalance = (amount) => {

    let bal = amount.toString(); let newBal = '';
    let j = 0; let after = 0;

    for (let i = 0; i < bal.length; i++) {
        newBal = newBal + bal.charAt(i);
        if (bal.charAt(i) === '.') after = 1;
        if (after == 1) j = j + 1;
        if (j > 6) break;
    }
    return parseFloat(newBal);
}
