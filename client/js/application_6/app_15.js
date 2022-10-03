Session.set('loadEmpty', 'none');

Template.home.events({

    'click #select': () => {

        // checkValidity();

        let select = document.getElementById('select');
        select.classList.remove('text-success');
        select.classList.add('text-muted');

        setTimeout(() => {
            select.classList.remove('text-muted');
            select.classList.add('text-success');
        }, 250);

        pickChoice();
    },

    'click #select2': () => {

        // checkValidity();

        let select = document.getElementById('select');
        select.classList.remove('text-success');
        select.classList.add('text-muted');

        setTimeout(() => {
            select.classList.remove('text-muted');
            select.classList.add('text-success');
        }, 250);

        pickChoice();
    },

    'click #stats': () => {
        // alert('Stats Button was clicked');
        if (Session.get('showStats') === 'none') { Session.set('showStats', 'true'); }
        else { Session.set('showStats', 'none'); }
        Session.set('quick', 'false');
    },

    'click #cancel': () => {


        Session.set('showStats', 'none');

        if (Session.get('blue') === 0 && Session.get('purple') === 0 && Session.get('green') === 0) {
            requestSelection();
            return false;
        }

        // check the game validity after cancelling
        // if (Meteor.userId()) {
        //     checkValidity();
        // }

        // let cancel = document.getElementById('cancel');
        // cancel.classList.remove('text-danger');
        // cancel.classList.add('text-muted');

        // setTimeout(() => {
        //     cancel.classList.remove('text-muted');
        //     cancel.classList.add('text-danger');
        // }, 250);

        initializeSession();
    },

    'click #plus': () => {

        // Hide the stats if it shows
        Session.set('showStats', 'none');

        // alert('Plus Button was clicked');
        if (Session.get('blue') === 0 && Session.get('purple') === 0 && Session.get('green') === 0) {
            requestSelection();
            return false;
        }

        if (Session.get('loadEmpty').toString() === 'true') {
            // console.log('This Game is no longer active in select');
            loadNext();
            return false;
        }

        let max = Session.get('gameMax');
        let plus = document.getElementById('plus');
        let val = Session.get('userGame');
        val = val + 1;
        if (val > max) {
            val = max;
        }
        Session.set('userGame', val);

        plus.classList.remove('text-success');
        plus.classList.add('text-muted');

        setTimeout(() => {
            plus.classList.remove('text-muted');
            plus.classList.add('text-success');
        }, 250);
        // }
    },

    'click #minus': () => {

        // Hide the stats if it shows
        Session.set('showStats', 'none');
        // alert('Plus Button was clicked');
        if (Session.get('blue') === 0 && Session.get('purple') === 0 && Session.get('green') === 0) {
            requestSelection();
            return false;
        }

        if (Session.get('loadEmpty').toString() === 'true') {
            // console.log('This Game is no longer active in select');
            loadNext();
            return false;
        }

        let minus = document.getElementById('minus');

        let val = Session.get('userGame');
        val = val - 1;
        if (val <= 0) {
            val = 1;
        }
        Session.set('userGame', val);

        minus.classList.remove('text-danger');
        minus.classList.add('text-muted');

        setTimeout(() => {
            minus.classList.remove('text-muted');
            minus.classList.add('text-danger');
        }, 250);
        // }
    },

    'click #maximum': () => {

        // Hide the stats if it shows
        Session.set('showStats', 'none');
        // alert('Maximum Button was clicked');
        if (Session.get('blue') === 0 && Session.get('purple') === 0 && Session.get('green') === 0) {
            requestSelection();
            return false;
        }

        if (Session.get('loadEmpty').toString() === 'true') {
            // console.log('This Game is no longer active in select');
            loadNext();
            return false;
        }

        let max = document.getElementById('maximum');

        let val = Session.get('userGame');
        val = Session.get('gameMax');

        // if (val >= Session.get('gameMax')) {
        Session.set('userGame', val);

        val = Session.get('gameMax');
        max.classList.remove('text-info');
        max.classList.add('text-muted');

        setTimeout(() => {
            max.classList.remove('text-muted');
            max.classList.add('text-info');
        }, 250);
        // }
    },

    'click #next': () => {

        // Hide the stats if it shows
        Session.set('showStats', 'none');

        // They will be used to hold current choice 2 and 3

        let label = document.getElementById('labelChanger');
        label.classList.remove('lightSpeedIn');
        // label.classList.remove('animated');
        loadNext();
        initializeSession();

        setTimeout(() => {
            label.classList.add('lightSpeedIn');
        }, 50);
        // label.classList.add('animated');

        let next = document.getElementById('next');
        next.classList.remove('text-primary');
        next.classList.add('text-muted');

        setTimeout(() => {
            next.classList.remove('text-muted');
            next.classList.add('text-primary');
        }, 250);

        // initializeSession();

        // alert('A new Game has been loaded');
    },

    'click #play': () => {

        // alert('This Game will be Played now!');
        Session.set('showStats', 'none');
        // check if the game is still valid

        if (Session.get('blue') === 0 && Session.get('purple') === 0 && Session.get('green') === 0) {
            requestSelection();
            return false;
        }

        if (!Meteor.userId()) {
            let thisButton = document.getElementById('play'), req = document.getElementById('signInLink');
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-red');
            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-dark');
            }, 600);
            return false;
        }

        // checkValidity();

        if (Session.get('loadEmpty') === 'true') {
            // console.log('This Game is no longer active in select');
            loadNext();
            return false;
        }

        if (Meteor.userId()) {

            let x = '';

            if (Session.get('blue') === 2) {
                x = 'b';
            } else if (Session.get('purple') === 2) {
                x = 'p';
            } else if (Session.get('green') === 2) {
                x = 'g';
            }
            // else {
            //     // throw error
            // }

            // console.log('Choice 2 is: ' + x);
            // console.log('User Games: ' + Session.get('userGame'));
            let y = Session.get('userGame');

            if (y === 0) {
                requestSelection();
                return false;
            }

            let balance = Session.get('balance');
            let totalCost = Session.get('totalCost');

            if (parseFloat(balance) >= parseFloat(totalCost)) {

                Meteor.call('playGame', Meteor.userId(), x, y, (err, res) => {

                    let timeShower = 2000;

                    if (err) {
                        // throw error
                        if (err.toString() === 'Error: [balance]') {
                            // console.log('The Balance is unsufficient');
                            Session.set('noBalance', 'true');

                            setTimeout(() => {
                                Session.set('noBalance', 'false');
                                // Session.set('noBalance', 'false');
                            }, timeShower);

                        } else {

                            Session.set('yesError', 'true');

                            setTimeout(() => {
                                Session.set('yesError', 'false');
                            }, timeShower);
                            // console.log('Error while Placing game');
                            loadNext();
                            initializeSession();
                        }

                    } else {

                        // console.log('The result from the server is: ' + res);
                        let thisButton = document.getElementById('play');

                        if (res.toString() === 'won') {
                            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-success');
                            Session.set('messageWon', 'true');
                            setTimeout(() => {
                                Session.set('messageWon', 'false');
                                thisButton.classList.remove('btn-success'); thisButton.classList.add('btn-dark');
                            }, timeShower);
                        }

                        else if (res.toString() === 'lost') {
                            Session.set('messageLost', 'true');
                            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-red');
                            setTimeout(() => {
                                Session.set('messageLost', 'false');
                                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-dark');
                            }, timeShower);
                        }

                        else if (res.toString() === 'none') {

                            Session.set('yesError', 'true');
                            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-danger');
                            setTimeout(() => {
                                Session.set('yesError', 'false');
                                thisButton.classList.remove('btn-danger'); thisButton.classList.add('btn-dark');
                            }, timeShower);
                        }
                        loadBalanceInstantly();
                        loadMaxGames();
                        loadCoupon();
                        loadNext();
                        initializeSession();
                        loadChallengeStatus();
                    }
                });

            } else {

                Session.set('noBalance', 'true');

                setTimeout(() => {
                    Session.set('noBalance', 'false');
                    // Session.set('noBalance', 'false');
                }, 2000);
            }
        }
    },

    'click #emptyMode': () => {

        Session.set('showStats', 'none');

        let btn = document.getElementById('emptyMode');
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-red');

        setTimeout(() => {
            btn.classList.remove('btn-red');
            btn.classList.add('btn-dark');
        },
            1000);
        loadNext();
    }
});

