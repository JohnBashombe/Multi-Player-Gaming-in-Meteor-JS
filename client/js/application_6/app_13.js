
Template.challenge.created = () => {
    // Session.set('countRefresh', 10); 
    userMaxGames();
    displayChallenges();
    // loadChallengeStatus();
}

Template.challenge.helpers({

    'loadBalance': () => {
        if (!Meteor.userId()) return '0.00000'; loadBalanceInstantly(); return Session.get('balance');
    },

    'loadChallengeBalance': () => {
        if (!Meteor.userId()) return '0.00000'; loadBalanceInstantly(); return Session.get('challengeBalance');
    },

    'challengeStatus': () => { if (Session.get('inChallenge') === 'true') { return true; } return false; },

    'balanceError': () => { if (Session.get('balanceError') === 'true') { return true; } return false; },

    'showChallenge': () => { if (Session.get('showActiveChallenge') === 'true') { return true; } return false; },

    // 'loadChallenges': () => { displayChallenges(); },

    'enterName': () => { if (Session.get('enterName') === 'true') { return true; } return false; },

    'getCurrentTeam': () => {
        if (Session.get('currentTeam') === 'a') { return 'ALPHA'; }
        if (Session.get('currentTeam') === 'b') { return 'BETA'; }
    },

    'getName': () => { return Session.get('challengeName'); },

    'getTeam': () => {
        if (Session.get('challengeTeam') === 'alpha') { return 'Alpha'; }
        else if (Session.get('challengeTeam') === 'beta') { return 'Beta'; }
    },

    'getTeamLength': () => {
        if (Session.get('challengeTeam') === 'alpha') { return Session.get('alphaLength'); }
        else if (Session.get('challengeTeam') === 'beta') { return Session.get('betaLength'); }
    },

    'showDetailsPane': () => {
        if (Session.get('showDetailsPane').toString() === 'true') { return true; } return false;
    },

    'getUserChallengeGames': () => { return Session.get('userChallengeGames'); },

    'getTotalChallengeGames': () => { return Session.get('totalChallengeGames'); },

    'getTimeNow': () => { return Session.get('timeNow') },

    'getTimeStart': () => { return Session.get('timeStart') },

    'getUserShare': () => { let x = Session.get('userShare'); x = parseFloat(x).toFixed(2); return x; },

    'getTotalPlayers': () => { return Session.get('detailsChallengePlayers'); },

    'startNew': () => { if (Session.get('startNew') === 'true') { return true; } return false; },

    'cancelRequest': () => { let x = Session.get('cancelRequest'); x = parseFloat(x).toFixed(2); return x; },

    'userCancel': () => { if (Session.get('cancelUser') === 'true') { return true; } return false; },

    'Points': () => { return Session.get('challengePoints'); }

});

userMaxGames = () => {

    Meteor.call('loadCost', (err, res) => {
        if (err) return false;
        if (res) Session.set('minimumPrice', parseFloat(res))
    });
    // return Session.get('minimumPrice');
}
// console.log('The minimum price is: ' + Session.get('minimumPrice'));
// Session.set('countRefresh', 0);

loadChallengeStatus = () => {

    if (!Meteor.userId()) { Session.set('inChallenge', 'false'); return false; }
    if (Meteor.userId()) {

        Meteor.call('loadStatus', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('inChallenge', 'false');
                Session.set('startNew', 'true');
                Session.set('showActiveChallenge', 'false');
                Session.set('userShare', 0);
                Session.set('challengePoints', 0);
                // console.log('The error is: ' + err);
                displayChallenges();
            } else {

                if (res[0] === 'none') {
                    Session.set('inChallenge', 'false');
                    Session.set('showActiveChallenge', 'false');
                    Session.set('challengeName', 'none');
                    Session.set('showDetailsPane', 'none');
                    Session.set('challengeTeam', 'none');
                    Session.set('startNew', 'true');
                    Session.set('inChallenge', 'false');
                    Session.set('showActiveChallenge', 'false');
                    Session.set('userShare', 0);
                    Session.set('challengePoints', 0);

                    // if (Session.get('countRefresh') === 10) {
                    displayChallenges();
                    // Session.set('countRefresh', 10);
                    // }

                } else {

                    Session.set('showActiveChallenge', 'true');
                    Session.set('challengeName', res[0]);
                    Session.set('challengeTeam', res[1]);
                    Session.set('alphaLength', res[2]);
                    Session.set('betaLength', res[3]);
                    Session.set('userChallengeGames', res[4]);
                    Session.set('totalChallengeGames', res[5]);
                    Session.set('timeStart', res[6]);
                    Session.set('timeNow', res[7]);
                    Session.set('userShare', res[8]);
                    Session.set('cancelRequest', res[9]);
                    Session.set('cancelUser', res[10]);
                    Session.set('challengePoints', res[11]);

                    if ((Session.get('inChallenge') === 'true') && (Session.get('showDetailsPane') === 'true')) {
                        Session.set('showDetailsPane', 'true');
                        Session.set('showActiveChallenge', 'false');
                    }
                    else {
                        Session.set('showDetailsPane', 'false');
                        Session.set('showActiveChallenge', 'true');
                    }

                    Session.set('inChallenge', 'true');
                }
            }
        });

    }
}

// loadChallengeStatus();
