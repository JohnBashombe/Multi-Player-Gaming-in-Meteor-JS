import { Meteor } from "meteor/meteor";

Meteor.methods({

    'playGame': (userId, choice, amount) => {
        return thisPlayGame(userId, choice, amount);
    }

});

thisPlayGame = (userId, choice, amount) => {

    if (isEmpty(userId)) throw new Meteor.Error('error');
    if (isEmpty(choice)) throw new Meteor.Error('error');
    if (isEmpty(amount)) throw new Meteor.Error('error');
    if (!checkNumber(amount)) throw new Meteor.Error('error');
    if (!choiceLength(choice)) throw new Meteor.Error('error');

    trimInput(amount); trimInput(choice); trimInputID(userId);

    let findUser = 'none'; let resultPlay = 'none';
    let playerChallengeId = 'none'; let playerChallengeTeam = 'none';
    let hostId = 'none';

    let gameID = 'none'; let initialChoice = ''; let maxGames = '';
    let userBalance = 0; let coupon = 0;

    UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

        if (userId.toString() === doc.userId) { findUser = 'exist'; }

        gameID = doc.gameToPlay;
        initialChoice = doc.choice1;
        maxGames = doc.remainGames;
        userBalance = doc.balance;
        coupon = doc.coupon;

        playerChallengeId = doc.challengeId;
        playerChallengeTeam = doc.challengeTeam;
        hostId = doc.hostId;
    });

    if (findUser.toString() === 'none') { throw new Meteor.Error('error') }

    else if (findUser.toString() === 'exist') {

        if (gameID.toString() === 'none') { throw new Meteor.Error('error'); }

        else {

            let userChoice1 = ''; let userChoice2 = ''; let userChoice3 = '';

            let currentPlayers = 0; let total = 0;

            let setterId = 'none';
            let setterChallengeId = 'none';
            let setterChallengeTeam = 'none';
            let hostSetterId = 'none';
            let gameValidity = 'none';
            // used to check weither the game has exceeded 20 max of total
            let priviledge = 'none';
            // get all needed games results
            Games.find({ _id: gameID }, { limit: 1 }).map((doc) => {

                if (gameID.toString() === doc._id) gameValidity = 'valid';

                userChoice1 = doc.choice1;
                userChoice2 = doc.choice2;
                userChoice3 = doc.choice3;
                currentPlayers = doc.currentPlayers;
                total = doc.games;
                setterId = doc.userId;
                priviledge = doc.priviledge;

            });

            if (gameValidity.toString() === 'none') throw new Meteor.Error('finished');

            else if (gameValidity.toString() === 'valid') {


                let remain = parseInt(total) - parseInt(currentPlayers);
                if (remain <= 0) throw new Meteor.Error('error');
                if (amount >= maxGames) amount = maxGames;
                if (amount >= remain) amount = remain;

                UserDetails.find({ 'userId': setterId }, { limit: 1 }).map((docx) => {
                    setterChallengeId = docx.challengeId;
                    setterChallengeTeam = docx.challengeTeam;
                    hostSetterId = docx.hostId;
                });

                let userInput = '';
                let getChoice3 = '';

                if (initialChoice.toString() === 'b') {
                    if (choice.toString() === 'p') { userInput = 'bpg'; getChoice3 = 'g'; }
                    else if (choice.toString() === 'g') { userInput = 'bgp'; getChoice3 = 'p'; }
                }

                else if (initialChoice.toString() === 'p') {
                    if (choice.toString() === 'b') { userInput = 'pbg'; getChoice3 = 'g'; }
                    else if (choice.toString() === 'g') { userInput = 'pgb'; getChoice3 = 'b'; }
                }

                else if (initialChoice.toString() === 'g') {
                    if (choice.toString() === 'b') { userInput = 'gbp'; getChoice3 = 'p'; }
                    else if (choice.toString() === 'p') { userInput = 'gpb'; getChoice3 = 'b'; }
                }

                let gameCorrectPath = '';
                gameCorrectPath = userChoice1 + userChoice2 + userChoice3;

                // Calculate the bill to add or reduce
                let payingCost = 0;
                let reduceCost = couponCredit() * parseInt(coupon);
                reduceCost = formatBalance(reduceCost);

                if (reduceCost <= 0) reduceCost = 0;
                // it will be used to calculate the bonus and the profit
                let realCost = minimumCost() * amount;
                realCost = formatBalance(realCost);

                payingCost = realCost - reduceCost;
                payingCost = formatBalance(payingCost);

                // if the game has been won by a player the this will be the winning rate
                let bonus = (realCost * profitDegree()) / 100;
                let profit = parseFloat(bonus) + parseFloat(realCost);

                bonus = formatBalance(bonus);
                profit = formatBalance(profit);
                userBalance = formatBalance(userBalance);

                if (payingCost <= 0) payingCost = 0;

                if (parseFloat(userBalance) >= parseFloat(payingCost)) {

                    let success = 'none';
                    if (userInput.toString() === gameCorrectPath.toString()) {

                        // The player has won this game
                        if (playerChallengeId.toString() === 'none') {
                            // console.log('The player has won the game and not in challenge mode');
                            // console.log('His Games are: ' + amount);
                            // console.log('His win is: ' + bonus);
                            // The player has won the game but not in challenge
                            UserDetails.update({ 'userId': userId },
                                {
                                    $inc: { 'balance': + bonus, 'bonusCalc': amount },
                                    $set: { 'coupon': 0, 'gameToPlay': 'none', 'choice1': '', 'remainGames': 0 },
                                    $addToSet: { currentGame: gameID }
                                });

                            // console.log('This Player ID in details is: ' + thisPlayerId);

                        } else {

                            let shareWin = amount * 2;
                            // The player has won the game
                            UserDetails.update({ 'userId': userId },
                                {
                                    $inc: { 'challengeBalance': + bonus, 'shareCalc': + shareWin, 'bonusCalc': amount },
                                    $set: { 'coupon': 0, 'gameToPlay': 'none', 'choice1': '', 'remainGames': 0 },
                                    $addToSet: { currentGame: gameID }

                                }, (err) => {
                                    if (err) {
                                        throw new Meteor.Error('error');
                                    } else {

                                        let alphaGames = 0;
                                        let betaGames = 0;
                                        // calulate games to add to challenge statistics
                                        if (playerChallengeTeam.toString() === 'alpha') {
                                            alphaGames = amount;
                                            betaGames = 0;
                                        }
                                        else if (playerChallengeTeam.toString() === 'beta') {
                                            alphaGames = 0;
                                            betaGames = amount;
                                        }

                                        Challenges.update({ _id: playerChallengeId }, {
                                            $inc: { 'alphaGamesWon': + alphaGames, 'betaGamesWon': + betaGames }
                                        });

                                    }
                                });

                            // console.log('The player has won the game and he is in challenge mode');
                            // console.log('His Games are: ' + amount);
                            // console.log('His win is: ' + bonus);
                            // console.log('The share win is: ' + shareWin);
                        }

                        UserDetails.update({ 'userId': setterId }, {
                            $inc: { 'bonusCalc': + amount }
                        });

                        Games.update({ _id: gameID }, { $inc: { 'lost': + amount, 'currentPlayers': + amount } },
                            (err) => {
                                if (err) {
                                    throw new Meteor.Error('error');
                                } else {
                                    // update the user player bonus
                                    updateBonusValue(userId, hostId);
                                    // update the setter player bonus
                                    updateBonusValue(setterId, hostSetterId);
                                }
                            });
                        success = 'won';
                        resultPlay = 'won';
                        // Update Both players and host bonus
                    }

                    else if (userInput.toString() !== gameCorrectPath.toString()) {

                        // console.log('The player has failed the game and loose : ' + payingCost);
                        // console.log('His Games are: ' + amount);

                        // The player has failed the game thus reduce his playing amount
                        UserDetails.update({ 'userId': userId }, {
                            $inc: { 'balance': - payingCost, 'bonusCalc': + amount },
                            $set: { 'coupon': 0, 'gameToPlay': 'none', 'choice1': '', 'remainGames': 0 },
                            $addToSet: { currentGame: gameID }
                        });

                        if (setterChallengeId.toString() === 'none') {

                            // console.log('The Setter has won the game and not in challenge mode');
                            // console.log('His Games are: ' + amount);
                            // console.log('His win is: ' + profit);

                            UserDetails.update({ 'userId': setterId }, {
                                $inc: { 'balance': + profit, 'bonusCalc': + amount }
                            });

                        } else {

                            let shareWin = amount * 2;

                            UserDetails.update({ 'userId': setterId }, {

                                $inc: { 'challengeBalance': + profit, 'shareCalc': + shareWin, 'bonusCalc': + amount }

                            }, (err) => {
                                if (err) {
                                    throw new Meteor.Error('error');
                                } else {

                                    let alphaGames = 0;
                                    let betaGames = 0;

                                    if (setterChallengeTeam.toString() === 'alpha') {
                                        alphaGames = amount;
                                        betaGames = 0;
                                    }
                                    else if (setterChallengeTeam.toString() === 'beta') {
                                        alphaGames = 0;
                                        betaGames = amount;
                                    }

                                    Challenges.update({ _id: setterChallengeId }, {
                                        $inc: { 'alphaGamesWon': + alphaGames, 'betaGamesWon': + betaGames }
                                    });
                                }
                            });

                            // console.log('The Setter has won the game and he is in challenge mode');
                            // console.log('His Games are: ' + amount);
                            // console.log('His win is: ' + profit);
                            // console.log('The share win is: ' + shareWin);
                        }

                        Games.update({ _id: gameID }, { $inc: { 'won': + amount, 'currentPlayers': + amount } }, (err) => {
                            if (err) {
                                throw new Meteor.Error('error');
                            } else {
                                // update the user player bonus
                                updateBonusValue(userId, hostId);
                                // update the setter player bonus
                                updateBonusValue(setterId, hostSetterId);
                            }
                        });

                        success = 'lost';
                        resultPlay = 'lost';
                    }

                    else throw new Meteor.Error('error');

                    // Insert into History Collection
                    let year = new Date().getFullYear();
                    let month = new Date().getMonth() + 1;
                    let day = new Date().getDate();

                    let todayDate = month + '/' + day + '/' + year;

                    if (success !== 'none') {
                        // Insert into the history for better statistics calculations
                        History.insert({
                            gameId: gameID,
                            setterId: setterId,
                            playerId: userId,
                            games: total,
                            choice1: initialChoice,
                            choice2: choice,
                            choice3: getChoice3,
                            status: success,
                            amount: amount,
                            profit: bonus,
                            challengeId: playerChallengeId,
                            challengeTeam: playerChallengeTeam,
                            priviledge: priviledge,
                            todayDate: todayDate,
                            createdAt: new Date(),
                        });
                    }

                    // if the Game is Closed then delete the Game from the Collection

                    let closeTotal = 0; let closeCurrent = 0; let won = 0; let lost = 0;

                    Games.find({ _id: gameID }, { limit: 1 }).map((doc) => {
                        closeCurrent = doc.currentPlayers;
                        closeTotal = doc.games;
                        won = doc.won;
                        lost = doc.lost;
                    });

                    if (closeTotal <= closeCurrent) {
                        HistorySetter.insert({
                            gameId: gameID,
                            setterId: setterId,
                            games: closeTotal,
                            finalGames: closeTotal,
                            won: won,
                            lost: lost,
                            choice1: userChoice1,
                            choice2: userChoice2,
                            choice3: userChoice3,
                            status: 'Finished',
                            challengeId: setterChallengeId,
                            challengeTeam: setterChallengeTeam,
                            priviledge: priviledge,
                            todayDate: todayDate,
                            createdAt: new Date(),
                        }, (err) => {
                            if (err) {
                                throw new Meteor.Error('error');
                            } else {
                                Games.remove({ _id: gameID });
                            }
                        });
                    }
                }
                else throw new Meteor.Error('balance');
            }
            else throw new Meteor.Error('error');
        }
    }
    else throw new Meteor.Error('error');
    return resultPlay;
}

