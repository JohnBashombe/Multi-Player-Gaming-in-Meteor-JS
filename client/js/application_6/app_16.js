
Session.set('blueFirst', 'false');
Session.set('purpleFirst', 'false');
Session.set('greenFirst', 'false');

// Hold the current amount the user may win
Session.set('userWin', 0);
// Contains the current games selected by the user
Session.set('userGame', 0);
Session.set('userTotalCost', 0);
Session.set('gameMax', 0);

// They will be used to hold current choice 2 and 3
Session.set('GameChoice2', 'none');
Session.set('GameChoice3', 'none');

Session.set('blue', 0);
Session.set('purple', 0);
Session.set('green', 0);
Session.set('gamePick', 'none');
Session.set('showStats', 'none');

Session.set('yesError', 'false');
Session.set('noBalance', 'false');

Session.set('messageWon', 'false');
Session.set('messageLost', 'false');

Session.set('getUsername', 'none')

Template.home.helpers({

    'loadBalance': () => {

        if (!Meteor.userId()) return '0.00000';
        Meteor.call('loadBalance', Meteor.userId(), function (err, res) {
            if (err) {
                return '0.00000'
            }
            else {

                if (res[0] === undefined || res[0] === null || res[0] === '') {
                    res[0] = 0;
                }
                Session.set('balance', res[0]);
            }
        });

        return Session.get('balance');
    },

    'loadPrice': () => {

        Meteor.call('loadCost', function (err, res) {
            if (err) return false;
            if (res) Session.set('minimumPrice', parseFloat(res))
        });
        return Session.get('minimumPrice');
    },

    'userMaxGames': () => {

        if (!Meteor.userId()) return '0'
        Meteor.call('userMax', Meteor.userId(), (err, res) => {
            if (err) {
                return '0'
            } else {
                if (res === undefined || res === null || res === '') {
                    res = 0
                }
                Session.set('UserMaxGames', res);
            }
        });
        return Session.get('UserMaxGames');
    },

    'Username': () => {
        loadUsername();
        if (Session.get('getUsername') === 'none') {
            return 'Loading...';
        } else {
            return Session.get('getUsername');
        }
    },

    'loadCoupon': () => {

        if (!Meteor.userId()) return '0';
        Meteor.call('loadCoupon', Meteor.userId(), function (err, res) {
            if (err) return '0'
            else Session.set('userCoupon', res)
        });
        return Session.get('userCoupon');
    },

    'loadNone': () => {
        if (Session.get('loadEmpty') === 'true') {
            return true;
        }
        return false;
    },

    'loadGame': () => {
        loadFrequent();
        // checkValidity();
        return loadActive();
    },

    'loadMaxGames': () => {
        if (Session.get('gameMax') === null || Session.get('gameMax') === undefined || Session.get('gameMax') === '') {
            return 0
        }
        return Session.get('gameMax');
    },

    'loadCurrentGames': () => {
        return Session.get('userGame');
    },

    'secondExist': () => {

        if (Session.get('blue') !== 0 || Session.get('purple') !== 0 || Session.get('green') !== 0) {
            // console.log('Choice 2 is ' + Session.get('GameChoice2') + ' and choice 3 is : ' + Session.get('GameChoice3'));
            return true;
        }
        // console.log('BLue is ' + Session.get('blue') + ' Purple is ' +    Session.get('purple')+ ' Green is ' + Session.get('green'))
        // console.log('Empty Choice 2 is ' + Session.get('GameChoice2') + ' and choice 3 is : ' + Session.get('GameChoice3'));
        return false;
    },

    'loadBlue': () => {
        return Session.get('blue');
    },

    'loadPurple': () => {
        return Session.get('purple');
    },

    'loadGreen': () => {
        return Session.get('green');
    },

    'blueOne': () => {
        if (Session.get('gamePick') === 'b') return true;
        return false;
    },

    'purpleOne': () => {
        if (Session.get('gamePick') === 'p') return true;
        return false;
    },

    'greenOne': () => {
        if (Session.get('gamePick') === 'g') return true;
        return false;
    },

    'loadTotalCost': () => {

        if (Meteor.userId()) {
            Meteor.call('totalCostId', Session.get('userGame'), Meteor.userId(), (err, res) => {
                if (err) return '0';
                else Session.set('userTotalCost', res);
            });
        } else {
            Meteor.call('totalCost', Session.get('userGame'), (err, res) => {
                if (err) return '0';
                else Session.set('userTotalCost', res);
            });
        }

        return Session.get('userTotalCost');
    },

    'totalWin': () => {

        Meteor.call('totalWin', Session.get('userGame'), (err, res) => {
            if (err) return 'loading';
            else Session.set('userWin', res);
        });

        return Session.get('userWin');
    },

    'userMaxGames': () => {

        if (!Meteor.userId()) return '0'
        Meteor.call('userMax', Meteor.userId(), (err, res) => {
            if (err) {
                return '0'
            } else {
                if (res === undefined || res === null || res === '') {
                    res = 0
                }
                Session.set('UserMaxGames', res);
            }
        });
        return Session.get('UserMaxGames');
    },

    'loadPlayBtnLabel': () => {

        let label = 'Loading...';
        let choice2 = Session.get('GameChoice2').toString();
        let choice3 = Session.get('GameChoice3').toString();
        let choice = Session.get('gamePick').toString();

        if (choice2 === 'none' && choice3 === 'none') {
            if (choice === 'b') {
                label = 'Blue Mode';
            }
            else if (choice === 'p') {
                label = 'Purple Mode';
            }
            else if (choice === 'g') {
                label = 'Green Mode';
            }
        } else {

            if (choice === 'b') {
                if (choice2 === 'p') {
                    label = 'Play B-P-G';
                }
                else if (choice2 === 'g') {
                    label = 'Play B-G-P';
                }
            }
            else if (choice === 'p') {
                if (choice2 === 'b') {
                    label = 'Play P-B-G';
                }
                else if (choice2 === 'g') {
                    label = 'Play P-G-B';
                }
            }
            else if (choice === 'g') {
                if (choice2 === 'b') {
                    label = 'Play G-B-P';
                }
                else if (choice2 === 'p') {
                    label = 'Play G-P-B';
                }
            }

        }

        // console.log('Choice 1: ' + Session.get('gamePick'));
        // console.log('Choice 2: ' + Session.get('GameChoice2'));
        // console.log('Choice 3: ' + Session.get('GameChoice3'));

        return label;
    },

    'showStatistics': () => {
        if (Session.get('showStats') === 'none') {
            return false;
        }
        return true;
    },

    'noBalance': () => {

        if (Session.get('noBalance') === 'true') {
            return true;
        }
        return false;

    },

    'yesError': () => {
        if (Session.get('yesError') === 'true') {
            return true;
        }
        return false;
    },

    'successMessageWon': () => {
        if (Session.get('messageWon') === 'true') {
            return true;
        }
        return false;
    },

    'successMessageFail': () => {
        if (Session.get('messageLost') === 'true') {
            return true;
        }
        return false;
    },

    'showDeposit': () => {
        if (Session.get('UserMaxGames') <= 5) {
            return true;
        }
        return false;
    },

    'challengeStatus': () => {
        if (Session.get('inChallenge') === 'true') {
            return true;
        }
        return false;
    },
});

