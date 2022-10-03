// used to display the exact panel based on the user status
Session.set('inChallenge', 'false');
Session.set('enterName', 'false');
Session.set('currentTeam', 'false');
// conatins challenge details
Session.set('challengeName', 'none');
Session.set('challengeTeam', 'none');
Session.set('showDetailsPane', 'none');
Session.set('showActiveChallenge', 'none');
// conatins details of a specific challenge
Session.set('alphaLength', 0);
Session.set('betaLength', 0);
Session.set('userChallengeGames', 0);
Session.set('totalChallengeGames', 0);
// displays the counting time of a given challenge
Session.set('hours', 0);
Session.set('minutes', 0);
Session.set('seconds', 0);
Session.set('days', 0);
// contains challenge details such as time start and time now
Session.set('timeStart', 0);
Session.set('timeNow', 0);
Session.set('userShare', 0);
// display user challenge details
Session.set('detailsChallengeId', 'none');
Session.set('detailsChallengePlayers', 0);
// Session.set('detailsChallengeAlphaGames', 0);
// Session.set('detailsChallengeBetaGames', 0);
// used to show the start new challenge pane
Session.set('startNew', 'true');
// displays the cancel request
Session.set('cancelRequest', 0);
// used to display challenge points
Session.set('challengePoints', 0);
// used to load more challenges
Session.set('loadMore', 1);
// show the challenge pane
Session.set('chalPane', 'false')
// display an error if the user has no balance
Session.set('balanceError', 'false');

