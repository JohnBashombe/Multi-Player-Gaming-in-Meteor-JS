import { Meteor } from "meteor/meteor";

Session.set('showGames', 'true');
Session.set('showTransactions', 'false');
Session.set('isEmpty', 'false');
Session.set('userHistory', 'none');

Session.set('HistoryTotal', 0);
Session.set('HistoryCompleted', 0);
Session.set('HistoryWon', 0);
Session.set('HistoryLost', 0);
Session.set('HistoryStatus', 0);
Session.set('HistoryDate', 0);
Session.set('HistoryChallenge', 'false');

Session.set('displayLastChallenge', 'false');
Session.set('showLastChallenge', 'false');

// Last Challenge Sessions
Session.set('chalAlphaGames', 0);
Session.set('chalBetaGames', 0);
Session.set('chalAlphaPoints', 0);
Session.set('chalBetaPoints', 0);
Session.set('chalAlphaWon', 0);
Session.set('chalBetaWon', 0);
Session.set('chalCancelRequest', 0);
Session.set('chalDate', 'none');
Session.set('chalAmount', 0);
Session.set('chalName', 'none');
Session.set('chalWinner', 'none');
Session.set('chalAlphaPlayers', 0);
Session.set('chalBetaPlayers', 0);
Session.set('chalPlayerTeam', 'none');

// Session for switching pulse animation between buttons
Session.set('lastID', 'none');

// Display the first Transaction on the list
Session.set('TransAmount', 0);
Session.set('TransDate', 'xX-xX-xXxX');
Session.set('TransOperation', 'XxXxXxX');
Session.set('TransBTCAddress', 'xXxXxXxXxX');
Session.set('TransStatus', 'xxx');

// Create a session for changing the animation in transaction pane
Session.set('lastTransaction', 'none');
Session.set('initialTrans', 'none');

// Challenge win and challenge share
Session.set('chalLastWin', 0);
Session.set('chalLastShare', 0);
Session.set('Gamepriviledge', 'no');

Template.history.rendered = () => { loadLastChallenge(); displayHistory(); }

