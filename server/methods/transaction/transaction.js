import { Meteor } from "meteor/meteor";

// userId, amount, date, operation, btc Address , created At

Meteor.methods({

    'loadUserTransaction': (userId) => {
        //Transaction
        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        let results = [];
        let check = 'none';

        let i = 5;

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            Transaction.find({ 'userId': userId }, { sort: { createdAt: -1 } }).map((doc) => {
                results[i] = doc._id;
                results[i + 1] = doc.amount;
                i = i + 2;
                check = 'exist';
                // console.log('Transactions is: ' + doc.userId);
            });

            if (check.toString() === 'none') {
                results[0] = '0';
            }

            else {

                Transaction.find({ _id: results[5] }, { limit: 1 }).map((doc) => {

                    results[0] = doc.amount;
                    results[1] = doc.date;
                    results[2] = doc.operation;
                    results[3] = doc.btcAddress;
                    results[4] = doc.status;

                });

            }

        }
        else {
            throw new Meteor.Error('error');
        }

        // console.log("the transactions are: " + results)

        return results;
    },

    'loadFirstTransaction': (userId) => {
        //Transaction
        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        let results = [];
        let check = 'none';

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            Transaction.find({ 'userId': userId }).map((doc) => {
                results[0] = doc._id;
                results[1] = doc.amount;
                check = 'exist';
            });

            if (check.toString() === 'none') {
                results[0] = 'none';
            }

        }
        else {
            throw new Meteor.Error('error');
        }
        return results;
    },

    'loadUniqueTransaction': (userId, transID) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(transID)) throw new Meteor.Error('error');
        trimInputID(userId);
        trimInputID(transID);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        let results = [];

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');

        else if (userVerifier.toString() === 'exist') {

            Transaction.find({ $and: [{ 'userId': userId, '_id': transID }] }, { limit: 1 }).map((doc) => {

                results[0] = doc.amount;
                results[1] = doc.date;
                results[2] = doc.operation;
                results[3] = doc.btcAddress;
                results[4] = doc.status;

            });
        }
        else {
            throw new Meteor.Error('error');
        }
        // console.log('The result is: ' + results);
        return results;

    }

});