Template.challenge.events({

    'click #start_alpha': () => { Session.set('currentTeam', 'a'); Session.set('enterName', 'true'); },

    'click #start_beta': () => { Session.set('currentTeam', 'b'); Session.set('enterName', 'true'); },

    'click #backTeam': () => {
        Session.set('currentTeam', 'none'); Session.set('enterName', 'none');
        Session.set('balanceError', 'false');
    },

    'submit #start_challenge': (e) => {

        e.preventDefault();
        let chal_name = e.target.chal_name.value;
        let inputName = document.getElementById('chal_name');
        chal_name = trimInput(chal_name);

        if (Session.get('inChallenge') === 'true') {
            // console.log('the user is in challenge');
            return false;
        }
        if (isEmpty(chal_name)) { invalidMessage(inputName); return false; }
        if (isInvalidName(chal_name)) { invalidMessage(inputName); return false; }
        if (invalidLength(chal_name)) {

            // get the two labels and highligth them with some colors
            let min = document.getElementById('name-min');
            let max = document.getElementById('name-max');

            min.classList.remove('text-muted');
            min.classList.add('text-danger');
            min.classList.add('font-13');
            max.classList.remove('text-muted');
            max.classList.add('text-danger');
            max.classList.add('font-13');

            setTimeout(() => {
                min.classList.remove('text-danger');
                min.classList.add('text-muted');
                min.classList.remove('font-13');
                max.classList.remove('text-danger');
                max.classList.add('text-muted');
                max.classList.remove('font-13');
            }, 1000);

            invalidMessage(inputName); return false;
        }

        if (!Meteor.userId()) {
            let thisButton = document.getElementById('starting'), req = document.getElementById('signInLink');
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-red');
            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-dark');
            }, 600);
            return false;

        }

        // userMaxGames();

        // if (parseFloat(Session.get('balance')) >= 200) {
        // console.log('The minimum price is: ' + Session.get('minimumPrice'));
        // return false;
        if (parseFloat(Session.get('balance')) >= parseFloat(Session.get('minimumPrice'))) {

            Meteor.call('addChallenge', Meteor.userId(), chal_name, Session.get('currentTeam'), (err) => {
                if (err) {
                    // console.log('The server[0] error is: ' + err);
                    if (err.toString() === 'Error: [b]') {
                        Session.set('balanceError', 'true');
                    }
                    invalidMessage(inputName);
                }
                else document.location.reload(true);
            });
        }

        else {
            // console.log('Error balance from the client');
            // show the balance error
            Session.set('balanceError', 'true');
            return false;
        }

    },

    'keydown #chal_name': (evt) => {

        let val = document.getElementById('chal_name');
        let value = document.getElementById('chal_name').value;

        // let charCode = (evt.which) ? evt.which : event.keyCode
        if ((evt.charCode === 32) || (evt.which === 32)) {

            // alert('The value is: ' + value);
            // console.log('The old Value is: ' + value);
            // let newValue = '';

            // for (let i = 0; i < (value.length); i++) {
            //     newValue = newValue + value.charAt(i);
            // }

            value = value + '-';

            val.value = value;

            // console.log('The new Value is: ' + value);

            // evt.target.value.value = newValue;
            // e.target.message.value = '';
            return false;
        }
        return true;

    },

    'click #current_challenge': () => {

        if (Session.get('inChallenge') === 'false') return false;

        Session.set('showDetailsPane', 'false');
        document.getElementById('current_challenge').classList.remove('btn-primary');
        document.getElementById('current_challenge').classList.add('btn-success');
        // document.getElementById('current_challenge').classList.add('infinite');

        if (Session.get('detailsChallengeId') !== 'none') {
            document.getElementById(Session.get('detailsChallengeId')).classList.remove('btn-success');
            // document.getElementById(Session.get('detailsChallengeId')).classList.remove('infinite');
            document.getElementById(Session.get('detailsChallengeId')).classList.add('btn-primary');
        }
        loadChallengeStatus();
    },

    'click #close_challenge': () => {
        if (!Meteor.userId()) return false;
        if (Meteor.userId()) {
            Meteor.call('closeChallenge', Meteor.userId(), (err) => {
                if (err) loadChallengeStatus();
                else document.location.reload(true);
            });
        }
    },

    'click #keep_challenge': () => {
        if (!Meteor.userId()) return false;
        if (Meteor.userId()) {
            Meteor.call('keepChallenge', Meteor.userId(), (err, res) => {
                if (err) {
                    // loadGameDetails();
                    loadChallengeStatus();
                } else {
                    // loadGameDetails();
                    loadChallengeStatus();
                }
            });
        }
    },

    'click #start_challenge_pane': () => {

        Session.set('balanceError', 'false');
        document.getElementById('start_challenge_pane').classList.remove('btn-primary');
        document.getElementById('start_challenge_pane').classList.add('btn-secondary');
        // document.getElementById('start_challenge_pane').classList.add('infinite');

        if (Session.get('detailsChallengeId') !== 'none') {
            document.getElementById(Session.get('detailsChallengeId')).classList.remove('btn-success');
            // document.getElementById(Session.get('detailsChallengeId')).classList.remove('infinite');
            document.getElementById(Session.get('detailsChallengeId')).classList.add('btn-primary');
        }

        // alert('You want to start your own challenge?');
        Session.set('showDetailsPane', 'false');
        Session.set('showActiveChallenge', 'false');
        Session.set('startNew', 'true');
        // Session.set('showActiveChallenge', 'false');

    },

    'click #enterAlpha': () => {
        // Session.set('balanceError', 'false');
        // alert('You have requested to join alpha');
        // alert('The Id Challenge is: ' + Session.get('detailsChallengeId'));

        if (!Meteor.userId()) {
            let thisButton = document.getElementById('enterAlpha'), req = document.getElementById('signInLink');
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisButton.classList.remove('btn-info'); thisButton.classList.add('btn-red');
            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-info');
            }, 600);
            return false;
        }

        if (parseFloat(Session.get('balance')) >= parseFloat(Session.get('minimumPrice'))) {
            joinTeam('a');
        } else {

            Session.set('balanceError', 'true');
            // setTimeout(() => {
            // Session.set('balanceError', 'false');
            // }, 3000);
            return false;
        }

    },

    'click #enterBeta': () => {
        // alert('You have requested to join Beta');
        // Session.set('balanceError', 'false');
        if (!Meteor.userId()) {
            let thisButton = document.getElementById('enterBeta'), req = document.getElementById('signInLink');
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisButton.classList.remove('btn-info'); thisButton.classList.add('btn-red');
            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-info');
            }, 600);
            return false;
        }
        if (parseFloat(Session.get('balance')) >= parseFloat(Session.get('minimumPrice'))) {
            joinTeam('b');
        } else {

            Session.set('balanceError', 'true');
            // setTimeout(() => {
            // Session.set('balanceError', 'false');
            // }, 3000);
            return false;
        }
    },

    'keyup #search_challenge': () => {

        let val = document.getElementById('search_challenge');
        // let value = document.getElementById('search_challenge').value;
        let search = document.getElementById('search_challenge').value;

        // let charCode = (evt.which) ? evt.which : event.keyCode
        // console.log('The value is: ' + search);
        // console.log('The length is: ' + search.length);

        // if (isInvalidName(search)) { invalidMessage(val); return false; }
        if (invalidSearch(search)) {

            invalidMessage(val);

            let newValue = '';

            for (let i = 0; i < 18; i++) {
                // if (search.charAt(i) !== ' ') {
                newValue = newValue + search.charAt(i);
                // } else {
                //     newValue = newValue + '-';
                val.value = newValue;
                // }
            }
        }

        if (!isEmpty(search)) {

            let newValue = '';

            if (search.length > 18) {
                let txt = '';
                for (let i = 0; i < 18; i++) { txt = txt + search.charAt(i); }
                val.value = txt; search = txt;
                // console.log('The search after reduce is: ' + search);
            }

            for (let i = 0; i < search.length; i++) {
                if (search.charAt(i) !== ' ') { newValue = newValue + search.charAt(i); }
                else { newValue = newValue + '-'; val.value = newValue; }
            }
            // }

            // console.log('The search value is: ' + newValue);
            // console.log('The new search value is: ' + newValue);
            doChallengeSearch(newValue);
            // console.log('Executed');
        } else {
            displayChallenges();
        }

        if (Session.get('inChallenge') === 'true') {

            document.getElementById('current_challenge').classList.remove('btn-info');
            document.getElementById('current_challenge').classList.add('btn-success');
            document.getElementById('current_challenge').classList.add('infinite');
            Session.set('showActiveChallenge', 'true');
            Session.set('showDetailsPane', 'none');
            Session.set('startNew', 'false');

        } else {
            
            document.getElementById('start_challenge_pane').classList.remove('btn-info');
            document.getElementById('start_challenge_pane').classList.add('btn-secondary');
            document.getElementById('start_challenge_pane').classList.add('infinite');
            Session.set('startNew', 'true');
            Session.set('showActiveChallenge', 'false');
            Session.set('showDetailsPane', 'none');
        }
        // loadChallengeStatus();
        // Session.set('showDetailsPane', 'false');
    }

});