Template.history.helpers({

    'lastChallenge': () => {
        if (Session.get('displayLastChallenge') === 'false') {
            return false;
        }
        return true;
    },

    'showLastChallenge': () => {

        // console.log('The session is: ' + Session.get('showLastChallenge'));

        if (Session.get('showLastChallenge') === 'false') {
            return false;
        }
        return true;
    },

    'showGames': () => {
        if (Session.get('showGames') === 'false') {
            return false;
        }
        return true;
    },

    'showTransactions': () => {
        if (Session.get('showTransactions') === 'false') {
            return false;
        }
        return true;
    },

    'empty': () => {
        if (Session.get('isEmpty') === 'false') {
            return false;
        }
        return true;
    },

    'historyTotal': () => {
        return Session.get('HistoryTotal');
    },

    'HistoryCompleted': () => {

        if (Session.get('HistoryCompleted') === null) {
            return 0;
        }

        return Session.get('HistoryCompleted');
    },

    'HistoryWon': () => {
        if (Session.get('HistoryWon') === null) {
            return 0;
        }
        return Session.get('HistoryWon');
    },

    'HistoryLost': () => {
        if (Session.get('HistoryLost') === null) {
            return 0;
        }
        return Session.get('HistoryLost');
    },

    'HistoryStatus': () => {

        if (Session.get('HistoryStatus') === 'Finished') {
            return true
        }
        return false;
    },

    'HistoryDate': () => {
        return Session.get('HistoryDate');
    },

    'HistoryChallenge': () => {
        if (Session.get('HistoryChallenge') === 'true') {
            return true;
        }
        return false;
    },

    'chalAlphaGames': () => { return Session.get('chalAlphaGames') }, //
    'chalBetaGames': () => { return Session.get('chalBetaGames') }, //
    'chalAlphaPoints': () => { return Session.get('chalAlphaPoints') }, //
    'chalBetaPoints': () => { return Session.get('chalBetaPoints') },//
    'chalAlphaWon': () => { return Session.get('chalAlphaWon') },//
    'chalBetaWon': () => { return Session.get('chalBetaWon') },//
    'chalCancelRequest': () => { return Session.get('chalCancelRequest') }, //
    'chalDate': () => { return Session.get('chalDate') }, //
    'chalAmount': () => { return Session.get('chalAmount') }, //
    'chalName': () => { return Session.get('chalName') }, //
    'chalAlphaPlayers': () => { return Session.get('chalAlphaPlayers') }, //
    'chalWinner': () => {
        if (Session.get('chalWinner') === 'WON') { return true; }
        return false;
    },
    'chalLooser': () => {
        if (Session.get('chalWinner') === 'LOST') { return true; }
        return false;
    },

    'isAlpha': () => {
        if ((Session.get('chalPlayerTeam') === 'alpha') && (Session.get('chalWinner') === 'WON')) {
            return true;
        }
        return false;
    },

    'isBeta': () => {
        if ((Session.get('chalPlayerTeam') === 'beta') && (Session.get('chalWinner') === 'WON')) {
            return true;
        }
        return false;
    },

    'chalDraw': () => {
        if (Session.get('chalWinner') === 'DRAW') { return true; }
        return false;
    },
    'chalBetaPlayers': () => { return Session.get('chalBetaPlayers') }, //

    'chalPlayerTeam': () => { return Session.get('chalPlayerTeam') }, //

    'TransAmount': () => { return Session.get('TransAmount') },

    'TransDate': () => { return Session.get('TransDate') },

    'TransPending': () => {
        if (Session.get('TransOperation') === 'PENDING') { return true; }
        return false;
    },

    'TransDeposit': () => {
        if (Session.get('TransOperation') === 'DEPOSIT') { return true; }
        return false;
    },

    'TransWithdraw': () => {
        if (Session.get('TransOperation') === 'WITHDRAW') { return true; }
        return false;
    },
    'TransNone': () => {
        if (Session.get('TransOperation') === 'XxXxXxX') { return true; }
        return false;
    },

    'TransBTCAddress': () => { return Session.get('TransBTCAddress') },

    'chalLastWin': () => { return Session.get('chalLastWin') },

    'chalLastShare': () => { return Session.get('chalLastShare') },

    'historyMode': () => { return Session.get('historyMode') },

    'alphaChallengeBalance': () => { return Session.get('alphaChallengeBalance') },

    'betaChallengeBalance': () => { return Session.get('betaChallengeBalance') },

    'loadEmpty': () => {
        if (Session.get('TransDate') === 'xX-xX-xXxX') {
            return true;
        }
        return false;
    },

    'completedStatus': () => {
        if (Session.get('TransStatus') === 'COMLETED') {
            return true;
        }
        return false;
    },

    'pendingStatus': () => {
        if (Session.get('TransStatus') === 'PENDING') {
            return true;
        }
        return false;
    },

    'cancelStatus': () => {
        if (Session.get('TransStatus') === 'FAILED') {
            return true;
        }
        return false;
    },

    'noneStatus': () => {
        if (Session.get('TransStatus') === 'xxx') {
            return true;
        }
        return false;
    },

    'Gamepriviledge': () => {
        if (Session.get('Gamepriviledge') === 'ok') {
            return true;
        }
        return false;
    },

});

Template.history.events({

    'click #games': () => {
        Session.set('showGames', 'true');
        Session.set('showTransactions', 'false');
        displayHistory();
        loadLastChallenge();
    },

    'click #transaction': () => {
        Session.set('showGames', 'false');
        Session.set('showTransactions', 'true');
        Session.set('displayLastChallenge', 'false');
        loadTransaction();
    },

    'click #latest_Challenge': () => {
        Session.set('showGames', 'true');
        Session.set('showTransactions', 'false');
        // displayHistory();
        loadLastChallenge();
        Session.set('displayLastChallenge', 'true');
        Session.set('showLastChallenge', 'true');

        if (Session.get('lastID') !== 'none') {
            document.getElementById(Session.get('lastID')).classList.remove('infinite');
            document.getElementById(Session.get('lastID')).classList.remove('btn-success');
            document.getElementById(Session.get('lastID')).classList.add('btn-primary');
            document.getElementById('latest_Challenge').classList.add('infinite');
            document.getElementById('latest_Challenge').classList.remove('btn-primary');
            document.getElementById('latest_Challenge').classList.add('btn-secondary');
            // document.getElementById('latest_Challenge').classList.remove('z-depth-1');
        }

    },

    'click #noInfo': () => {
        Session.set('showGames', 'false');
        Session.set('showTransactions', 'false');
        Session.set('displayLastChallenge', 'true');
    }

});

