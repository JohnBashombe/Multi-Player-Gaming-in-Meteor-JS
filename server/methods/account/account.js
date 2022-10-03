import { Meteor } from "meteor/meteor";

Meteor.methods({

    'loadUserGames': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none'; let userGames = [];

        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            let i = 0; let userhasGame = 'none';

            Games.find({ 'userId': userId }, { sort: { createdAt: -1 } }).map((doc) => {
                if (userId.toString() === doc.userId) userhasGame = 'userHasGame';

                userGames[i] = doc._id;
                userGames[i + 1] = doc.currentPlayers;
                userGames[i + 2] = doc.games;
                i = i + 3;

            });

            if (userhasGame.toString() === 'none') userGames[0] = 'nothing';
            else if (userhasGame.toString() === 'userHasGame') return userGames;
            else throw new Meteor.Error('error');
        }
        else throw new Meteor.Error('error');
        return userGames;
    },

    'loadFirstGame': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none'; let userGames = [];

        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            let userhasGame = 'none';

            // let priviledge = 'none';

            Games.find({ 'userId': userId }).map((doc) => {

                if (userId.toString() === doc.userId) userhasGame = 'userHasGame';
                userGames[0] = doc.choice1;
                userGames[1] = doc.choice2;
                userGames[2] = doc.currentPlayers;
                userGames[3] = doc.won;
                userGames[4] = doc.lost;
                userGames[5] = doc.challengeId;
                userGames[6] = doc.challengeTeam;
                userGames[7] = doc.todayDate;
                userGames[8] = doc.games;
                userGames[9] = doc._id;
                userGames[10] = doc.cashout;
                priviledge = doc.priviledge;

                if (doc.priviledge.toString() === 'none') {
                    userGames[11] = 'no';
                }

                else if (doc.priviledge.toString() === 'valid') {
                    userGames[11] = 'ok';
                }

            });

            if (userhasGame.toString() === 'none') userGames[0] = 'nothing';
            else if (userhasGame.toString() === 'userHasGame') return userGames;
            else throw new Meteor.Error('error');
        }
        else throw new Meteor.Error('error');
        return userGames;
    },

    'loadOneGame': (userId, gameId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(gameId)) throw new Meteor.Error('error');
        trimInputID(userId); trimInputID(gameId);

        let userVerifier = 'none'; let userGames = [];
        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            Games.find({ $and: [{ _id: gameId, 'userId': userId }] }, { limit: 1 }).map((doc) => {
                userGames[0] = doc.choice1;
                userGames[1] = doc.choice2;
                userGames[2] = doc.currentPlayers;
                userGames[3] = doc.won;
                userGames[4] = doc.lost;
                userGames[5] = doc.challengeId;
                userGames[6] = doc.challengeTeam;
                userGames[7] = doc.todayDate;
                userGames[8] = doc.games;
                userGames[9] = doc._id;
                userGames[10] = doc.cashout;

                if (doc.priviledge.toString() === 'none') {
                    userGames[11] = 'no';
                }

                else if (doc.priviledge.toString() === 'valid') {
                    userGames[11] = 'ok';
                }
            });
        }
        else throw new Meteor.Error('error');
        return userGames;
    },
});