loadUsername = () => {
    if (!Meteor.userId()) return 'Sign In First'
    if (Meteor.userId()) {
        Meteor.call('loadUsername', Meteor.userId(), (err, res) => {
            if (err) {
                return 'Loading...';
            } else {
                // console.log('Session value is : ' + Session.get('getUsername'));
                Session.set('getUsername', res);
            }
        });
    }
}

loadActive = () => {

    if (Session.get('gamePick') === 'none') {
        // console.log('The condition was executed because there was no game');
        if (!Meteor.userId()) {
            Meteor.call('loadThisGame', (err, res) => {
                if (err) {
                    Session.set('loadEmpty', 'true');
                } else {
                    if (res[0] === 'noGame') {
                        Session.set('loadEmpty', 'true');

                    } else {

                        Session.set('gamePick', res[0]);
                        Session.set('gameMax', res[1]);

                        Session.set('loadEmpty', 'none');
                    }
                }
            });
        }

        // Load a proper game if the user is logged in
        if (Meteor.userId()) {
            Meteor.call('loadUserGame', Meteor.userId(), (err, res) => {
                if (err) {
                    Session.set('loadEmpty', 'true');
                } else {

                    // console.log(res[0] + ' is the output of data')

                    if (res[0] === 'noGame') {
                        Session.set('loadEmpty', 'true');
                    } else {
                        Session.set('gamePick', res[0]);
                        Session.set('gameMax', res[1]);
                        // checkValidity();
                        Session.set('loadEmpty', 'none');
                    }
                }

            });
        }

    }
    //  else {
    //     console.log('The condition will not execut because we have a running game');
    // }
}

loadFrequent = () => {

    if (Session.get('gamePick') === 'none') {
        let x = setInterval(() => {
            loadActive();
            if (Session.get('gamePick') !== 'none') {
                clearInterval(x);
            }
            // console.log(Session.get('gamePick') + ' is the current Pick');
        }, 10000);
    } else {
        // console.log('The current Choice is: ' + Session.get('gamePick'));
    }
}
// checkValidity();