txtFunctionLabelHistory = (number, id, games, btn) => {
    // console.log('The ID is: ' + id);
    return '<div class="col-2 pt-2"><b>' + number + '</b></div>' +
        '<div class="col-5 text-center pt-2"><b>' + games + ' Players</b></div>' +
        ' <div class="col-5 text-center">' +
        '<button id="' + id + '" class="btn ' + btn + ' btn-sm ml-0" onclick=showHistoryDetails("' + id + '")>Details</button>' +
        '</div>';
}

txtFunctionLabelTransaction = (number, id, games, btn) => {
    // console.log('The ID is: ' + id);
    return '<div class="col-2 pt-2"><b>' + number + '</b></div>' +
        '<div class="col-5 text-center pt-2"><b>' + games + ' BTC </b></div>' +
        ' <div class="col-5 text-center">' +
        '<button id="' + id + '" class="btn ' + btn + ' btn-sm ml-0" onclick=showTransactionDetails("' + id + '")>Details</button>' +
        '</div>';
}

showTransactionDetails = (id) => {

    // console.log('The id is: ' + id);

    if (Meteor.userId()) {

        if (Session.get('lastTransaction') !== 'none') {
            // document.getElementById(Session.get('lastTransaction')).classList.remove('infinite');
            document.getElementById(Session.get('lastTransaction')).classList.remove('btn-success');
            document.getElementById(Session.get('lastTransaction')).classList.add('btn-info');
        }

        Meteor.call('loadUniqueTransaction', Meteor.userId(), id, (err, res) => {

            if (err) {
                Session.set('TransAmount', 0);
                Session.set('TransDate', 'xX-xX-xXxX');
                Session.set('TransOperation', 'XxXxXxX');
                Session.set('TransBTCAddress', 'xXxXxXxXxX');
                Session.set('TransStatus', 'xxx');

            } else {

                // console.log('The results are: ' + res);

                Session.set('TransAmount', res[0]);
                Session.set('TransDate', res[1]);
                Session.set('TransOperation', res[2]);
                Session.set('TransBTCAddress', res[3]);
                Session.set('TransStatus', res[4]);

                if (Session.get('initialTrans') !== 'none') {
                    // document.getElementById(Session.get('initialTrans')).classList.remove('infinite');
                    document.getElementById(Session.get('initialTrans')).classList.remove('btn-success');
                    document.getElementById(Session.get('initialTrans')).classList.add('btn-info');
                }

                document.getElementById(id).classList.remove('btn-info');
                document.getElementById(id).classList.add('btn-success');
                // document.getElementById(id).classList.add('infinite');
            }

        });

        Session.set('lastTransaction', id);
    }
}