txtFunctionLabel = (number, id, name, btn) => {
    // console.log('The number is: ' + number);
    return '<div class="col-2 pt-2"><b>' + number +
        '</b></div><div class="col-5 pt-2 text-center"><b>' + name +
        '</b></div> <div class="col-5 text-center"> <button id="' + id +
        '" class="btn ' + btn + ' btn-sm ml-0" onclick=loadOneChallenge("' + id +
        '")>Details</button></div>';
}

loadOneChallenge = (id) => {
    // alert('Current ID: ' + id + ' or ' + Session.get('detailsChallengeId'));
    Session.set('balanceError', 'false');
    if (Session.get('detailsChallengeId') !== 'none') {
        document.getElementById(Session.get('detailsChallengeId')).classList.remove('btn-success');
        // document.getElementById(Session.get('detailsChallengeId')).classList.remove('infinite');
        document.getElementById(Session.get('detailsChallengeId')).classList.add('btn-primary');
    }

    // Session.set('currentClicked', id);
    // console.log('The clicked ID is: ' + id);
    Meteor.call('loadStatsChallenge', id, (err, res) => {

        if (err) {
            displayChallenges();
            // throw a network error
            // console.log('The error is: ' + err);
        } else {

            // console.log('The loaded Id is : ' + res[0])

            Session.set('detailsChallengeId', res[0]);
            Session.set('detailsChallengePlayers', res[1]);
            Session.set('timeStart', res[2]);
            Session.set('timeNow', res[3]);
            Session.set('nextTeamPlayer', res[4]);

            Session.set('showActiveChallenge', 'false');
            Session.set('startNew', 'false');

            // console.log('Time start: ' + Session.get('timeStart'));
            // console.log('Time Now: ' + Session.get('timeNow'));

            Session.set('showDetailsPane', 'false');
            setTimeout(() => {
                Session.set('showDetailsPane', 'true');
            }, 0.001);

            // b();

            // console.log('The last id after loading : ' + Session.get('detailsChallengeId'));


            if (Session.get('inChallenge') === 'true') {

                document.getElementById('current_challenge').classList.remove('btn-success');
                // document.getElementById('current_challenge').classList.remove('infinite');
                document.getElementById('current_challenge').classList.add('btn-primary');

                document.getElementById(id).classList.remove('btn-primary');
                document.getElementById(id).classList.add('btn-success');
                // document.getElementById(id).classList.add('infinite');

            } else {

                // if (Session.get('startNew') === 'true') {
                document.getElementById('start_challenge_pane').classList.remove('btn-secondary');
                // document.getElementById('start_challenge_pane').classList.remove('infinite');
                document.getElementById('start_challenge_pane').classList.add('btn-primary');
                // }

                if (Session.get('detailsChallengeId') !== 'none') {
                    document.getElementById(Session.get('detailsChallengeId')).classList.remove('btn-success');
                    // document.getElementById(Session.get('detailsChallengeId')).classList.remove('infinite');
                    document.getElementById(Session.get('detailsChallengeId')).classList.add('btn-primary');
                    document.getElementById(id).classList.remove('btn-primary');
                    document.getElementById(id).classList.add('btn-success');
                    // document.getElementById(id).classList.add('infinite');
                }

                else {
                    document.getElementById(id).classList.remove('btn-primary');
                    document.getElementById(id).classList.add('btn-success');
                    // document.getElementById(id).classList.add('infinite');
                }
            }

            // console.log('Successfully loaded');
        }

    });
}

