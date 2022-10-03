import { Meteor } from "meteor/meteor";

Session.set('one', 'none'); Session.set('two', 'none'); Session.set('three', 'none'); Session.set('games', 0);
Session.set('winAmount', 0); Session.set('userCoupon', 0); Session.set('totalCost', 0);
Session.set('success', 'none'); Session.set('fail', 'none'); Session.set('enoughBalance', 'none');

Template.new.helpers({

    'loadBalance': () => {

        if (!Meteor.userId()) return '0.00000';
        Meteor.call('loadBalance', Meteor.userId(), (err, res) => {
            if (err) return '0.00000'
            else Session.set('balance', res[0]);
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
            if (err) return '0'
            else Session.set('UserMaxGames', res);
        });
        return Session.get('UserMaxGames');
    },

    'loadCoupon': () => {

        if (!Meteor.userId()) return '0';
        Meteor.call('loadCoupon', Meteor.userId(), (err, res) => {
            if (err) return '0'
            else Session.set('userCoupon', res)
        });
        return Session.get('userCoupon');
    },

    'sessionGames': () => { return Session.get('games'); },

    'totalWin': () => {

        Meteor.call('totalWin', Session.get('games'), (err, res) => {
            if (err) return 'loading';
            else Session.set('winAmount', res);
        });

        return Session.get('winAmount');
    },

    'totalCost': () => {

        if (Meteor.userId()) {
            Meteor.call('totalCostId', Session.get('games'), Meteor.userId(), (err, res) => {
                if (err) return 'loading';
                else Session.set('totalCost', res);
            });
        } else {
            Meteor.call('totalCost', Session.get('games'), (err, res) => {
                if (err) return 'loading';
                else Session.set('totalCost', res);
            });
        }

        return Session.get('totalCost');
    },

    'getOne': () => { if (Session.get('one').toString() === 'none') { return false; } return true; },

    'getTwo': () => { if (Session.get('two').toString() === 'none') { return false; } return true; },

    'getThree': () => { if (Session.get('three').toString() === 'none') { return false; } return true; },

    'userOne': () => {

        let txt = '';
        if (Session.get('one').toString() === 'b') txt = 'B_';
        else if (Session.get('one').toString() === 'p') txt = 'P_';
        else if (Session.get('one').toString() === 'g') txt = 'G_';

        return txt;

    },

    'userTwo': () => {

        let txt = '';

        if (Session.get('two').toString() === 'b') txt = 'B_';
        else if (Session.get('two').toString() === 'p') txt = 'P_';
        else if (Session.get('two').toString() === 'g') txt = 'G_';

        return txt;
    },

    'userThree': () => {

        let txt = '';

        if (Session.get('three').toString() === 'b') txt = 'B_';
        else if (Session.get('three').toString() === 'p') txt = 'P_';
        else if (Session.get('three').toString() === 'g') txt = 'G_';

        return txt;
    },

    'uniqueBlue': () => {

        if ((Session.get('one').toString() === 'b') &&
            (Session.get('two').toString() === 'none') && (Session.get('three').toString() === 'none')) {
            return true;
        }
        return false;
    },

    'uniquePurple': () => {

        if ((Session.get('one').toString() === 'p') &&
            (Session.get('two').toString() === 'none') && (Session.get('three').toString() === 'none')) {
            return true;
        }
        return false;
    },

    'uniqueGreen': () => {

        if ((Session.get('one').toString() === 'g') &&
            (Session.get('two').toString() === 'none') && (Session.get('three').toString() === 'none')) {
            return true;
        }
        return false;
    },

    'validSession': () => {
        if (Session.get('one') !== 'none' && Session.get('two') !== 'none' && Session.get('three') !== 'none') { return true; }
        return false;
    },

    'validPurpleSession': () => {
        if (Session.get('one') !== 'p' && Session.get('two') !== 'p' && Session.get('three') !== 'p') { return false; }
        return true;
    },

    'validBlueSession': () => {
        if (Session.get('one') !== 'b' && Session.get('two') !== 'b' && Session.get('three') !== 'b') { return false; }
        return true;
    },

    'validGreenSession': () => {
        if (Session.get('one') !== 'g' && Session.get('two') !== 'g' && Session.get('three') !== 'g') { return false; }
        return true;
    },

    'purpleSession': () => {
        if (Session.get('one') === 'p') return 'one';
        if (Session.get('two') === 'p') return 'two';
        if (Session.get('three') === 'p') return 'three';
    },

    'purpleSide': (value) => {
        if (value === 'one') return 1
        if (value === 'two') return 2
        if (value === 'three') return 3
    },

    'blueSession': () => {
        if (Session.get('one') === 'b') return 'one';
        if (Session.get('two') === 'b') return 'two';
        if (Session.get('three') === 'b') return 'three';
    },

    'blueSide': (value) => {
        if (value === 'one') return 1
        if (value === 'two') return 2
        if (value === 'three') return 3
    },

    'greenSession': () => {
        if (Session.get('one') === 'g') return 'one';
        if (Session.get('two') === 'g') return 'two';
        if (Session.get('three') === 'g') return 'three';
    },

    'greenSide': (value) => {
        if (value === 'one') return 1
        if (value === 'two') return 2
        if (value === 'three') return 3
    },

    'successSession': () => {
        if (Session.get('success').toString() === 'none') return false;
        return true;
    },

    'failSession': () => {
        if (Session.get('fail').toString() === 'none') return false;
        return true;
    },

    'noResponse': () => {

        if (Session.get('success').toString() === 'none' && Session.get('fail').toString() === 'none' && Session.get('enoughBalance').toString() === 'none') {
            return true;
        }
        return false;
    },

    'enoughBalance': () => {
        if (Session.get('enoughBalance').toString() === 'none') return false;
        return true;
    },

    'challengeStatus': () => {
        if (Session.get('inChallenge') === 'true') return true;
        return false;
    },
});