showHistoryDetails = (id) => {
    // alert('The current Id is: ' + id);
    if (Session.get('lastID').toString() !== 'none') {
        // document.getElementById(Session.get('lastID')).classList.remove('infinite');
        document.getElementById(Session.get('lastID')).classList.remove('btn-success');
        document.getElementById(Session.get('lastID')).classList.add('btn-primary');
    }

    Session.set('lastID', id);

    // document.getElementById('latest_Challenge').classList.remove('infinite');
    document.getElementById('latest_Challenge').classList.remove('btn-secondary');
    document.getElementById('latest_Challenge').classList.add('btn-primary');
    // document.getElementById('latest_Challenge').classList.add('z-depth-1');
    // document.getElementById(id).classList.add('infinite');
    document.getElementById(id).classList.remove('btn-primary');
    document.getElementById(id).classList.add('btn-success');

    if (Meteor.userId()) {

        Meteor.call('loadHistoryDetails', Meteor.userId(), id, (err, res) => {
            if (err) {
                Session.set('HistoryTotal', 0);
                Session.set('HistoryCompleted', 0);
                Session.set('HistoryWon', 0);
                Session.set('HistoryLost', 0);
                Session.set('HistoryStatus', 0);
                Session.set('HistoryDate', 0);
                Session.set('HistoryChallenge', 'false');
                Session.set('historyMode', 'none');
            } else {
                if (res.toString() === 'none') {
                    Session.set('HistoryTotal', 0);
                    Session.set('HistoryCompleted', 0);
                    Session.set('HistoryWon', 0);
                    Session.set('HistoryLost', 0);
                    Session.set('HistoryStatus', 0);
                    Session.set('HistoryDate', 0);
                    Session.set('HistoryChallenge', 'false');
                    Session.set('historyMode', 'none');
                }

                else {
                    Session.set('HistoryTotal', res[0]);
                    Session.set('HistoryCompleted', res[1]);
                    Session.set('HistoryWon', res[2]);
                    Session.set('HistoryLost', res[3]);
                    Session.set('HistoryStatus', res[4]);
                    Session.set('HistoryDate', res[5]);
                    Session.set('HistoryChallenge', res[6]);
                    Session.set('historyMode', res[7] + '-' + res[8] + '-' + res[9]);
                    Session.set('Gamepriviledge', res[10]);

                    Session.set('displayLastChallenge', 'false');
                    Session.set('showLastChallenge', 'false');
                }
            }
        });

    }

}

displayHistory = () => {

    // if (!Meteor.userId()) return false;
    Meteor.call('loadHistory', Meteor.userId(), (err, res) => {

        if (err) {
            Session.set('isEmpty', 'true');
        }

        else {
            if (res.toString() === '0') {
                Session.set('isEmpty', 'true');
            }
            else {

                Session.set('userHistory', res);
                Session.set('isEmpty', 'false');

                let text = ''; let word = '';
                let cont = Session.get('userHistory').toString() + ','; let len = cont.toString().length;

                let arrayData = []; let k = 0; let newWord = '';

                for (let i = 0; i < len; i++) {
                    word = word + cont.charAt(i);

                    if (cont.charAt(i) === ',') {
                        for (let t = 0; t < word.length - 1; t++) { newWord = newWord + word.charAt(t); }
                        arrayData[k] = newWord;

                        word = ''; newWord = ''; // Wrap the current the words
                        k = k + 1;
                    }
                }
                // Avoid the set null text
                setTimeout(() => {

                    let elementLength = arrayData.length / 2; let k = 0; let btnChoice = '';
                    for (let i = 0; i < elementLength; i++) {

                        btnChoice = 'btn-primary';

                        // console.log("Element 1: " + arrayData[k] + ' Element 2: ' + arrayData[k + 1]);
                        // console.log('The Length is ' + elementLength);
                        // console.log('The button to apply is ' + btnChoice);

                        text = text + txtFunctionLabelHistory((i + 1), arrayData[k], arrayData[k + 1], btnChoice);
                        k = k + 2;
                    }
                    document.getElementById('showHistory').innerHTML = text;
                }, 1000);
            }
        }
    });
}

loadLastChallenge = () => {

    if (Meteor.userId()) {
        Meteor.call('lastChallenge', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('displayLastChallenge', 'true');
                Session.set('showLastChallenge', 'false');
                // console.log('The error result is: ' + err);
            } else {
                // console.log('The result is: ' + res);
                if (res.toString() === 'none') {
                    Session.set('displayLastChallenge', 'true');
                    Session.set('showLastChallenge', 'false');
                }
                else {
                    Session.set('chalAlphaGames', res[0]); // = doc.alphaGames;
                    Session.set('chalBetaGames', res[1]); // = doc.betaGames;
                    Session.set('chalAlphaPoints', res[2]); // = doc.alphaPoints;
                    Session.set('chalBetaPoints', res[3]); // = doc.betaPoints;
                    Session.set('chalAlphaWon', res[4]); // = doc.alphaGamesWon;
                    Session.set('chalBetaWon', res[5]); // = doc.betaGamesWon;
                    Session.set('chalCancelRequest', res[6]); // = doc.cancelRequest;
                    Session.set('chalDate', res[7]); // = doc.todayDate;
                    Session.set('chalAmount', res[8]); // = doc.challengeAmount;
                    Session.set('chalName', res[9]); // = doc.name;
                    Session.set('chalWinner', res[10]); // = doc.teamWinner;
                    Session.set('chalAlphaPlayers', res[11]); // = doc.teamAlpha.length;
                    Session.set('chalBetaPlayers', res[12]); // = doc.teamBeta.length;
                    Session.set('chalPlayerTeam', res[13]); // = doc.teamBeta.length;
                    Session.set('chalLastWin', res[14]); // = last challenge win;
                    Session.set('chalLastShare', res[15]); // = last challenge share;
                    Session.set('alphaChallengeBalance', res[16]); // = alpha challenge balance;
                    Session.set('betaChallengeBalance', res[17]); // = beta challenge balance;
                    Session.set('displayLastChallenge', 'true');
                    Session.set('showLastChallenge', 'true');

                    // console.log('The last is: ' + res[15]);
                }
            }
        });
    }
}

