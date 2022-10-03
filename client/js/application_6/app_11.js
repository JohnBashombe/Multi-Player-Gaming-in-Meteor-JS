import { Meteor } from "meteor/meteor";

Template.new.events({

    'submit #loadGame': () => {

        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');
        let bError = document.getElementById('bError'), pError = document.getElementById('pError'), gError = document.getElementById('gError');


        if (b.checked === false) {
            invalidChoice(bError);
            return false;
        }

        else if (p.checked === false) {
            invalidChoice(pError);
            return false;
        }

        else if (g.checked === false) {
            invalidChoice(gError);
            return false;

        }

        else if (!Meteor.userId()) {
            let thisButton = document.getElementById('addNew'), req = document.getElementById('signInLink');
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisButton.classList.remove('btn-dark'); thisButton.classList.add('btn-red');
            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisButton.classList.remove('btn-red'); thisButton.classList.add('btn-dark');
            }, 600);

            return false;
        }

        else {

            let timeShower = 2000;
            let balance = Session.get('balance');
            let totalCost = Session.get('totalCost');

            if (parseFloat(balance) >= parseFloat(totalCost)) {

                Meteor.call('loadNewGame', Session.get('two'), Session.get('three'),
                    Session.get('games'), Meteor.userId(),
                    (err) => {
                        if (err) {
                            // console.log(err.reason + ' FROM SERVER ' + err);

                            // if (err.toString() === 'Error: [side2]') {
                            //     console.log(err + ' Right error was caught');
                            // }
                            Session.set('fail', 'error');
                            setTimeout(() => {
                                Session.set('fail', 'none');
                            }, timeShower);
                        }
                        else {
                            // Show Result
                            Session.set('success', 'error');
                            Session.set('one', 'none'); Session.set('two', 'none');
                            Session.set('three', 'none'); Session.set('games', 0);
                            Session.set('winAmount', 0); Session.set('totalCost', 0);
                            setTimeout(() => {
                                Session.set('success', 'none');
                                // document.location.reload(true);
                                // Router.go('/account');

                            }, timeShower);
                            Session.set('noGames', 'none');
                            loadBalanceInstantly();
                            loadMaxGames();
                            loadCoupon();
                        }
                    });

            } else {
                Session.set('enoughBalance', 'error');
                setTimeout(() => {
                    Session.set('enoughBalance', 'none');
                }, timeShower);
            }

            return false;
        }
    },

    'click #b': () => {

        document.getElementById('bError').classList.add('hide');
        document.getElementById('pError').classList.add('hide');
        document.getElementById('gError').classList.add('hide');
        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');

        if (b.checked) {
            if (!p.checked && !g.checked) { Session.set('one', 'b'); }
            else if (p.checked && !g.checked) { Session.set('two', 'b'); Session.set('three', 'g'); g.checked = true; Session.set('games', 1); loadCouponBonus(); }
            else if (!p.checked && g.checked) { Session.set('two', 'b'); Session.set('three', 'p'); p.checked = true; Session.set('games', 1); loadCouponBonus(); }
        } else {
            b.checked = false; p.checked = false; g.checked = false;
            Session.set('one', 'none'); Session.set('two', 'none'); Session.set('three', 'none');
            Session.set('games', 0); Session.set('winAmount', 0); Session.set('totalCost', 0);
            document.getElementById('bError').classList.add('hide');
            document.getElementById('pError').classList.add('hide');
            document.getElementById('gError').classList.add('hide');
        }
    },

    'click #p': () => {

        document.getElementById('bError').classList.add('hide');
        document.getElementById('pError').classList.add('hide');
        document.getElementById('gError').classList.add('hide');
        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');

        if (p.checked) {
            if (!b.checked && !g.checked) Session.set('one', 'p');
            else if (b.checked && !g.checked) { Session.set('two', 'p'); Session.set('three', 'g'); g.checked = true; Session.set('games', 1); loadCouponBonus(); }
            else if (!b.checked && g.checked) { Session.set('two', 'p'); Session.set('three', 'b'); b.checked = true; Session.set('games', 1); loadCouponBonus(); }
        }
        else {
            b.checked = false; p.checked = false; g.checked = false;
            Session.set('one', 'none'); Session.set('two', 'none'); Session.set('three', 'none');
            Session.set('games', 0); Session.set('winAmount', 0); Session.set('totalCost', 0);
            document.getElementById('bError').classList.add('hide');
            document.getElementById('pError').classList.add('hide');
            document.getElementById('gError').classList.add('hide');
        }
    },

    'click #g': () => {

        document.getElementById('bError').classList.add('hide');
        document.getElementById('pError').classList.add('hide');
        document.getElementById('gError').classList.add('hide');
        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');

        if (g.checked) {
            if (!b.checked && !p.checked) Session.set('one', 'g');
            else if (b.checked && !p.checked) { Session.set('two', 'g'); Session.set('three', 'p'); p.checked = true; Session.set('games', 1); loadCouponBonus(); }
            else if (!b.checked && p.checked) { Session.set('two', 'g'); Session.set('three', 'b'); b.checked = true; Session.set('games', 1); loadCouponBonus(); }
        }
        else {
            b.checked = false; p.checked = false; g.checked = false;
            Session.set('one', 'none'); Session.set('two', 'none'); Session.set('three', 'none');
            Session.set('games', 0); Session.set('winAmount', 0); Session.set('totalCost', 0);
            document.getElementById('bError').classList.add('hide');
            document.getElementById('pError').classList.add('hide');
            document.getElementById('gError').classList.add('hide');
        }
    },

    'click #addGame': () => {

        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');
        let bError = document.getElementById('bError'), pError = document.getElementById('pError'), gError = document.getElementById('gError');

        if (b.checked === false) { invalidChoice(bError); return false; }
        else if (p.checked === false) { invalidChoice(pError); return false; }
        else if (g.checked === false) { invalidChoice(gError); return false; }

        let val = Session.get('games');
        val = parseInt(val) + 1;

        if (val > 100000) val = 100000;
        Session.set('games', val);

        let thisLabel = document.getElementById('addLabel');
        let req = document.getElementById('signInLink');

        if (!Meteor.userId()) {
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisLabel.classList.remove('text-info'); thisLabel.classList.add('text-muted');

            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-info');

            }, 250);
            return false;
        }

        else {
            thisLabel.classList.remove('text-info'); thisLabel.classList.add('text-muted');
            setTimeout(() => {
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-info');
            }, 250);
        }

    },

    'click #minusGame': () => {

        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');
        let bError = document.getElementById('bError'), pError = document.getElementById('pError'), gError = document.getElementById('gError');

        if (b.checked === false) { invalidChoice(bError); return false; }
        else if (p.checked === false) { invalidChoice(pError); return false; }
        else if (g.checked === false) { invalidChoice(gError); return false; }

        else {
            let val = Session.get('games'); val = parseInt(val) - 1;
            if (val < 1) val = 1;
            Session.set('games', val);
        }

        let thisLabel = document.getElementById('minusLabel');
        let req = document.getElementById('signInLink');

        if (!Meteor.userId()) {
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisLabel.classList.remove('text-danger'); thisLabel.classList.add('text-muted');

            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-danger');

            }, 250);
            return false;
        }

        else {
            thisLabel.classList.remove('text-danger'); thisLabel.classList.add('text-muted');
            setTimeout(() => {
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-danger');
            }, 250);
        }
    },

    'click #divideGame': () => {

        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');
        let bError = document.getElementById('bError'), pError = document.getElementById('pError'), gError = document.getElementById('gError');

        if (b.checked === false) { invalidChoice(bError); return false; }
        else if (p.checked === false) { invalidChoice(pError); return false; }
        else if (g.checked === false) { invalidChoice(gError); return false; }

        else {
            let val = Session.get('games'); val = parseInt(val) / 2;
            if (val < 1) val = 1;
            Session.set('games', Math.round(Math.floor(val)));
        }

        let thisLabel = document.getElementById('divideLabel');
        let req = document.getElementById('signInLink');

        if (!Meteor.userId()) {
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisLabel.classList.remove('text-primary'); thisLabel.classList.add('text-muted');

            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-primary');

            }, 250);
            return false;
        }

        else {
            thisLabel.classList.remove('text-primary'); thisLabel.classList.add('text-muted');
            setTimeout(() => {
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-primary');
            }, 250);
        }
    },

    'click #timesGame': () => {

        let b = document.getElementById('b'), p = document.getElementById('p'), g = document.getElementById('g');
        let bError = document.getElementById('bError'), pError = document.getElementById('pError'), gError = document.getElementById('gError');

        if (b.checked === false) { invalidChoice(bError); return false; }

        else if (p.checked === false) { invalidChoice(pError); return false; }
        else if (g.checked === false) { invalidChoice(gError); return false; }
        else {
            let val = Session.get('games');
            val = parseInt(val) * 2;

            if (val >= 100000) val = 100000;

            Session.set('games', val);
        }

        let thisLabel = document.getElementById('timesLabel');
        let req = document.getElementById('signInLink');
        if (!Meteor.userId()) {
            req.classList.remove('text-dark'); req.classList.add('infinite'); req.classList.add('text-danger');
            thisLabel.classList.remove('text-success'); thisLabel.classList.add('text-muted');

            setTimeout(() => {
                req.classList.add('text-dark'); req.classList.remove('infinite'); req.classList.remove('text-danger');
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-success');

            }, 250);
            return false;
        }

        else {
            thisLabel.classList.remove('text-success'); thisLabel.classList.add('text-muted');
            setTimeout(() => {
                thisLabel.classList.remove('text-muted'); thisLabel.classList.add('text-success');
            }, 250);
        }
    }
});
