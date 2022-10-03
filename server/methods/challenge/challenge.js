
Meteor.methods({

    'loadStatus': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let checkUser = 'none';
        let chalId = 'none';
        let chalTeam = 'none';
        let userChallengeShare = 0;

        let cancel = 'none';

        let arrayDetails = [];

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

            if (userId.toString() === doc.userId) {
                checkUser = 'exist';
            }
            chalId = doc.challengeId;
            chalTeam = doc.challengeTeam;
            // cancel = doc.closeChallenge;
            userChallengeShare = doc.shareCalc;
            cancel = doc.closeChallenge;

        });

        // check the challenge validity before anything else
        checkOneChallengeValidity(chalId);

        // console.log("Chalenge Id is: " + chalId);
        // console.log("Chalenge Team is: " + chalTeam);

        if (checkUser.toString() === 'none') {
            throw new Meteor.Error('error');
        }
        else if (checkUser.toString() === 'exist') {

            if (chalId.toString() === 'none') {
                arrayDetails[0] = 'none';
                // console.log('This line is executed')
            }

            else {

                let name = '';
                let teamLengthAlpha = 0;
                let teamLengthBeta = 0;

                let timeStart = 0;

                // contains details for the current user
                let totalUsersAlpha = 0;
                let totalUsersBeta = 0;
                let cancelRequest = 0;

                let pourcent = 0;

                let verifiy = 'none';

                Challenges.find({ _id: chalId }, { limit: 1 }).map((doc) => {

                    if (chalId.toString() === doc._id) verifiy = 'exist';

                    name = doc.name;
                    teamLengthAlpha = doc.teamAlpha.length;
                    teamLengthBeta = doc.teamBeta.length;

                    timeStart = doc.duration;
                    totalUsersAlpha = doc.teamAlpha.length;
                    totalUsersBeta = doc.teamBeta.length;
                    cancelRequest = doc.cancelRequest;
                });

                if (verifiy.toString() === 'none') {
                    arrayDetails[0] = 'none';
                    // console.log('The challenge does not exist anymore');
                }

                else if (verifiy.toString() === 'exist') {

                    // console.log('The challenge still exist in the system');
                    // arrayDetails[4] = cancel;
                    let sumShare = 0;

                    UserDetails.find({ $and: [{ 'challengeId': chalId, 'challengeTeam': chalTeam }] }).map((doc) => {
                        sumShare = parseFloat(sumShare) + parseFloat(doc.shareCalc);
                    });

                    // console.log('The total Game for the challenge is: ' + sumShare);

                    let currentShare = 0;
                    if (sumShare === 0) {
                        currentShare = 0;
                        // console.log('Total is ' + sumShare + ' and user share is ' + currentShare);
                    } else {
                        // console.log('Total is different from zero: ' + sumShare + ' and user share is ' + currentShare);
                        currentShare = ((parseFloat(userChallengeShare) * 100) / sumShare);
                    }

                    let countTotalGames = 0;

                    Games.find({ $and: [{ 'challengeId': chalId, 'challengeTeam': chalTeam }] }).map((doc) => {
                        countTotalGames = parseInt(countTotalGames) + doc.games;
                    });

                    let countUserGames = 0;
                    let currentUserGames = 0;

                    Games.find({ $and: [{ 'challengeId': chalId, 'challengeTeam': chalTeam, 'userId': userId }] }).map((doc) => {
                        countUserGames = parseInt(countUserGames) + doc.games;
                        currentUserGames = parseInt(currentUserGames) + doc.currentPlayers;
                    });

                    let userGames = parseInt(countUserGames) - parseInt(currentUserGames);

                    // fetch again the challenge details to find if it is still available
                    let verifiy2 = 'none';
                    Challenges.find({ _id: chalId }, { limit: 1 }).map((doc) => {
                        if (chalId.toString() === doc._id) verifiy2 = 'exist';
                    });

                    if (verifiy2.toString() === 'exist') {
                        // console.log('The challenge was different from none');

                        pourcent = ((parseInt(cancelRequest) * 100) / (parseInt(totalUsersAlpha) + parseInt(totalUsersBeta)));

                        let currentTime = new Date().getTime();

                        arrayDetails[0] = name;
                        arrayDetails[1] = chalTeam;
                        arrayDetails[2] = teamLengthAlpha;
                        arrayDetails[3] = teamLengthBeta;

                        arrayDetails[4] = userGames;
                        arrayDetails[5] = countTotalGames;
                        arrayDetails[6] = timeStart;
                        arrayDetails[7] = currentTime;
                        arrayDetails[8] = currentShare;
                        arrayDetails[9] = pourcent;
                        arrayDetails[10] = cancel;
                        arrayDetails[11] = userChallengeShare;

                    }

                    else {
                        // return an empty array to user
                        arrayDetails[0] = 'none';
                    }

                }

                else {
                    // console.log('The challenge does not exist anymore in last error catching');
                    throw new Meteor.Error('error');
                }
            }
        }

        else {
            throw new Meteor.Error('error');
        }
        // console.log('The return result is : [ ' + arrayDetails + ' ] ');
        return arrayDetails;
    },

    'addChallenge': (userId, chal_name, chal_team) => {

        if (isEmpty(userId)) { throw new Meteor.Error('error'); }
        if (isEmpty(chal_name)) { throw new Meteor.Error('error'); }
        if (isEmpty(chal_team)) { throw new Meteor.Error('error'); }
        if (invalidLengthName(chal_name)) { throw new Meteor.Error('error'); }
        if (isInvalidName(chal_name)) { throw new Meteor.Error('error'); }
        if (!choiceLength(chal_team)) { throw new Meteor.Error('error'); }
        if (chal_team.toString() !== 'a' && chal_team.toString() !== 'b') { throw new Meteor.Error('error'); }

        trimInputID(userId); trimInput(chal_name); trimInput(chal_team);
        // Check if the user has a running challenge already

        // convert the name into lowercases only
        chal_name = chal_name.toLowerCase();
        // console.log('The challenge name to lowercase is: ' + chal_name);

        let checkUser = 'none';
        let cChal = 'none';
        let balance = 0

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) {
                checkUser = 'found';
            }
            cChal = doc.challengeId;
            balance = doc.balance;
        });

        if (checkUser.toString() === 'none') { throw new Meteor.Error('error'); }

        // else if (parseFloat(balance) < 200) {
        else if (parseFloat(balance) < minimumCost()) { throw new Meteor.Error('b'); }

        else if (cChal.toString() === 'none') {

            UserDetails.update({ 'userId': userId },
                {
                    $set: {
                        'challengeBalance': 0,
                        'challengeId': 'none',
                        'challengeTeam': 'none',
                        'closeChallenge': 'false',
                        'shareCalc': 0,
                    }
                }, (err) => {
                    if (err) { throw new Meteor.Error('error'); }
                    else {

                        let next = 'none'; let challengeTeam = 'none';
                        if (chal_team.toString() === 'a') { challengeTeam = 'alpha'; next = 'beta'; }
                        if (chal_team.toString() === 'b') { challengeTeam = 'beta'; next = 'alpha'; }

                        let timeInMillisec = new Date().getTime();

                        let year = new Date().getFullYear();
                        let month = new Date().getMonth() + 1;
                        let day = new Date().getDate();

                        let todayDate = month + '/' + day + '/' + year;

                        let challengeId = Challenges.insert({

                            duration: timeInMillisec,
                            teamAlpha: [],
                            teamBeta: [],
                            alphaGames: 0,
                            alphaPoints: 0,
                            alphaChallengeBalance: 0,
                            alphaGamesWon: 0,
                            betaGames: 0,
                            betaPoints: 0,
                            betaGamesWon: 0,
                            betaChallengeBalance: 0,
                            name: chal_name,
                            nextToInsert: next,
                            cancelRequest: 0,
                            todayDate: todayDate,
                            createdAt: new Date(),
                            challengeAmount: 0,
                            teamWinner: 'none',

                        }, (err) => {
                            if (err) throw new Meteor.Error('error');
                            else {

                                UserDetails.update({ 'userId': userId }, { $set: { 'challengeId': challengeId, 'challengeTeam': challengeTeam } });

                                if (challengeTeam.toString() === 'alpha') {
                                    Challenges.update({ _id: challengeId }, { $addToSet: { 'teamAlpha': userId } });
                                    // console.log('Successfully added to team Alpha and challenge Id is: ' + challengeId);
                                }

                                else if (challengeTeam.toString() === 'beta') {
                                    Challenges.update({ _id: challengeId }, { $addToSet: { 'teamBeta': userId } });
                                    // console.log('Successfully added to team Beta and challenge Id is: ' + challengeId);
                                }
                                else { throw new Meteor.Error('error'); }
                            }
                        });
                    }
                });
        }
        else { throw new Meteor.Error('error'); }
    },

    'loadChallenges': (limit) => {

        if (isEmpty(limit)) throw new Meteor.Error('error')
        if (!checkNumber(limit)) throw new Meteor.Error('error')
        trimInput(limit);

        let arrayChallenges = []; let i = 0; let count = 0;
        limit = limit * 20;

        // used to check all challenges to be loaded for users
        Challenges.find({}, { limit: limit }).map((doc) => {
            // check if this current challenge is still available
            checkOneChallengeValidity(doc._id);
        });

        count = Challenges.find({}).count();
        Challenges.find({}, { limit: limit }).map((doc) => {
            // arrayChallenges.push(doc.name);
            arrayChallenges[i] = doc._id;
            arrayChallenges[i + 1] = doc.name;
            i = i + 2;
        });

        if (count === 0) arrayChallenges[0] = '0'

        return arrayChallenges;
    },

    'loadStatsChallenge': (id) => {

        if (isEmpty(id)) throw new Meteor.Error('error');
        trimInputID(id);

        let details = []; let totalAlphaPlayers = 0; let totalBetaPlayers = 0; let challID = '';
        let none = 'none'; let timeStart = 0; let nextToInsert = 0;

        // check if this current challenge is still available
        checkOneChallengeValidity(id);

        Challenges.find({ _id: id }, { limit: 1 }).map((doc) => {
            if (id.toString() === doc._id) none = 'true'
            totalAlphaPlayers = doc.teamAlpha.length;
            totalBetaPlayers = doc.teamBeta.length;
            challID = doc._id;
            nextToInsert = doc.nextToInsert;
            timeStart = doc.duration;
        });

        if (none.toString() === 'none') throw new Meteor.Error('error')
        else if (none.toString() === 'true') {

            let currentTime = new Date().getTime();
            let allPlayers = parseInt(totalAlphaPlayers) + parseInt(totalBetaPlayers);
            // let timeStart = Challenges.findOne({ _id: chalId }).duration;
            details[0] = challID;
            details[1] = allPlayers;
            details[2] = timeStart;
            details[3] = currentTime;
            details[4] = nextToInsert;
        }
        else throw new Meteor.Error('error')
        return details;
    },

    'joinTeam': (userId, chalId, team) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        if (isEmpty(chalId)) throw new Meteor.Error('error');
        if (isEmpty(team)) throw new Meteor.Error('error');

        if (team.toString() !== 'a' && team.toString() !== 'b') throw new Meteor.Error('error');

        trimInputID(userId); trimInputID(chalId); trimInput(team);
        let checkUser = 'none'; let isChal = 'none';
        let balance = 0;

        // check if this current challenge is still available
        checkOneChallengeValidity(chalId);

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) { checkUser = 'exist'; }
            isChal = doc.challengeId;
            balance = doc.balance;
        });

        if (checkUser.toString() === 'none') throw new Meteor.Error('error');

        // else if (parseFloat(balance) < 200) {
        else if (parseFloat(balance) < minimumCost()) { throw new Meteor.Error('b'); }

        else if (checkUser.toString() === 'exist') {

            if (isChal.toString() === 'none') {

                UserDetails.update({ 'userId': userId },
                    {
                        $set: {
                            'challengeBalance': 0,
                            'challengeId': 'none',
                            'challengeTeam': 'none',
                            'closeChallenge': 'false',
                            'shareCalc': 0,
                        }
                    }, (err) => {
                        if (err) throw new Meteor.Error('error');
                    });

                let checkChal = 'none'; let nextToInsert = 'none';

                Challenges.find({ _id: chalId }, { limit: 1 }).map((doc) => {
                    if (chalId.toString() === doc._id) { checkChal = 'exist'; }
                    nextToInsert = doc.nextToInsert;
                });

                if (checkChal.toString() === 'none') throw new Meteor.Error('error');

                else if (checkChal.toString() === 'exist') {
                    // if the user has selected to join team alpha
                    if (team.toString() === 'a') {

                        if (nextToInsert.toString() === 'beta') throw new Meteor.Error('beta now');

                        else {

                            UserDetails.update({ 'userId': userId },
                                { $set: { 'challengeId': chalId, 'challengeTeam': 'alpha' } });

                            Challenges.update({ _id: chalId }, {
                                $addToSet: { 'teamAlpha': userId },
                                $set: { 'nextToInsert': 'beta' }
                            });
                        }
                    }

                    else if (team.toString() === 'b') {

                        if (nextToInsert.toString() === 'alpha') throw new Meteor.Error('alpha now');

                        else {
                            UserDetails.update({ 'userId': userId },
                                { $set: { 'challengeId': chalId, 'challengeTeam': 'beta' } });

                            Challenges.update({ _id: chalId }, {
                                $addToSet: { 'teamBeta': userId },
                                $set: { 'nextToInsert': 'alpha' }
                            });
                        }
                    }
                    else throw new Meteor.Error('error');
                }
                else throw new Meteor.Error('error');
            }
            else throw new Meteor.Error('error');
        }
        else throw new Meteor.Error('error');
    },

    'closeChallenge': (userId) => {

        // let result = [];

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let checkUser = 'none';
        let challengeId = 'none';
        // let closestatus = 'none';


        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) {
                checkUser = 'exist';
            }
            challengeId = doc.challengeId;
            // closestatus = doc.closeChallenge;
        });

        // check if this current challenge is still available
        checkOneChallengeValidity(challengeId);

        if (checkUser.toString() === 'none') {
            throw new Meteor.Error('error');
        }
        else if (checkUser.toString() === 'exist') {
            UserDetails.update({ 'userId': userId }, { $set: { 'closeChallenge': 'true' } }, (err) => {
                if (err) {
                    throw new Meteor.Error('error');
                } else {

                    Challenges.update({ _id: challengeId }, { $inc: { 'cancelRequest': +1 } }, (err) => {
                        if (err) { throw new Meteor.Error('error'); }

                        else {
                            let totalUsersAlpha = Challenges.findOne({ _id: challengeId }).teamAlpha.length;
                            let totalUsersBeta = Challenges.findOne({ _id: challengeId }).teamBeta.length;
                            let cancelRequest = Challenges.findOne({ _id: challengeId }).cancelRequest;

                            let pourcent = ((parseInt(cancelRequest) * 100) / (parseInt(totalUsersAlpha) + parseInt(totalUsersBeta)));

                            // if the cancel request is more than 10%, then close the challenge
                            if (pourcent >= 10) {
                                // console.log('This challenge is closing now');
                                // console.log('The Closing request is: ' + pourcent + ' % ');
                                closeRequestedChallenge(challengeId);

                            }
                            // else {
                            //     console.log('Cannot close the challenge because the request is under 25: ' + pourcent);
                            // }

                        }
                    });
                }
            });
        }

        else {
            throw new Meteor.Error('error');
        }

    },

    'keepChallenge': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let checkUser = 'none';

        // let closestatus = 'none';
        let challengeId = 'none';
        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) {
                checkUser = 'exist';
            }
            challengeId = doc.challengeId;
            // closestatus = doc.closeChallenge;
        });

        // check if this current challenge is still available
        checkOneChallengeValidity(challengeId);

        // console.log("The closing status is: " + closestatus);
        // console.log("Chalenge Team is: " + chalTeam);

        if (checkUser.toString() === 'none') {
            throw new Meteor.Error('error');
        }
        else if (checkUser.toString() === 'exist') {
            UserDetails.update({ 'userId': userId }, { $set: { 'closeChallenge': 'false' } }, (err) => {
                if (err) {
                    console.log('The error is: ' + err);
                } else {

                    Challenges.update({ _id: challengeId }, { $inc: { 'cancelRequest': -1 } }, (err) => {
                        if (err) {

                        }
                    });
                }
            });

            // let closestatus = 'none';


        }

        else {
            throw new Meteor.Error('error');
        }


    },

    'searchChallenge': (input) => {

        if (isEmpty(input)) throw new Meteor.Error('error');
        if (invalidLengthServer(input)) throw new Meteor.Error('error');
        trimInputID(input);

        // convert the name into lowercases only
        input = input.toLowerCase();
        // console.log('The challenge name to lowercase is: ' + input);

        let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let search = '';

        for (let i = 0; i < input.length; i++) {

            for (let j = 0; j < aplhabet.length; j++) {
                if (input.charAt(i) === aplhabet[j]) {
                    search = search + input.charAt(i);
                }
            }
        }

        let arrayChallenges = [];
        let i = 0;
        let count = 0;

        // count = Challenges.find({}).count();

        Challenges.find({ 'name': { '$regex': search } }, { limit: 10 }).map((doc) => {

            arrayChallenges[i] = doc._id;
            arrayChallenges[i + 1] = doc.name;
            i = i + 2;
            count++;
        });

        if (count === 0) throw new Meteor.Error('empty');

        // console.log('The total Challenge count is: ' + count);
        // console.log('The results are: ' + arrayChallenges);

        return arrayChallenges;

    }
});