loadTransaction = () => {

    if (Meteor.userId()) {
        Meteor.call('loadUserTransaction', Meteor.userId(), (err, res) => {

            if (err) {
                // console.log('The error is: ' + err);
                Session.set('TransAmount', 0);
                Session.set('TransDate', 'xX-xX-xXxX');
                Session.set('TransOperation', 'XxXxXxX');
                Session.set('TransBTCAddress', 'xXxXxXxXxX');
                Session.set('TransStatus', 'xxx');
            } else {
                // console.log('The result is: ' + res);
                if (res.toString() === '0') {
                    // Session.set('isEmpty', 'true');
                    Session.set('TransAmount', 0);
                    Session.set('TransDate', 'xX-xX-xXxX');
                    Session.set('TransOperation', 'XxXxXxX');
                    Session.set('TransBTCAddress', 'xXxXxXxXxX');
                    Session.set('TransStatus', 'xxx');
                }
                else {

                    Session.set('TransAmount', res[0]);
                    Session.set('TransDate', res[1]);
                    Session.set('TransOperation', res[2]);
                    Session.set('TransBTCAddress', res[3]);
                    Session.set('TransStatus', res[4]);

                    // console.log('The amount is: ' + Session.get('TransAmount'));

                    let trans = '';
                    for (let i = 5; i < res.length; i++) {
                        // console.log('Result: ' + res[i]);
                        if (i === (res.length - 1)) {
                            trans = trans + res[i];
                        } else {
                            trans = trans + res[i] + ',';
                        }
                    }

                    // console.log('The result is:' + trans)

                    Session.set('userTransaction', trans);
                    Session.set('isEmpty', 'false');

                    let text = ''; let word = '';
                    let cont = Session.get('userTransaction').toString() + ','; let len = cont.length;

                    let arrayData = []; let k = 0; let newWord = '';

                    for (let i = 0; i < len; i++) {
                        word = word + cont.charAt(i);

                        if (cont.charAt(i) === ',') {
                            for (let t = 0; t < word.length - 1; t++) { newWord = newWord + word.charAt(t); }
                            arrayData[k] = newWord;

                            word = ''; newWord = ''; // Wrap the current the words
                            k = k + 1;
                        }
                    }
                    // Avoid the set null text
                    setTimeout(() => {

                        let elementLength = arrayData.length / 2; let k = 0; let btnChoice = '';
                        for (let i = 0; i < elementLength; i++) {

                            btnChoice = 'btn-info';

                            if (i === 0) {
                                btnChoice = 'btn-success infinite';
                                Session.set('initialTrans', arrayData[k]);
                            }

                            // console.log("Element 1: " + arrayData[k] + ' Element 2: ' + arrayData[k + 1]);
                            // console.log('The Length is ' + elementLength);
                            // console.log('The button to apply is ' + btnChoice);

                            text = text + txtFunctionLabelTransaction((i + 1), arrayData[k], arrayData[k + 1], btnChoice);
                            k = k + 2;
                        }
                        document.getElementById('showTransaction').innerHTML = text;
                    }, 1000);
                }
            }

        });
    }
}

