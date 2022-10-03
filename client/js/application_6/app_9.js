import { Meteor } from "meteor/meteor";

Session.set('noGames', 'none'); Session.set('network', 'none'); Session.set('array', 'none');
Session.set('CurrentChoice1', 'none'); Session.set('CurrentChoice2', 'none'); Session.set('CurrentGamesWon', 0);
Session.set('CurrentPlayedGames', 0); Session.set('CurrentChallengeId', 'none'); Session.set('CurrentGamesLost', 0);
Session.set('CurrentChallengeTeam', 'none'); Session.set('CurrentGameDate', 'none'); Session.set('CurrentTotalGames', 0);
Session.set('GameMode', 'none'); Session.set('CurrentGameID', 'none'); Session.set('cashOut', 'none'); Session.set('priviledge', 'no');

Template.account.rendered = () => { Session.set('CurrentChoice1', 'none'); Session.set('CurrentChoice2', 'none'); }

Template.account.helpers({

    'loadBalance': () => {
        if (!Meteor.userId()) return '0.00000';
        Meteor.call('loadBalance', Meteor.userId(), function (err, res) {
            if (err) return '0.00000'
            else {
                if (res[0] === undefined || res[0] === null || res[0] === '') res[0] = 0
                Session.set('balance', res[0]);
            }
        });
        return Session.get('balance');
    },

    'sessionNoGames': () => {
        if (Session.get('noGames').toString() === 'none') return false;
        return true;
    },

    'networkError': () => {
        if (Session.get('network').toString() === 'none') return false;
        return true;
    },

    'displayGames': () => { displayThisUserGames(); },

    'loadFirst': () => { fetchFirst(); },

    'cashOut': () => {
        if (Session.get('cashOut') === 'none') return false;
        return true;
    },

    'cashOutAllow': () => {
        if ((Session.get('cashOut') !== 'none') && (Session.get('cashOut') === 'allow')) return true;
        return false;
    },

    'cashOutAmount': () => {
        if (!Meteor.userId()) return false;
        if (Meteor.userId()) {
            Meteor.call('cashOutAmount', Session.get('CurrentGameID'), Meteor.userId(), function (err, res) {
                if (err) return '0';
                else Session.set('cashOutAmount', res);
            });
        }
    },

    'printCashOut': () => { return Session.get('cashOutAmount'); },

    'loadMode': () => {

        let c1 = Session.get('CurrentChoice1'); let c2 = Session.get('CurrentChoice2'); let output = Session.get('GameMode');

        if (c1 === 'none' || c2 === 'none' || output === 'none') { mode = 'Unavailable'; Session.set('GameMode', 'Unavailable'); }

        else if (c1 === 'b') {
            if (c2 === 'p') Session.set('GameMode', 'B-P-G');
            else if (c2 === 'g') Session.set('GameMode', 'B-G-P');
        }

        else if (c1 === 'p') {
            if (c2 === 'b') Session.set('GameMode', 'P-B-G');
            else if (c2 === 'g') Session.set('GameMode', 'P-G-B');
        }
        else if (c1 === 'g') {
            if (c2 === 'b') Session.set('GameMode', 'G-B-P');
            else if (c2 === 'p') Session.set('GameMode', 'G-P-B');
        }
        return Session.get('GameMode');
    },

    // 'PlayedGames': () => {
    //     return Session.get('CurrentPlayedGames');
    // },

    // 'TotalGames': () => {
    //     return Session.get('CurrentTotalGames');
    // },

    // 'RemainGames': () => {
    //     return parseInt(Session.get('CurrentTotalGames')) - parseInt(Session.get('CurrentPlayedGames'));
    // },

    'GamesWon': () => { return Session.get('CurrentGamesWon'); },

    'GamesLost': () => { return Session.get('CurrentGamesLost'); },

    'GetDate': () => { return Session.get('CurrentGameDate'); },

    // 'InChallenge': () => {
    //     Session.set('CurrentChallengeId', 'none');
    //     if (Session.get('CurrentChallengeId').toString() === 'none') return false;
    //     return true
    // },

    'challengeStatus': () => {
        if (Session.get('inChallenge') === 'true') {
            return true;
        }
        return false;
    },

    'priviledge': () => {
        if (Session.get('priviledge') === 'ok') {
            return true;
        }
        return false;
    },

    'ChallengeTeam': () => { return Session.get('CurrentChallengeTeam'); },

    'getGameID': () => { return Session.get('CurrentGameID'); },

    'getTeam': () => {
        if (Session.get('challengeTeam') === 'alpha') { return 'Alpha'; }
        else if (Session.get('challengeTeam') === 'beta') { return 'Beta'; }
    },
});