let intervalRepeat = 30000;
// load coupon every time
loadCouponBonus = () => {

    if (!Meteor.userId()) Session.set('userCoupon', 0)
    if (Meteor.userId()) {
        setInterval(
            () => {
                Meteor.call('loadCoupon', Meteor.userId(), (err, res) => {
                    if (err) Session.set('userCoupon', 0)
                    else Session.set('userCoupon', res)
                })
            }
            , intervalRepeat);
    }
}
// load Balance every ten second
loadRealBalance = () => {

    if (!Meteor.userId()) { Session.set('balance', 0); Session.set('challengeBalance', 0); }
    if (Meteor.userId()) {
        setInterval(
            () => {
                Meteor.call('loadBalance', Meteor.userId(), (err, res) => {
                    if (err) {
                        Session.set('balance', 0);
                        Session.set('challengeBalance', 0);
                    }
                    else {
                        Session.set('balance', res[0]);
                        Session.set('challengeBalance', res[1]);
                    }
                });
                // load challenge details if in challenge
                if (Session.get('inChallenge') === 'true') loadChallengeStatus();
                // load the current user max games on balance update
                loadMaxGames();
            }

            , intervalRepeat);
    }
}

loadUpdateBalance = () => {
    if (Meteor.userId()) setInterval(() => { Meteor.call('updateBalance', Meteor.userId()); }, 90000);
}

loadBalanceInstantly = () => {

    if (!Meteor.userId()) {
        Session.set('balance', 0);
        Session.set('challengeBalance', 0);
    }

    if (Meteor.userId()) {
        Meteor.call('loadBalance', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('balance', 0);
                Session.set('challengeBalance', 0);
            }
            else {
                Session.set('balance', res[0]);
                Session.set('challengeBalance', res[1]);
            }
        });
    }
}

loadMaxGames = () => {

    if (!Meteor.userId()) Session.set('UserMaxGames', 0);
    if (Meteor.userId()) {
        Meteor.call('userMax', Meteor.userId(), (err, res) => {
            if (err) Session.set('UserMaxGames', 0);
            else Session.set('UserMaxGames', res);
        });
    }
}

loadCoupon = () => {

    if (!Meteor.userId()) Session.set('userCoupon', 0)
    if (Meteor.userId()) {
        Meteor.call('loadCoupon', Meteor.userId(), (err, res) => {
            if (err) Session.set('userCoupon', 0)
            else Session.set('userCoupon', res)
        });
    }
}

loadCouponBonus();
loadRealBalance();
loadUpdateBalance();