isInvalidName = (input) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let err = 'none';

    for (let i = 0; i < input.length; i++) {

        for (let j = 0; j < aplhabet.length; j++) {
            if (input.charAt(i) === aplhabet[j]) {
                // console.log('The Input is: ' + input.charAt(i) + ' and the alphabet is: ' + aplhabet[j]);
                break;
            }

            else if (j === (aplhabet.length - 1)) {
                // console.log('We have found an error here');
                err = 'found';
                break;
            }
        }

        if (err.toString() === 'found') { break; }
    }

    if (err.toString() === 'found') { return true; }
    else { return false; }

}

// this method makes all calculations for a challenge to be closed
closeRequestedChallenge = (challengeId) => {

    let alphaPoints = 0; let alphaHalfShare = 0;
    // Get all users that have this challenge runnning in their account
    UserDetails.find({ $and: [{ 'challengeId': challengeId, 'challengeTeam': 'alpha' }] }).map((doc) => {
        alphaPoints = parseFloat(alphaPoints) + doc.shareCalc;
        alphaHalfShare = parseFloat(alphaHalfShare) + (doc.challengeBalance / 2);
    });

    let betaPoints = 0; let betaHalfShare = 0;
    // Get all users that have this challenge runnning in their account
    UserDetails.find({ $and: [{ 'challengeId': challengeId, 'challengeTeam': 'beta' }] }).map((doc) => {
        betaPoints = parseFloat(betaPoints) + doc.shareCalc;
        betaHalfShare = parseFloat(betaHalfShare) + (doc.challengeBalance / 2);
    });

    // console.log('Alpha points are: ' + alphaPoints);
    // console.log('Beta points are: ' + betaPoints);

    // Store all alpha and beta points to the challenge
    Challenges.update({ _id: challengeId }, {
        $inc: { 'alphaPoints': + alphaPoints, 'betaPoints': + betaPoints },
        $set: { 'alphaChallengeBalance': alphaHalfShare, 'betaChallengeBalance': betaHalfShare }
    });

    // console.log('Alpha amount to share is: ' + alphaHalfShare);
    // console.log('Beta amount to share is: ' + betaHalfShare);

    // we check now which team has won the challenge
    if (parseFloat(alphaPoints) > parseFloat(betaPoints)) {

        // console.log('Team Winner is: Alpha with points : ' + alphaPoints + ' team Beta is: ' + betaPoints);
        // console.log('The current alpha amount to share is: ' + alphaHalfShare);
        // console.log('The current beta amount to share is: ' + betaHalfShare);
        // Team Winner here is alpha

        Challenges.update({ _id: challengeId }, { $set: { 'teamWinner': 'alpha', 'challengeAmount': betaHalfShare } }, (err) => {

            if (err) {
                // console.log('Failed to share the amount winner alpha, Error: ' + err);
                throw new Meteor.Error('error');
            }
            else {

                Challenges.find({ _id: challengeId }, { limit: 1 }).map((doc) => {

                    // divide to beta half amount by the number of players and based on their current points
                    // let userShare = betaHalfShare / doc.teamAlpha.length;

                    for (let i = 0; i < doc.teamAlpha.length; i++) {
                        // add the win from team beta first

                        let userShare = UserDetails.findOne({ 'userId': doc.teamAlpha[i] }).shareCalc;

                        let share = 0;

                        if (alphaPoints === 0) {
                            share = 0;
                        } else {
                            share = userShare / alphaPoints;
                        }

                        let portion = betaHalfShare * share;

                        // console.log('Team Alpha Players: ' + doc.teamAlpha.length);
                        // console.log('Team Alpha Player ID: ' + doc.teamAlpha[i]);
                        // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamAlpha[i] }).emails[0].address);

                        // console.log('Current User points: ' + userShare);
                        // console.log('Current User Share in Pourcentage: ' + (share * 100) + ' %');
                        // console.log('Current User Share Value based on his pourcentage: ' + portion);

                        UserDetails.update({ 'userId': doc.teamAlpha[i] }, { $inc: { 'balance': + portion } }, (err) => {
                            if (err) {
                                throw new Meteor.Error('error');
                            } else {

                                // then add the challenge balance of alpha players
                                UserDetails.find({ 'userId': doc.teamAlpha[i] }, { limit: 1 }).map((docx) => {

                                    // console.log('Fetched user Id is: ' + docx.userId);
                                    // console.log('Fetched user Balance is: ' + docx.balance);
                                    // console.log('Fetched user Challenge Balance is: ' + docx.challengeBalance);

                                    // add the challenge balance to the user account
                                    let alphaPrice = docx.challengeBalance;

                                    let totalWin = parseFloat(alphaPrice) + parseFloat(portion);

                                    UserDetails.update({ 'userId': doc.teamAlpha[i] },
                                        {
                                            $inc: { 'balance': + alphaPrice },
                                            $set: {
                                                'challengeBalance': 0,
                                                'challengeId': 'none',
                                                'challengeTeam': 'none',
                                                'closeChallenge': 'false',
                                                'shareCalc': 0,
                                                'lastChallengeId': challengeId,
                                                'lastChallengeTeam': 'alpha',
                                                'lastChallengeWin': totalWin,
                                                'lastChallengeShare': share * 100,
                                            }
                                        }, (err) => {
                                            if (err) {
                                                throw new Meteor.Error('error');
                                            }
                                            // else {
                                            //     // Update the challenge balance to 0
                                            //     console.log('User in team Alpha has received his win and his challenge win');

                                            // }

                                        });

                                });

                            }
                        });

                    }

                    // Add the half challenge balance to beta players

                    for (let i = 0; i < doc.teamBeta.length; i++) {

                        let userShare = UserDetails.findOne({ 'userId': doc.teamBeta[i] }).shareCalc;

                        let share = 0;
                        if (betaPoints === 0) {
                            share = 0;

                        } else {
                            share = (userShare / betaPoints) * 100;
                        }

                        UserDetails.find({ 'userId': doc.teamBeta[i] }, { limit: 1 }).map((docx) => {

                            // console.log('Team Beta Players: ' + doc.teamBeta.length);
                            // console.log('Team Beta Player ID: ' + doc.teamBeta[i]);
                            // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamBeta[i] }).emails[0].address);

                            let betaPrice = parseFloat(docx.challengeBalance) / 2;

                            UserDetails.update({ 'userId': doc.teamBeta[i] },
                                {
                                    $inc: { 'balance': + betaPrice },
                                    $set: {
                                        'challengeBalance': 0,
                                        'challengeId': 'none',
                                        'challengeTeam': 'none',
                                        'closeChallenge': 'false',
                                        'shareCalc': 0,
                                        'lastChallengeId': challengeId,
                                        'lastChallengeTeam': 'beta',
                                        'lastChallengeWin': - betaPrice,
                                        'lastChallengeShare': share,
                                    }
                                }, (err) => {
                                    if (err) {
                                        // console.log('error is: ' + err);
                                        throw new Meteor.Error('error');
                                    }
                                    // else {
                                    //     // console.log('User in team Beta has received his win');
                                    //     console.log('The process of sharing to beta players loosers has been completed');
                                    // }
                                });
                        });
                    }
                });

                // Add to challenge history and then delete the challenge
                addToChallengeHistory(challengeId);
            }
        });
    }

    else if (parseFloat(betaPoints) > parseFloat(alphaPoints)) {

        // console.log('Team Winner is: Beta with points : ' + betaPoints + ' team alpha is: ' + alphaPoints);
        // console.log('The current alpha amount to share is: ' + alphaHalfShare);
        // console.log('The current beta amount to share is: ' + betaHalfShare);
        // // Team Winner here is alpha

        Challenges.update({ _id: challengeId }, { $set: { 'teamWinner': 'beta', 'challengeAmount': alphaHalfShare } }, (err) => {

            if (err) {
                // console.log('Failed to share the amount winner beta, Error: ' + err);
                throw new Meteor.Error('error');
            } else {

                Challenges.find({ _id: challengeId }, { limit: 1 }).map((doc) => {

                    // divide to beta half amount by the number of players and based on their current points
                    // let userShare = betaHalfShare / doc.teamAlpha.length;

                    for (let i = 0; i < doc.teamBeta.length; i++) {
                        // add the win from team beta first

                        let userShare = UserDetails.findOne({ 'userId': doc.teamBeta[i] }).shareCalc;

                        let share = 0;
                        if (betaPoints === 0) {
                            share = 0;
                        } else {
                            share = userShare / betaPoints;
                        }

                        let portion = alphaHalfShare * share;

                        // console.log('Team Beta Players: ' + doc.teamBeta.length);
                        // console.log('Team Beta Player ID: ' + doc.teamBeta[i]);
                        // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamBeta[i] }).emails[0].address);

                        // console.log('Current User points: ' + userShare);
                        // console.log('Current User Share in Pourcentage: ' + (share * 100));
                        // console.log('Current User Share Value based on his pourcentage: ' + portion);

                        UserDetails.update({ 'userId': doc.teamBeta[i] }, { $inc: { 'balance': + portion } }, (err) => {
                            if (err) {
                                throw new Meteor.Error('error');
                            } else {

                                // then add the challenge balance of alpha players
                                UserDetails.find({ 'userId': doc.teamBeta[i] }, { limit: 1 }).map((docx) => {

                                    // console.log('Fetched user Id is: ' + docx.userId);
                                    // console.log('Fetched user Balance is: ' + docx.balance);
                                    // console.log('Fetched user Challenge Balance is: ' + docx.challengeBalance);

                                    // add the challenge balance to the user account
                                    let betaPrice = docx.challengeBalance;

                                    let totalWin = parseFloat(betaPrice) + parseFloat(portion);

                                    UserDetails.update({ 'userId': doc.teamBeta[i] },
                                        {
                                            $inc: { 'balance': + betaPrice },
                                            $set: {
                                                'challengeBalance': 0,
                                                'challengeId': 'none',
                                                'challengeTeam': 'none',
                                                'closeChallenge': 'false',
                                                'shareCalc': 0,
                                                'lastChallengeId': challengeId,
                                                'lastChallengeTeam': 'beta',
                                                'lastChallengeWin': totalWin,
                                                'lastChallengeShare': share * 100,
                                            }
                                        }, (err) => {
                                            if (err) {
                                                throw new Meteor.Error('error');
                                            }
                                            // else {
                                            //     // Update the challenge balance to 0
                                            //     console.log('User in team Beta has received his win and his challenge win');

                                            // }
                                        });
                                });
                            }
                        });
                    }

                    // Add the half challenge balance to alpha players

                    for (let i = 0; i < doc.teamAlpha.length; i++) {

                        let userShare = UserDetails.findOne({ 'userId': doc.teamAlpha[i] }).shareCalc;

                        let share = 0;
                        if (alphaPoints === 0) {
                            share = 0;

                        } else {
                            share = (userShare / alphaPoints) * 100;
                        }

                        UserDetails.find({ 'userId': doc.teamAlpha[i] }, { limit: 1 }).map((docx) => {

                            // console.log('Team Alpha Players: ' + doc.teamAlpha.length);
                            // console.log('Team Alpha Player ID: ' + doc.teamAlpha[i]);
                            // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamAlpha[i] }).emails[0].address);

                            let alphaPrice = parseFloat(docx.challengeBalance) / 2;

                            UserDetails.update({ 'userId': doc.teamAlpha[i] },
                                {
                                    $inc: { 'balance': + alphaPrice },
                                    $set: {
                                        'challengeBalance': 0,
                                        'challengeId': 'none',
                                        'challengeTeam': 'none',
                                        'closeChallenge': 'false',
                                        'shareCalc': 0,
                                        'lastChallengeId': challengeId,
                                        'lastChallengeTeam': 'alpha',
                                        'lastChallengeWin': - alphaPrice,
                                        'lastChallengeShare': share,
                                    }
                                }, (err) => {
                                    if (err) {
                                        // console.log('error is: ' + err);
                                        throw new Meteor.Error('error');
                                    }
                                    // else {
                                    //     // console.log('User in team Beta has received his win');
                                    //     console.log('The process of sharing to alpha players loosers has been completed');
                                    // }
                                });
                        });
                    }

                });

                // Add to challenge history and then delete the challenge
                addToChallengeHistory(challengeId);
            }
        });

    }

    else if (parseFloat(betaPoints) === parseFloat(alphaPoints)) {
        // team winner is none here, we have a draw here
        // console.log('Team Winner none: 1) Alpha points : ' + alphaPoints + ' and 2) Beta points: ' + betaPoints);

        Challenges.update({ _id: challengeId }, { $set: { 'teamWinner': 'draw', 'challengeAmount': 0 } }, (err) => {

            if (err) {
                // console.log('Failed to share the amount winner draw, Error: ' + err);
                throw new Meteor.Error('error');

            } else {

                Challenges.find({ _id: challengeId }, { limit: 1 }).map((doc) => {

                    // divide to beta half amount by the number of players and based on their current points
                    // let userShare = betaHalfShare / doc.teamBeta.length;

                    // Give the users in team beta their rewards
                    for (let i = 0; i < doc.teamBeta.length; i++) {
                        // add the win from team beta first
                        // console.log('Beta Length is : ' + doc.teamBeta.length);
                        // console.log('Beta Players: ' + doc.teamBeta[i]);
                        let userShare = UserDetails.findOne({ 'userId': doc.teamBeta[i] }).shareCalc;

                        let share = 0;
                        if (betaPoints === 0) {
                            share = 0;

                        } else {
                            share = (userShare / betaPoints) * 100;
                        }


                        // console.log('In Beta share is: ' + share);
                        // console.log('Team Beta Players: ' + doc.teamBeta.length);
                        // console.log('Team Beta Player ID: ' + doc.teamBeta[i]);
                        // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamBeta[i] }).emails[0].address);

                        // then add the challenge balance of alpha players
                        UserDetails.find({ 'userId': doc.teamBeta[i] }, { limit: 1 }).map((docx) => {
                            // add the challenge balance to the user account
                            // console.log('The user in beta exist as : ' + docx.userId);
                            // console.log('The user balance is : ' + docx.balance);
                            let chalBalance = docx.challengeBalance;
                            // console.log('The user Challenge Balance is : ' + docx.challengeBalance);
                            // console.log('The user Challenge Balance new is : ' + chalBalance);

                            UserDetails.update({ 'userId': doc.teamBeta[i] },
                                {
                                    $inc: { 'balance': + chalBalance },
                                    $set: {
                                        'challengeBalance': 0,
                                        'challengeId': 'none',
                                        'challengeTeam': 'none',
                                        'closeChallenge': 'false',
                                        'shareCalc': 0,
                                        'lastChallengeId': challengeId,
                                        'lastChallengeTeam': 'beta',
                                        'lastChallengeWin': chalBalance,
                                        'lastChallengeShare': share,
                                    }

                                }, (err) => {
                                    if (err) {
                                        // console.log('The error is: ' + err);
                                        throw new Meteor.Error('error');
                                    }
                                    // else {
                                    //     // Update the challenge balance to 0,
                                    //     console.log('Successfully updated the user account info in beta team');
                                    //     // return 'success';
                                    //     console.log('We have done with the proccessing of both teams');
                                    //     console.log('We are ready to delete the challenge from the collection and add it to history');
                                    //     // add the challenge to history of challenges
                                    //     // addToChallengeHistory(challengeId);
                                    // }

                                });

                        });

                    }

                    // Give the users in team alpha their rewards
                    for (let i = 0; i < doc.teamAlpha.length; i++) {
                        // add the win from team beta first
                        // add the win from team beta first
                        // console.log('Alpha Length is : ' + doc.teamAlpha.length);
                        // console.log('Alpha Players: ' + doc.teamAlpha[i]);
                        let userShare = UserDetails.findOne({ 'userId': doc.teamAlpha[i] }).shareCalc;

                        let share = 0;
                        if (alphaPoints === 0) {
                            share = 0;

                        } else {
                            share = (userShare / alphaPoints) * 100;
                        }

                        // console.log('In Alpha share is: ' + share);
                        // then add the challenge balance of alpha players
                        UserDetails.find({ 'userId': doc.teamAlpha[i] }, { limit: 1 }).map((docx) => {
                            // add the challenge balance to the user account
                            // console.log('The user in Alpha exist as : ' + docx.userId);
                            // console.log('The user balance is : ' + docx.balance);
                            let chalBalance = docx.challengeBalance;
                            // console.log('The user Challenge Balance is : ' + docx.challengeBalance);
                            // console.log('The user Challenge Balance new is : ' + chalBalance);

                            // console.log('Team Alpha Players: ' + doc.teamAlpha.length);
                            // console.log('Team Alpha Player ID: ' + doc.teamAlpha[i]);
                            // console.log('Email Address: ' + Meteor.users.findOne({ _id: doc.teamAlpha[i] }).emails[0].address);

                            UserDetails.update({ 'userId': doc.teamAlpha[i] },
                                {
                                    $inc: { 'balance': + chalBalance },
                                    $set: {
                                        'challengeBalance': 0,
                                        'challengeId': 'none',
                                        'challengeTeam': 'none',
                                        'closeChallenge': 'false',
                                        'shareCalc': 0,
                                        'lastChallengeId': challengeId,
                                        'lastChallengeTeam': 'alpha',
                                        'lastChallengeWin': chalBalance,
                                        'lastChallengeShare': share,
                                    }

                                }, (err) => {
                                    if (err) {
                                        // console.log('The error is: ' + err);
                                        throw new Meteor.Error('error');
                                    }
                                    // else {
                                    //     // Update the challenge balance to 0
                                    //     console.log('Successfully updated the user account info in alpha team');
                                    //     // return 'success';
                                    //     console.log('We have done with the proccessing of both teams');
                                    //     console.log('We are ready to delete the challenge from the collection and add it to history');
                                    //     // add the challenge to history of challenges
                                    // }

                                });
                        });
                    }
                });
            }
        });

        addToChallengeHistory(challengeId);
    }

    else {
        throw new Meteor.Error('error');
    }
}