loadNext = () => {

    if (!Meteor.userId()) {
        Meteor.call('loadThisGame', (err, res) => {
            if (err) {
                Session.set('loadEmpty', 'true');
                initializeSession();
            } else {
                if (res[0] === 'noGame') {
                    Session.set('loadEmpty', 'true');
                    initializeSession();

                } else {
                    Session.set('gamePick', res[0]);
                    Session.set('gameMax', res[1]);
                    checkValidity();
                }
            }
        });
    }

    // Load a proper game if the user is logged in
    if (Meteor.userId()) {
        // console.log('This one here is concerned where the user logged in');
        Meteor.call('loadUserGame', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('loadEmpty', 'true');
                initializeSession();
            } else {
                if (res[0] === 'noGame') {
                    Session.set('loadEmpty', 'true');
                    initializeSession();
                } else {
                    Session.set('gamePick', res[0]);
                    Session.set('gameMax', res[1]);
                    checkValidity();
                }
            }

        });
    }

}

pickChoice = () => {

    // Hide the stats if it shows
    Session.set('showStats', 'none');
    Session.set('quick', 'false');

    if (Meteor.userId()) {
        checkValidity();
    }

    // alert('Select Button was clicked');
    let choice2 = Session.get('GameChoice2'); let choice3 = Session.get('GameChoice3');
    let choice = Session.get('gamePick').toString();

    if (choice2 === 'none' || choice3 === 'none') {

        if (choice === 'b') {
            let r = Math.round(Math.random() * 1);
            if (r === 0) {
                Session.set('GameChoice2', 'p'); Session.set('GameChoice3', 'g');
                Session.set('purple', 2); Session.set('green', 3); Session.set('userGame', 1);
            }
            else {
                Session.set('GameChoice2', 'g'); Session.set('GameChoice3', 'p');
                Session.set('purple', 3); Session.set('green', 2); Session.set('userGame', 1);
            }
        }
        else if (choice === 'p') {
            let r = Math.round(Math.random() * 1);
            if (r === 0) {
                Session.set('GameChoice2', 'b'); Session.set('GameChoice3', 'g');
                Session.set('blue', 2); Session.set('green', 3); Session.set('userGame', 1);
            }
            else {
                Session.set('GameChoice2', 'g'); Session.set('GameChoice3', 'b');
                Session.set('blue', 3); Session.set('green', 2); Session.set('userGame', 1);
            }
        }
        else if (choice === 'g') {
            let r = Math.round(Math.random() * 1);
            if (r === 0) {
                Session.set('GameChoice2', 'b'); Session.set('GameChoice3', 'p');
                Session.set('blue', 2); Session.set('purple', 3); Session.set('userGame', 1);
            }
            else {
                Session.set('GameChoice2', 'p'); Session.set('GameChoice3', 'b');
                Session.set('blue', 3); Session.set('purple', 2); Session.set('userGame', 1);
            }
        }
    }

    else {

        if (choice === 'b') {
            if (choice2 === 'p') {
                Session.set('GameChoice2', 'g'); Session.set('GameChoice3', 'p');
                Session.set('green', 2); Session.set('purple', 3);
            }
            else {
                Session.set('GameChoice2', 'p'); Session.set('GameChoice3', 'g');
                Session.set('green', 3); Session.set('purple', 2);
            }
        }
        else if (choice === 'p') {
            if (choice2 === 'b') {
                Session.set('GameChoice2', 'g'); Session.set('GameChoice3', 'b');
                Session.set('green', 2); Session.set('blue', 3);
            }
            else {
                Session.set('GameChoice2', 'b'); Session.set('GameChoice3', 'g');
                Session.set('green', 3); Session.set('blue', 2);
            }
        }
        else if (choice === 'g') {
            if (choice2 === 'p') {
                Session.set('GameChoice2', 'b'); Session.set('GameChoice3', 'p');
                Session.set('purple', 3); Session.set('blue', 2);
            }
            else {
                Session.set('GameChoice2', 'p'); Session.set('GameChoice3', 'b');
                Session.set('purple', 2); Session.set('blue', 3);
            }
        }

    }

    if (Session.get('loadEmpty').toString() === 'true') {
        // console.log('This Game is no longer active in select');
        loadNext();
        return false;
    }
    // else {
    //     console.log('The Validity is correct');
    // }
}
// shake the select button if no selection has been made before
requestSelection = () => {

    let select = document.getElementById('select');
    let select2 = document.getElementById('select2');

    if (Session.get('GameChoice2') === 'none' || Session.get('GameChoice3') === 'none') {

        select.classList.remove('pulse');
        select.classList.remove('text-success');
        select.classList.add('heartBeat');
        select.classList.add('text-danger');

        select2.classList.remove('pulse');
        select2.classList.remove('text-success');
        select2.classList.add('heartBeat');
        select2.classList.add('text-danger');

        clearTimeout();

        setTimeout(
            () => {
                select.classList.remove('heartBeat');
                select.classList.remove('text-danger');
                select.classList.add('pulse');
                select.classList.add('text-success');

                select2.classList.remove('heartBeat');
                select2.classList.remove('text-danger');
                select2.classList.add('pulse');
                select2.classList.add('text-success');
            }
            , 1000);

    }
}