updateBonusValue = (userId, hostId) => {

    // Fetch the Id of the host to update his account too
    let userBonus = UserDetails.findOne({ 'userId': userId }).bonusCalc;
    let coupon = 0;
    let hostPortion = 0;

    // reward for 1 bonus
    if (parseInt(userBonus) >= 4 && parseInt(userBonus) <= 7) {
        coupon = 1;
        // console.log('Coupon is 1 that means The host will not receive anything');
    }
    // reward for 2 bonuses
    else if (parseInt(userBonus) >= 8 && parseInt(userBonus) <= 11) {

        let random = Math.round(Math.random() * 1);

        if (random === 0) coupon = 1;
        // console.log('The random is: ' + coupon);
        if ((hostId.toString() !== 'none') && (random === 1)) { coupon = 1; hostPortion = 1; }
        // console.log('The user will receive ' + coupon + ' and the host will receive ' + hostPortion);
    }

    //reward for 3 bonuses
    else if (parseInt(userBonus) >= 12 && parseInt(userBonus) <= 15) {

        let random = Math.round(Math.random() * 1);

        if (random === 0) {
            if (hostId.toString() !== 'none') { coupon = 1; hostPortion = 1; }
            else { coupon = 2; }
        }

        else if (random === 1) {
            if (hostId.toString() !== 'none') { coupon = 2; hostPortion = 1; }
            else { coupon = 3; }
        }
        // console.log('The user will receive ' + coupon + ' and the host will receive ' + hostPortion);
    }

    // reward for 4 bonuses
    else if (parseInt(userBonus) >= 16 && parseInt(userBonus) <= 19) {

        let random = Math.round(Math.random() * 1);

        if (random === 0) {
            if (hostId.toString() !== 'none') { coupon = 2; hostPortion = 1; }
            else { coupon = 3; }
        }

        else if (random === 1) {
            if (hostId.toString() !== 'none') { coupon = 3; hostPortion = 1; }
            else { coupon = 4; }

        }
        // console.log('The user will receive ' + coupon + ' and the host will receive ' + hostPortion);
    }

    // reward for 5 bonuses
    else if (parseInt(userBonus) >= 20) {

        let random = Math.round(Math.random() * 1);

        if (random === 0) {
            if (hostId.toString() !== 'none') { coupon = 3; hostPortion = 1; }
            else { coupon = 4; }
        }

        else if (random === 1) {
            if (hostId.toString() !== 'none') { coupon = 4; hostPortion = 1; }
            else { coupon = 5; }
        }
        // console.log('The user will receive ' + coupon + ' and the host will receive ' + hostPortion);
    }

    if (coupon > 0) {

        let userDue = 0;

        let challengeUserStatus = UserDetails.findOne({ 'userId': userId }).challengeId;

        if (challengeUserStatus.toString() !== 'none') { userDue = coupon * 2; }

        UserDetails.update({ 'userId': userId }, { $inc: { 'coupon': + coupon, 'shareCalc': + userDue }, $set: { 'bonusCalc': 0 } },
            (err) => {
                if (err) throw new Meteor.Error('error');
            });


        if (hostId.toString() !== 'none') {

            let hostDue = 0;
            let challengeHostStatus = UserDetails.findOne({ 'userId': hostId }).challengeId;

            if (challengeHostStatus.toString() !== 'none') { hostDue = hostPortion * 2; }

            UserDetails.update({ 'userId': hostId }, { $inc: { 'coupon': + hostPortion, 'shareCalc': + hostDue } },
                (err) => {
                    if (err) throw new Meteor.Error('error');
                });
        }

    }
}

