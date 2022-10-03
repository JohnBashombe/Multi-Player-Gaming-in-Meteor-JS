import { Meteor } from "meteor/meteor";

Meteor.methods({

    'loadUsername': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let findUser = 'none';

        Meteor.users.find({ _id: userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc._id) { findUser = 'exist'; }
        });

        let username = 'none';
        if (findUser.toString() === 'none') username = 'Loading...'
        else {
            username = Meteor.users.findOne({ _id: userId }).emails[0].address;
            // console.log('Username is: ' + username);
        }
        // console.log('Before sending : Username is: ' + username);
        return username;
    },

    'loadThisGame': () => {

        let arrayGame = [];
        let id = 'none';

        let remain = 0;
        let totalGames = 0;
        let currentPlayed = 0;

        let choice1 = '';

        //load the Games remaining
        //load the total Games

        // let ipAddress = this.connection.clientAddress;
        // console.log('The client Ip address is: ' + ipAddress);

        let count = Games.find({}).count();
        // use to randomly select a new game to display to a visitor
        let random = Math.round(Math.random() * count + 1);

        let priviledge = 'none';

        Games.find({}, { limit: random }).map((doc) => {
            id = doc._id;
            choice1 = doc.choice1;
            totalGames = doc.games;
            currentPlayed = doc.currentPlayers;
            priviledge = doc.priviledge;
        });
        // return no game if the collection is empty
        if (id.toString() === 'none') { arrayGame[0] = 'noGame'; }

        else {
            // else calculate the specific results
            remain = parseInt(totalGames) - parseInt(currentPlayed);

            // console.log('The priviledge is: ' + priviledge);

            if (priviledge.toString() === 'none') {
                // console.log('The priviledge in none is: ' + priviledge);
                // output the result in the array container
                arrayGame[0] = choice1;
                arrayGame[1] = remain;
            }

            else if (priviledge.toString() === 'valid') {
                // console.log('The priviledge in valid is: ' + priviledge);
                // console.log('The remaining games are: ' + remain);

                // this array stores the value to divide with the remaining games
                // let elements = [];
                // if (remain <= 25) {
                //     remain = Math.round(remain / (Math.random() * 9 + 3));
                //     // console.log('The remain <= 25 is: ' + remain);
                // }

                // else {
                // get a random number between 0 and the half + the quarter of that remaining number
                // random of 30/2 -> 0-15 + 30/4 = 7.5 ==> division will be 30 / 0 or 1 ... + 7.5 = 8,9
                // 30 / 9 === 2 or 3

                if (remain <= 3) {
                    arrayGame[0] = choice1;
                    arrayGame[1] = remain;
                }

                else {
                    let half = Math.round(remain / 2); // 2/2 = 1
                    // let third = Math.round(remain / 3); // 2/3 = 1
                    // let random
                    remain = Math.round(remain / (Math.random() * half + 1));
                    // console.log('Details > 25 : half is ' + half + ' and remain is: ' + remain);
                    // }

                    if (remain > 15) remain = 15;

                    // This piece of code share the game among users in multiple games if the priviledge is activated
                    // remain = Math.round(remain / Math.random() * 4 + 1);
                    // output the result in the array container
                    arrayGame[0] = choice1;
                    arrayGame[1] = remain;
                }
            }

            else {
                // output the result in the array container
                arrayGame[0] = choice1;
                arrayGame[1] = remain;
            }
            // Share the game amount by two if it is in the range between 5 and 15
            // if (remain >= 25) {
            //     remain = Math.round(parseInt(remain / (Math.round(Math.random() * 4 + 2))));
            // } else {
            //     remain = remain;
            // }

        }

        return arrayGame;

    },

    'loadUserGame': (userId) => {

        // if (userId.toString() === 'undefined' || userId.toString() === 'null' || userId.toString() === '') {
        //     throw new Meteor.Error('userId');
        // }

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let arrayGameDetails = [];
        let availableGames = [];

        let arrayPlayedGames = [];
        // let k = 0;

        // let ipAddress = this.connection.clientAddress;
        // console.log('The user Ip address is: ' + ipAddress);

        let userExist = 'none';

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

            if (userId.toString() === doc.userId) userExist = 'exist';

            let len = doc.currentGame.length;
            for (let i = 0; i < len; i++) { arrayPlayedGames[i] = doc.currentGame[i]; }
            // Get the lenght of the array 
            // then loop in that interval
            // console.log('The lenght of array is: ' + doc.currentGame.length);
            // console.log('The Elements are : ' + doc.currentGame);
            // console.log('The unique element is : ' + doc.currentGame[k]);
            // k++;
        });

        // for (let j = 0; j < arrayPlayedGames.length; j++) {
        //     console.log(userId + ' has played : ' + arrayPlayedGames[j]);
        // }

        // console.log('The lenght is: ' + arrayPlayedGames.length);

        // Games.find({}).map((doc) => {
        //     console.log('ID: ' + doc._id + ' and AMOUNT is: ' + doc.games);
        //     console.log('Setter ID: ' + doc.userId);
        //     console.log('Player ID: ' + userId);
        // });


        let remain = 0; let totalGames = 0;
        let currentPlayed = 0; let choice1 = '';
        let running = true; let counter = 0;

        // Will determine if the user has played on a certain game already
        let playAccess = 'none';

        // Collect the today's Date
        let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();

        let todayDate = month + '/' + day + '/' + year; let oldDate = 'none';

        if (userExist.toString() === 'none') throw new Meteor.Error('error');

        else if (userExist.toString() === 'exist') {

            UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
                oldDate = doc.gameDate;
            });

            // If the two date are different, clean all previous data and then insert new ones
            // clean also all games played so far and restart afresh

            // console.log('New Date is: ' + todayDate);
            // console.log('Old Date is: ' + oldDate);

            if (todayDate.toString() !== oldDate.toString()) {
                // console.log('The two date are not equal.');
                UserDetails.update({ 'userId': userId },
                    {
                        $set: { 'currentGame': [], 'remainGames': 0, 'choice1': '', 'gameDate': todayDate }
                    });

            }
            // else {
            //     console.log('The two dates are equal'); 
            // }

            let randomSort = Math.round(Math.random());

            if (randomSort === 0) randomSort = -1;
            if (randomSort === 1) randomSort = 1;

            while (running) {

                Games.find({}, { limit: 200 }, { sort: { createdAt: randomSort } }).map((doc) => {

                    if (userId.toString() !== doc.userId) {

                        // console.log('Player ID !== from Setter ID');

                        for (let j = 0; j < arrayPlayedGames.length; j++) {

                            if (arrayPlayedGames[j].toString() === doc._id) {
                                playAccess = 'already';
                                // console.log('This Game of ID: ' + doc._id + ' has been played already');
                                break;
                            } else {
                                playAccess = 'none';
                            }
                        }

                        if (playAccess.toString() === 'none') {
                            // console.log('This Game of ID: ' + doc._id + ' was added to available Games');
                            availableGames[counter] = doc._id;
                            counter = counter + 1;
                        }
                    }

                    // console.log('Game ID: ' + doc._id);

                });
                running = false;
            }

            // for (let j = 0; j < availableGames.length; j++) {
            //     console.log('This User available games are : ' + availableGames[j]);
            // } 

            let len = availableGames.length;
            let random = Math.round(Math.random() * (len - 1));
            let arrayGame = [];
            // console.log('Available Games are: ' + len);

            if (len > 0) {

                let priviledge = 'none';

                Games.find({ _id: availableGames[random] }, { limit: 1 }).map((doc) => {
                    choice1 = doc.choice1;
                    totalGames = doc.games;
                    currentPlayed = doc.currentPlayers;
                    priviledge = doc.priviledge;
                    // console.log('Real Game ID: ' + doc._id);
                });

                remain = parseInt(totalGames) - parseInt(currentPlayed);

                if (priviledge.toString() === 'none') {
                    // output the result in the array container
                    arrayGame[0] = choice1;
                    arrayGame[1] = remain;
                }

                else if (priviledge.toString() === 'valid') {

                    // this array stores the value to divide with the remaining games
                    // let elements = [];
                    // if (remain <= 25) {
                    //     remain = Math.round(remain / (Math.random() * 9 + 3));
                    // }

                    // else {
                    // get a random number between 0 and the half + the quarter of that remaining number
                    // random of 30/2 -> 0-15 + 30/4 = 7.5 ==> division will be 30 / 0 or 1 ... + 7.5 = 8,9
                    // 30 / 9 === 2 or 3

                    if (remain <= 3) {
                        arrayGame[0] = choice1;
                        arrayGame[1] = remain;
                    }

                    else {

                        let half = Math.round(remain / 2); // 2/2 = 1
                        // let third = Math.round(remain / 3); // 2/3 = 1
                        // let random
                        remain = Math.round(remain / (Math.random() * half + 1));
                        // let random
                        // remain = Math.round(remain / (Math.random() * half + quarter));
                        // console.log('Details > 25 : half is ' + half + ' and remain is: ' + remain);
                        // }

                        if (remain > 15) remain = 15;

                        // This piece of code share the game among users in multiple games if the priviledge is activated
                        // remain = Math.round(remain / Math.random() * 4 + 1);
                        // output the result in the array container
                        arrayGame[0] = choice1;
                        arrayGame[1] = remain;
                    }

                    // let half = Math.round(remain / 2);
                    // let quarter = Math.round(remain / 4);
                    // remain = Math.round(remain / (Math.random() * half + quarter));
                    // // }

                    // // This piece of code share the game among users in multiple games if the priviledge is activated
                    // // remain = Math.round(remain / Math.random() * 4 + 1);
                    // // output the result in the array container
                    // arrayGame[0] = choice1;
                    // arrayGame[1] = remain;
                }

                else {
                    // output the result in the array container
                    arrayGame[0] = choice1;
                    arrayGame[1] = remain;
                }

                // remain = totalGames - currentPlayed;
                // // Share the game amount by 2-6 if it is greater than 7
                // if (remain > 25) {
                //     remain = Math.round(parseInt(remain / (Math.round(Math.random() * 4 + 2))));
                // } else {
                //     remain = remain;
                // }

                // console.log("The Curent User Game ID is: " + availableGames[random]);

                UserDetails.update({ 'userId': userId },
                    {
                        $set: { 'gameToPlay': availableGames[random], 'remainGames': arrayGame[1], 'choice1': arrayGame[0] },
                    });

                let thisChoice1 = 'none';
                let thisRemain = 0;
                // let thisGameID = '';

                UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
                    thisChoice1 = doc.choice1;
                    thisRemain = doc.remainGames;
                    // thisGameID = doc.gameToPlay;
                });

                arrayGameDetails[0] = thisChoice1;
                arrayGameDetails[1] = thisRemain;

                // console.log('Game Available');
                // console.log('Game ID : ' + thisGameID);
                // console.log('Choice 1 : ' + thisChoice1);
                // console.log('Remain : ' + thisRemain);

            } else {
                // console.log('No Game Available');
                arrayGameDetails[0] = 'noGame';
            }

        }
        else throw new Meteor.Error('error');

        return arrayGameDetails;
    },

    'checkValidity': (userId) => {

        // check if this current game is still available

        let validity = 'none';

        if (isEmpty(userId)) throw new Meteor.Error('userId');
        trimInputID(userId);

        let gameId = 'none';

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            if (userId.toString() === doc.userId) validity = 'valid';
            gameId = doc.gameToPlay;
        });

        if (validity.toString() === 'none') throw new Meteor.Error('error');
        else {

            let origin = 'none';
            Games.find({ _id: gameId }, { limit: 1 }).map((doc) => {
                if (gameId.toString() === doc._id) origin = 'valid';
            });

            // console.log('The Game is: ' + origin);
            if (origin.toString() === 'none') throw new Meteor.Error('error');
            if (gameId.toString() === 'none') throw new Meteor.Error('error');
            // else if (origin.toString() === 'valid') return origin;
        }
    }
});