initializeSession = () => {

    Session.set('GameChoice2', 'none');
    Session.set('GameChoice3', 'none');
    Session.set('userWin', 0);
    Session.set('userGame', 0);
    Session.set('userTotalCost', 0);
    Session.set('blue', 0);
    Session.set('purple', 0);
    Session.set('green', 0);
}

checkValidity = () => {

    // let isValid = '';

    if (Session.get('gamePick') !== 'none') {

        if (Meteor.userId()) {
            // t = setInterval(check(t), 10000);
            let time = setInterval(() => {

                Meteor.call('checkValidity', Meteor.userId(), (err) => {
                    if (err) {
                        loadNext();
                        // console.log('no Game is available and err is: ' + err);
                        // Session.set('loadEmpty', 'true');
                        // isValid = false;
                        // clearInterval(time);
                    } else {
                        // if (res.toString() === 'none') {
                        //     // console.log('The result is: ' + res);
                        //     loadNext();
                        //     // isValid = false;
                        // } else {
                        Session.set('loadEmpty', 'none');
                        // console.log('This game is still valid');
                        // checkValidity();
                        // isValid = true;
                        // }
                    }

                    // console.log('The Session is: ' + Session.get('loadEmpty'));
                });

                if (Session.get('gamePick') === 'none') {
                    clearInterval(time);
                }
                // repeat every 15s by checking if the game is still valid
            }, 5000)
        }
    }

    // else {

    //     loadNext();
    // }

    // console.log('The output here is: ' + isValid);

    // return isValid;

    // if (Session.get('loadEmpty') === 'true') {
    //     console.log('No Game is available to execute this method');
    // }
}

// checkValidity();