addToChallengeHistory = (challengeId) => {

    Challenges.find({ _id: challengeId }, { limit: 1 }).map((doc) => {

        ChallengeHistory.insert({
            challengeId: doc._id,
            duration: doc.duration,
            teamAlpha: doc.teamAlpha,
            teamBeta: doc.teamBeta,
            alphaGames: doc.alphaGames,
            alphaPoints: doc.alphaPoints,
            alphaGamesWon: doc.alphaGamesWon,
            alphaChallengeBalance: doc.alphaChallengeBalance,
            betaGames: doc.betaGames,
            betaPoints: doc.betaPoints,
            betaGamesWon: doc.betaGamesWon,
            betaGamesWon: doc.betaGamesWon,
            betaChallengeBalance: doc.betaChallengeBalance,
            name: doc.name,
            nextToInsert: doc.nextToInsert,
            cancelRequest: doc.cancelRequest,
            todayDate: doc.todayDate,
            createdAt: doc.createdAt,
            challengeAmount: doc.challengeAmount,
            teamWinner: doc.teamWinner,
        }, (err) => {
            if (err) {
                // console.log('Failed to add challenge to history list');
                throw new Meteor.Error('error');
            } else {
                // End by deleting the current challenge into the collection of challenges
                Challenges.remove({ _id: challengeId });
                // console.log('Successfully processed and deleted in the collection');
            }
        });

    });

}