displayChallenges = () => {

    // if (!Meteor.userId()) return false;
    Meteor.call('loadChallenges', Session.get('loadMore'), (err, res) => {
        if (err) Session.set('showActiveChallenge', 'false');
        else {
            if (res.toString() === '0') {
                Session.set('showActiveChallenge', 'false');
                Session.set('inChallenge', 'false');
                Session.set('challengeName', 'none');
                Session.set('showDetailsPane', 'none');
                Session.set('challengeTeam', 'none');
                Session.set('startNew', 'true');

                if (Session.get('chalPane') === 'true') {
                    setTimeout(() => {
                        document.getElementById('showChallenges').innerHTML = '<div class="col-12 pt-2 text-center">' +
                            ' <h3><a href="" onclick=loadMore()><i class="fas fa-sync-alt"></i></a></h3> </div>';
                    }, 10);
                }
            }
            else {
                Session.set('challenges', res);
                // return Session.get('output');
                let text = ''; let word = '';
                let cont = Session.get('challenges').toString() + ','; let len = cont.toString().length;

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

                        text = text + txtFunctionLabel((i + 1), arrayData[k], arrayData[k + 1], btnChoice);

                        // console.log('Array length is: ' + elementLength);
                        // console.log('K is : ' + k);

                        if (i === (elementLength - 1)) {
                            text = text + '<div class="col-12 pt-2 text-center">' +
                                ' <h3><a href="" onclick=loadMore()><i class="fas fa-sync-alt"></i></a></h3> </div>';
                        }
                        k = k + 2;
                    }

                    document.getElementById('showChallenges').innerHTML = text;
                }, 500);
            }
        }
    });
}

