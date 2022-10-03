import { Meteor } from "meteor/meteor";

Meteor.methods({

    'cancelGame': (gameId, userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(gameId)) throw new Meteor.Error('error');
        trimInputID(userId);
        trimInputID(gameId);

        let userVerifier = 'none'; let currentP = ''; let totalP = ''; let cashout = 'none';
        let challengeId = 'none'; let challengeTeam = 'none'; let todayDate = 'none';
        let won = 0; let lost = 0;
        let userChoice1 = 'none'; let userChoice2 = 'none';
        let userChoice3 = 'none'; let verifiyGame = 'none';
        let priviledge = 'none';

        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            Games.find({ $and: [{ _id: gameId, 'userId': userId }] }, { limit: 1 }).map((doc) => {

                if (gameId.toString() === doc._id) verifiyGame = 'valid';

                currentP = doc.currentPlayers;
                totalP = doc.games;
                cashout = doc.cashout;
                challengeId = doc.challengeId;
                challengeTeam = doc.challengeTeam;
                todayDate = doc.todayDate;
                won = doc.won;
                lost = doc.lost;
                userChoice1 = doc.choice1;
                userChoice2 = doc.choice2;
                userChoice3 = doc.choice3;
                priviledge = doc.priviledge;

            });

            if (verifiyGame.toString() === 'none') throw new Meteor.Error('error');

            else if (verifiyGame.toString() === 'valid') {

                if (cashout.toString() === 'none') throw new Meteor.Error('done');
                else if (cashout.toString() === 'denied') throw new Meteor.Error('error');
                else if (cashout.toString() === 'allow') {
                    let amountBack = parseInt(totalP) - parseInt(currentP);
                    let amount = parseInt(amountBack) * minimumCost();

                    if (parseInt(amountBack) <= 0) throw new Meteor.Error('done');
                    else {

                        UserDetails.update({ 'userId': userId },
                            {
                                $inc: { 'balance': + amount },
                                $set: { 'coupon': 0, 'bonusCalc': 0 }
                            });

                        let finalGames = (totalP - amountBack);

                        HistorySetter.insert({
                            gameId: gameId,
                            setterId: userId,
                            games: totalP,
                            finalGames: finalGames,
                            won: won,
                            lost: lost,
                            choice1: userChoice1,
                            choice2: userChoice2,
                            choice3: userChoice3,
                            status: 'Canceled',
                            challengeId: challengeId,
                            challengeTeam: challengeTeam,
                            priviledge: priviledge,
                            todayDate: todayDate,
                            createdAt: new Date(),
                        }, (err) => {
                            if (err) {
                                throw new Meteor.Error('error');
                            } else {
                                Games.remove({ _id: gameId });
                            }
                        });

                        // Insert into the setter history

                        // Games.remove({ _id: gameId });
                    }
                }

                else throw new Meteor.Error('error');
            }
            else throw new Meteor.Error('error');
        }
        else throw new Meteor.Error('Error');
    },

    'cashOutAmount': (gameId, userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('userId');
        if (isEmpty(gameId)) throw new Meteor.Error('userId');
        trimInputID(userId);
        trimInputID(gameId);

        let userVerifier = 'none'; let currentP = ''; let totalP = ''; let amount = 0;

        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            Games.find({ $and: [{ _id: gameId, 'userId': userId }] }, { limit: 1 }).map((doc) => {
                currentP = doc.currentPlayers;
                totalP = doc.games;
            });

            let amountBack = parseInt(totalP) - parseInt(currentP);
            amount = parseInt(amountBack) * minimumCost();
        }
        else throw new Meteor.Error('Error');

        return formatBalance(amount);
    },
});