checkChallengeValidity = () => {

    // 1 day is equivalent to 86 400 000 ms
    let maximum = 86400000;
    // let duration = 0;
    let currentTime = new Date().getTime();
    // let id = 'none';

    Challenges.find({}).map((doc) => {

        // duration = ;
        let diff = parseInt(currentTime) - parseInt(doc.duration);
        // check if the challenge duration is >= 1 day 
        // if so, then stop the challenge immediately
        // console.log('The diff is: ' + diff + ' for: ' + doc.name + ' and ID: ' + doc._id);
        if (diff >= maximum) {
            // console.log('The last diff is: ' + diff + ' for: ' + doc.name);
            // id = doc._id;
            // get the current challenge and apply closing operations on it
            closeRequestedChallenge(doc._id);
        }

    });
}

checkOneChallengeValidity = (challengeId) => {

    // 1 day is equivalent to 86 400 000 ms
    let maximum = 86400000;
    // let duration = 0;
    let currentTime = new Date().getTime();
    // let id = 'none';

    Challenges.find({ _id: challengeId }, { limit: 1 }).map((doc) => {
        // duration = '';
        let diff = parseInt(currentTime) - parseInt(doc.duration);
        // check if the challenge duration is >= 1 day
        // if so, then stop the challenge immediately
        if (diff >= maximum) {
            // console.log('The diff is: ' + diff + ' for unique challenge: ' + doc.name);
            // id = doc._id;
            // get the current challenge and apply closing operations on it
            closeRequestedChallenge(challengeId);
        }
    });
}

Meteor.setInterval(() => {
    checkChallengeValidity();
}, 15000); 