joinTeam = (team) => {

    if (Meteor.userId()) {

        Meteor.call('joinTeam', Meteor.userId(), Session.get('detailsChallengeId'), team, (err) => {
            if (err) {

                // console.log('Error is:' + err);
                if (err.toString() === 'Error: [beta now]') {
                    // console.log('I got the error bro');
                    document.getElementById('enterBeta').classList.remove('btn-info');
                    document.getElementById('enterBeta').classList.add('btn-red');
                    document.getElementById('enterBeta').classList.add('animated');
                    document.getElementById('enterBeta').classList.add('pulse');
                    document.getElementById('enterBeta').classList.add('infinite');
                    document.getElementById('enterBeta').innerHTML = "It's beta now";

                    setTimeout(() => {
                        document.getElementById('enterBeta').classList.remove('btn-red');
                        document.getElementById('enterBeta').classList.add('btn-info');
                        document.getElementById('enterBeta').classList.remove('animated');
                        document.getElementById('enterBeta').classList.remove('pulse');
                        document.getElementById('enterBeta').classList.remove('infinite');
                        document.getElementById('enterBeta').innerHTML = "Join Beta";
                    }, 1000);
                }

                else if (err.toString() === 'Error: [alpha now]') {
                    // console.log('I got the error bro');
                    document.getElementById('enterAlpha').classList.remove('btn-info');
                    document.getElementById('enterAlpha').classList.add('btn-red');
                    document.getElementById('enterAlpha').classList.add('animated');
                    document.getElementById('enterAlpha').classList.add('pulse');
                    document.getElementById('enterAlpha').classList.add('infinite');
                    document.getElementById('enterAlpha').innerHTML = "It's alpha now";

                    setTimeout(() => {
                        document.getElementById('enterAlpha').classList.remove('btn-red');
                        document.getElementById('enterAlpha').classList.add('btn-info');
                        document.getElementById('enterAlpha').classList.remove('animated');
                        document.getElementById('enterAlpha').classList.remove('pulse');
                        document.getElementById('enterAlpha').classList.remove('infinite');
                        document.getElementById('enterAlpha').innerHTML = "Join Alpha";
                    }, 1000);
                }

                else if (err.toString() === 'Error: [b]') {
                    Session.set('balanceError', 'true');
                }

                else {
                    Session.set('showActiveChallenge', 'false');
                }

            } else {
                // load the current challenge
                Session.set('showDetailsPane', 'false');
                loadChallengeStatus();
                // loadGameDetails();
                displayChallenges();
                // console.log('Successfully added to challenge');
            }
        });

    }

}

loadMore = () => {

    if (Session.get('inChallenge') === 'true') {

        Session.set('showActiveChallenge', 'true');
        Session.set('showDetailsPane', 'none');
        Session.set('startNew', 'false');

        document.getElementById('current_challenge').classList.remove('btn-primary');
        document.getElementById('current_challenge').classList.add('btn-success');
        // document.getElementById('current_challenge').classList.add('infinite');

    } else {

        Session.set('showActiveChallenge', 'false');
        Session.set('showDetailsPane', 'none');
        Session.set('startNew', 'true');

        document.getElementById('start_challenge_pane').classList.remove('btn-primary');
        document.getElementById('start_challenge_pane').classList.add('btn-secondary');
        // document.getElementById('start_challenge_pane').classList.add('infinite');
    }

    document.getElementById('search_challenge').value = '';

    let add = Session.get("loadMore");
    add = add + 1;
    Session.set('loadMore', add);
    Session.set('detailsChallengeId', 'none');

    loadChallengeStatus();
    displayChallenges();
}

doChallengeSearch = (input) => {

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

    if (search.length > 0) {

        Meteor.call('searchChallenge', search, (err, res) => {

            if (err) {
                if (err.toString() === 'Error: [empty]') {
                    // console.log('The Error is: ' + err);
                    // setTimeout(() => { 
                    let text = '';
                    text = text + '<div class="col-12 pt-2 text-center">' +
                        ' <h3>No result found</h3> </div>';
                    document.getElementById('showChallenges').innerHTML = text;
                    // }, 10);
                    return false;
                }
                else {
                    // console.log('The other Error is: ' + err);
                    let text = '';
                    text = text + '<div class="col-12 pt-2 text-center text-danger">' +
                        ' <h3> An error occured! </h3> </div>';
                    document.getElementById('showChallenges').innerHTML = text;
                }
                // loadChallengeStatus();
                // Session.set('showDetailsPane', 'false');
            }

            else {

                // console.log('The result is: ' + res);

                Session.set('challenges', res);
                // return Session.get('output');
                let text = ''; let word = '';
                let cont = Session.get('challenges').toString() + ','; let len = cont.toString().length;

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
                // setTimeout(() => {
                let elementLength = arrayData.length / 2; let ki = 0; let btnChoice = '';
                for (let i = 0; i < elementLength; i++) {
                    btnChoice = 'btn-info';
                    text = text + txtFunctionLabel((i + 1), arrayData[ki], arrayData[ki + 1], btnChoice);
                    ki = ki + 2;
                }
                document.getElementById('showChallenges').innerHTML = text;
                // }, 500);
            }

        });

    }

}