Template.account.events({
    'click #list-refresh': () => {
        fetchFirst();
        displayThisUserGames();
    }
});

txtFunction = (number, available, total, id, btnChoice) => {
    return '<div class="col-2 pt-2"><b>' + number + '</b></div><div class="col-5 pt-2 text-center"> <b>' + available + ' / ' + total + '</b></div><div class="col-5">  <button id="' + id + '" class="btn ' + btnChoice + ' btn-sm ml-0" onclick=loadOneGame("' + id + '")>Details</button> </div>';
}

loadOneGame = (gameId) => {

    let oldID = document.getElementById(Session.get('CurrentGameID'));
    let newID = document.getElementById(gameId);

    if (!Meteor.userId()) return false;
    if (Meteor.userId()) {
        Meteor.call('loadOneGame', Meteor.userId(), gameId, (err, res) => {
            if (err) Session.set('noGames', 'nothing');
            else {
                Session.set('CurrentChoice1', res[0]); Session.set('CurrentChoice2', res[1]);
                Session.set('CurrentPlayedGames', res[2]); Session.set('CurrentGamesWon', res[3]);
                Session.set('CurrentGamesLost', res[4]); Session.set('CurrentChallengeId', res[5]);
                Session.set('CurrentChallengeTeam', res[6]); Session.set('CurrentGameDate', res[7]);
                Session.set('CurrentTotalGames', res[8]); Session.set('CurrentGameID', res[9]);
                Session.set('cashOut', res[10]); Session.set('priviledge', res[11]);
                oldID.classList.remove('btn-success'); oldID.classList.add('btn-primary');
                newID.classList.remove('btn-primary'); newID.classList.add('btn-success');
            }
        });
    }
}

fetchFirst = () => {

    if (!Meteor.userId()) return 'Sign In for free'
    if (Meteor.userId()) {
        Meteor.call('loadFirstGame', Meteor.userId(), function (err, res) {
            if (err) Session.set('noGames', 'nothing');
            else {
                Session.set('CurrentChoice1', res[0]); Session.set('CurrentChoice2', res[1]);
                Session.set('CurrentPlayedGames', res[2]); Session.set('CurrentGamesWon', res[3]);
                Session.set('CurrentGamesLost', res[4]); Session.set('CurrentChallengeId', res[5]);
                Session.set('CurrentChallengeTeam', res[6]); Session.set('CurrentGameDate', res[7]);
                Session.set('CurrentTotalGames', res[8]); Session.set('CurrentGameID', res[9]);
                Session.set('cashOut', res[10]);
                Session.set('priviledge', res[11]);
            }
        });
    }
}

closeGame = (id) => {

    if (!Meteor.userId()) return false;
    if (Meteor.userId()) {
        Meteor.call('cancelGame', id, Meteor.userId(), (err) => {
            if (err) {
                // console.log('The error is: ' + err);
                if (err.toString() === 'Error: [done]') document.location.reload(true);
                else Session.set('network', 'error');
            }
            else document.location.reload(true);
        });
    }
}

displayThisUserGames = () => {

    if (!Meteor.userId()) return false;
    Meteor.call('loadUserGames', Meteor.userId(), (err, res) => {
        if (err) Session.set('network', 'find');
        else {
            if (res.toString() === 'nothing') Session.set('noGames', 'nothing');
            else {
                Session.set('array', res);
                // return Session.get('output');
                let text = ''; let word = '';
                let cont = Session.get('array').toString() + ','; let len = cont.toString().length;

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

                    let elementLength = arrayData.length / 3; let k = 0; let btnChoice = '';
                    for (let i = 0; i < elementLength; i++) {

                        if (i == 0) btnChoice = 'btn-success';
                        else btnChoice = 'btn-primary';

                        text = text + txtFunction((i + 1), arrayData[k + 1], arrayData[k + 2], arrayData[k], btnChoice);
                        k = k + 3;
                    }
                    document.getElementById('shower').innerHTML = text;
                }, 1000);
            }
        }
    });
}


loadChallengeInAccount = () => {

    if (!Meteor.userId()) { Session.set('inChallenge', 'false'); return false; }
    if (Meteor.userId()) {

        Meteor.call('loadStatus', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('inChallenge', 'false');
                // console.log('The error is: ' + err);
                // displayChallenges();
            } else {

                if (res[0] === 'none') {
                    Session.set('inChallenge', 'false');
                } else {
                    Session.set('challengeTeam', res[1]);
                    Session.set('timeStart', res[6]);
                    Session.set('timeNow', res[7]);
                    Session.set('inChallenge', 'true');
                }
            }
        });

    }
}

// check if the player is in challenge mode
loadChallengeInAccount();