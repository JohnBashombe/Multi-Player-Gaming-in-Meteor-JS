import { Meteor } from "meteor/meteor";

Meteor.methods({

    'loadNewGame': (choice2, choice3, games, userId) => {
        addGame(choice2, choice3, games, userId);
    }
});

addGame = (choice2, choice3, games, userId) => {

    if (isEmpty(choice2)) throw new Meteor.Error('error');
    if (isEmpty(choice3)) throw new Meteor.Error('error');
    if (isEmpty(userId)) throw new Meteor.Error('error');
    if (isEmpty(games)) throw new Meteor.Error('error');
    if (!choiceLength(choice2)) throw new Meteor.Error('error');
    if (!choiceLength(choice3)) throw new Meteor.Error('error');
    if (!checkNumber(games)) throw new Meteor.Error('error');

    if (choice2.toString() !== 'b' && choice2.toString() !== 'p' && choice2.toString() !== 'g') throw new Meteor.Error('error');
    if (choice3.toString() !== 'b' && choice3.toString() !== 'p' && choice3.toString() !== 'g') throw new Meteor.Error('error');

    trimInput(choice2); trimInput(choice3); trimInputID(userId); trimInputGames(games);

    let validateUser = 'none'; let challengeId = 'none'; let challengeTeam = 'none';
    let userBalance = 0; let userCoupon = 0;

    UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

        if (userId.toString() === doc.userId) { validateUser = 'valid'; }
        userBalance = doc.balance;
        challengeBalance = doc.challengeBalance;
        challengeId = doc.challengeId;
        challengeTeam = doc.challengeTeam;
        userCoupon = doc.coupon;
    });

    if (validateUser.toString() === 'none') throw new Meteor.Error('error');

    else if (validateUser.toString() === 'valid') {

        // Start Insertion Logic
        let input1 = ''; let input2 = ''; let input3 = '';

        if (choice2.toString() === 'b' && choice3.toString() === 'p') { input1 = 'g'; input2 = 'b'; input3 = 'p'; }
        else if (choice2.toString() === 'b' && choice3.toString() === 'g') { input1 = 'p'; input2 = 'b'; input3 = 'g'; }
        else if (choice2.toString() === 'p' && choice3.toString() === 'b') { input1 = 'g'; input2 = 'p'; input3 = 'b'; }
        else if (choice2.toString() === 'p' && choice3.toString() === 'g') { input1 = 'b'; input2 = 'p'; input3 = 'g'; }
        else if (choice2.toString() === 'g' && choice3.toString() === 'b') { input1 = 'p'; input2 = 'g'; input3 = 'b'; }
        else if (choice2.toString() === 'g' && choice3.toString() === 'p') { input1 = 'b'; input2 = 'g'; input3 = 'p'; }

        let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
        let todayDate = month + '/' + day + '/' + year;

        let payingCost = 0;
        let reduceCost = couponCredit() * userCoupon;
        reduceCost = formatBalance(reduceCost);

        if (reduceCost <= 0) reduceCost = 0;
        payingCost = (minimumCost() * games) - reduceCost;
        payingCost = formatBalance(payingCost);

        if (payingCost <= 0) payingCost = 0;

        userBalance = formatBalance(userBalance);
        let priviledge = 'none';

        // add the priviledge to all games with a total greater than 19
        // i.e. from 20 and above
        if (parseInt(games) > 19) { priviledge = 'valid'; }

        // Insert the Game into the Game Collection
        if (parseFloat(userBalance) >= parseFloat(payingCost)) {

            let insertGameId = Games.insert({
                userId: userId, // Owner Id
                games: games, // Games set by the user
                choice1: input1, // Choice 1
                choice2: input2, // Choice 2 
                choice3: input3, // Choice 3
                currentPlayers: 0, // Current Players to this Game
                won: 0, // Games won for this current game
                lost: 0, // Games lost to this game
                cashout: 'allow', // The amount the user will be paid back if he cancel the game
                lastStatus: 'finish', // canceled 
                challengeId: challengeId, // User Challenge Id
                challengeTeam: challengeTeam, // User Challenge Team
                todayDate: todayDate, // Get the today date in a wanted format
                priviledge: priviledge, // Get the today date in a wanted format
                createdAt: new Date(), // Current time and date

            }, (err) => {
                if (err) { throw new Meteor.Error('error') }
                else {

                    let alphaGames = 0;
                    let betaGames = 0;

                    // console.log("The game has successfully been added to user ID: " + userId);

                    let shareCalc = 0;
                    if (challengeId.toString() === 'none') {
                        shareCalc = 0;
                        // console.log('The User is not in Challenge and challenge share is: 0');
                    }
                    else {

                        if (challengeTeam.toString() === 'alpha') {
                            alphaGames = games;
                            betaGames = 0;
                        }

                        else if (challengeTeam.toString() === 'beta') {
                            betaGames = games;
                            alphaGames = 0;
                        }

                        shareCalc = parseInt(games) / 2;
                        // console.log('The User is in Challenge mode and challenge share is: ' + shareCalc);
                    }

                    UserDetails.update({ 'userId': userId }, {
                        $inc: { 'balance': - payingCost, 'shareCalc': + shareCalc },
                        $set: { 'coupon': 0 }
                    }, (err) => {

                        if (err) {
                            throw new Meteor.Error('error');
                        } else {
                            // console.log('The user balance has been reduced by: -' + payingCost);
                            if ((reduceCost > 0) || (challengeId.toString() !== 'none')) {
                                // console.log('This user has used a reduction to this game of : ' + reduceCost + ' that means he cannnot cancel that game in any future');
                                Games.update({ _id: insertGameId }, { $set: { 'cashout': 'denied' } }, (err) => {
                                    if (err) {
                                        throw new Meteor.Error('error');
                                    }
                                });
                            }

                            if (challengeId.toString() !== 'none') {
                                Challenges.update({ _id: challengeId },
                                    { $inc: { 'alphaGames': + alphaGames, 'betaGames': + betaGames } }, (err) => {
                                        if (err) {
                                            throw new Meteor.Error('error');
                                        }
                                    });
                            }

                            // we add bonus only when the user game has been played
                            // console.log('The Game has successfully been added');
                        }
                    });
                }
            });
        }
        else throw new Meteor.Error('error');
    }
    else throw new Meteor.Error('error');
}