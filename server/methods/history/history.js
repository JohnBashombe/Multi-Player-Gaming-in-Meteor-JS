import { Meteor } from "meteor/meteor";

Meteor.methods({

    'loadHistory': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            let arrayGames = []; let i = 0;

            HistorySetter.find({ 'setterId': userId }, { sort: { createdAt: -1 } }).map((doc) => {
                arrayGames[i] = doc.gameId;
                arrayGames[i + 1] = doc.games;
                i = i + 2;
            });

            if (i === 0) { arrayGames[0] = '0'; }
            return arrayGames;
        }

        else { throw new Meteor.Error('error'); }
    },

    'loadHistoryDetails': (userId, gameId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(gameId)) throw new Meteor.Error('error');
        trimInputID(userId);
        trimInputID(gameId);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });


        let results = [];

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            let challengeId = 'none';
            let found = 'none';

            HistorySetter.find({ $and: [{ 'setterId': userId, 'gameId': gameId }] }).map((doc) => {
                // arrayChallenges.push(doc.name);
                results[0] = doc.games;
                results[1] = doc.finalGames;
                results[2] = doc.won;
                results[3] = doc.lost;
                results[4] = doc.status;
                results[5] = doc.todayDate;
                results[6] = doc.challengeId;
                challengeId = doc.challengeId;
                results[7] = doc.choice1;
                results[8] = doc.choice2;
                results[9] = doc.choice3;
                // results[10] = doc.priviledge;
                if (doc.priviledge.toString() === 'none') {
                    results[10] = 'no';
                }

                else if (doc.priviledge.toString() === 'valid') {
                    results[10] = 'ok';
                }

                found = 'true';
            });

            if (challengeId.toString() !== 'none') {
                results[6] = 'true';
            }

            if (found.toString() === 'none') {
                results[0] = 'none';
            }

            // console.log('The results from inside are: ' + results);

        }

        else {
            throw new Meteor.Error('error');
        }

        // console.log('The results are: ' + results)

        return results;

    },

    'lastChallenge': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        let results = [];
        let data = [];

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');
        else if (userVerifier.toString() === 'exist') {

            let found = 'none';

            UserDetails.find({ 'userId': userId }).map((doc) => {
                data[0] = doc.lastChallengeId;
                data[1] = doc.lastChallengeTeam;
                data[2] = doc.lastChallengeWin;
                data[3] = doc.lastChallengeShare;
                found = 'true';
            });

            // console.log('Two last: ' + data[2] + ' and ' + data[3]);

            if (found.toString() === 'none') {
                results[0] = 'none';
            }

            else if (data[0].toString() === 'none') {
                results[0] = 'none';
            }

            else if (found.toString() === 'true') {

                ChallengeHistory.find({ 'challengeId': data[0] }, { limit: 1 }).map((doc) => {

                    results[0] = doc.alphaGames;
                    results[1] = doc.betaGames;
                    results[2] = doc.alphaPoints;
                    results[3] = doc.betaPoints;
                    results[4] = doc.alphaGamesWon;
                    results[5] = doc.betaGamesWon;
                    results[6] = doc.cancelRequest;
                    results[7] = doc.todayDate;
                    results[8] = doc.challengeAmount;
                    results[9] = doc.name;
                    results[10] = doc.teamWinner;
                    results[11] = doc.teamAlpha.length;
                    results[12] = doc.teamBeta.length;
                    results[13] = data[1];
                    results[14] = data[2];
                    results[15] = data[3];
                    results[16] = doc.alphaChallengeBalance;
                    results[17] = doc.betaChallengeBalance;

                });

                if (results[10] === 'beta') {
                    if (data[1] === 'beta') {
                        results[10] = 'WON';

                    } else {
                        results[10] = 'LOST';
                    }
                }

                else if (results[10] === 'alpha') {

                    if (data[1] === 'alpha') {
                        results[10] = 'WON';

                    } else {
                        results[10] = 'LOST';
                    }
                }
                else if (results[10] === 'none') {
                    results[10] = 'DRAW';
                }

                // calculate the current pourcentage of cancel based on the total number of players
                let totalPlayers = parseInt(results[11]) + parseInt(results[12]);
                let request = ((parseInt(results[6]) * 100) / totalPlayers);

                results[6] = request;
            }

            else {
                throw new Meteor.Error('error');
            }

        }
        else {
            throw new Meteor.Error('error');
        }
        // console.log('The results is: ' + results);
        return results;
    }
});