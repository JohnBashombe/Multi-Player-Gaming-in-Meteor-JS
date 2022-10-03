import { Meteor } from "meteor/meteor";

Session.set('quick', 'true');
Template.home.rendered = () => {
    emptyStats();
}

Template.home.helpers({

    'loadStats': () => {
        Meteor.call('loadStats', (err, res) => {

            if (err) emptyStats();

            else {
                Session.set('bpg', Math.round(res[0]));
                Session.set('bgp', Math.round(res[1]));
                Session.set('pbg', Math.round(res[2]));
                Session.set('pgb', Math.round(res[3]));
                Session.set('gbp', Math.round(res[4]));
                Session.set('gpb', Math.round(res[5]));
                Session.set('bpgLost', Math.round(res[6]));
                Session.set('bgpLost', Math.round(res[7]));
                Session.set('pbgLost', Math.round(res[8]));
                Session.set('pgbLost', Math.round(res[9]));
                Session.set('gbpLost', Math.round(res[10]));
                Session.set('gpbLost', Math.round(res[11]));
            }
        });
    },

    'loadBPG': () => {
        if (Session.get('bpg') === 0) { return '00'; }
        else if (Session.get('bpg') < 10) { return '0' + Session.get('bpg'); }
        return Session.get('bpg');
    },

    'loadBGP': () => {
        if (Session.get('bgp') === 0) {
            return '00';
        }
        else if (Session.get('bgp') < 10) {
            return '0' + Session.get('bgp');
        }
        return Session.get('bgp');
    },

    'loadPBG': () => {
        if (Session.get('pbg') === 0) {
            return '00';
        }
        else if (Session.get('pbg') < 10) {
            return '0' + Session.get('pbg');
        }
        return Session.get('pbg');
    },

    'loadPGB': () => {
        if (Session.get('pgb') === 0) {
            return '00';
        }
        else if (Session.get('pgb') < 10) {
            return '0' + Session.get('pgb');
        }
        return Session.get('pgb');
    },

    'loadGBP': () => {
        if (Session.get('gbp') === 0) {
            return '00';
        }
        else if (Session.get('gbp') < 10) {
            return '0' + Session.get('gbp');
        }
        return Session.get('gbp');
    },

    'loadGPB': () => {
        if (Session.get('gpb') === 0) {
            return '00';
        }
        else if (Session.get('gpb') < 10) {
            return '0' + Session.get('gpb');
        }
        return Session.get('gpb');
    },

    'loadBPGLost': () => {
        if (Session.get('bpgLost') === 0) {
            return '00';
        }
        else if (Session.get('bpgLost') < 10) {
            return '0' + Session.get('bpgLost');
        }
        return Session.get('bpgLost');
    },

    'loadBGPLost': () => {
        if (Session.get('bgpLost') === 0) {
            return '00';
        }
        else if (Session.get('bgpLost') < 10) {
            return '0' + Session.get('bgpLost');
        }
        return Session.get('bgpLost');
    },

    'loadPBGLost': () => {
        if (Session.get('pbgLost') === 0) {
            return '00';
        }
        else if (Session.get('pbgLost') < 10) {
            return '0' + Session.get('pbgLost');
        }
        return Session.get('pbgLost');
    },

    'loadPGBLost': () => {
        if (Session.get('pgbLost') === 0) {
            return '00';
        }
        else if (Session.get('pgbLost') < 10) {
            return '0' + Session.get('pgbLost');
        }

        return Session.get('pgbLost');
    },

    'loadGBPLost': () => {
        if (Session.get('gbpLost') === 0) {
            return '00';
        }

        else if (Session.get('gbpLost') < 10) {
            return '0' + Session.get('gbpLost');
        }

        return Session.get('gbpLost');
    },

    'loadGPBLost': () => {
        if (Session.get('gpbLost') === 0) {
            return '00';
        }

        else if (Session.get('gpbLost') < 10) {
            return '0' + Session.get('gpbLost');
        }

        return Session.get('gpbLost');
    },

    'quickhelp': () => {
        if (Session.get('quick') === 'false') {
            return false;
        }
        return true;
    },

    'quickHelpMode': () => {

        let label = 'Loading...';
        let choice = Session.get('gamePick');

        if (choice === 'b') {
            label = 'BLUE';
        }
        else if (choice === 'p') {
            label = 'PURPLE';
        }
        else if (choice === 'g') {
            label = 'GREEN';
        }
        return label;
    },

    'nextChoice': () => {

        let nextChoice = 'Loading...';
        let choice = Session.get('gamePick');

        if (choice === 'b') {
            nextChoice = 'GREEN (2) ? OR PURPLE (2) ?';
        }
        else if (choice === 'p') {
            nextChoice = 'BLUE (2) ? OR GREEN (2) ?';
        }
        else if (choice === 'g') {
            nextChoice = 'BLUE (2) ? OR PURPLE (2) ?';
        }

        return nextChoice;
    },

    'lastChoice': () => {

        let nextChoice = 'Loading...';
        let choice = Session.get('gamePick');

        if (choice === 'b') {
            nextChoice = 'GREEN (3) ? OR PURPLE (3) ?';
        }
        else if (choice === 'p') {
            nextChoice = 'BLUE (3) ? OR GREEN (3) ?';
        }
        else if (choice === 'g') {
            nextChoice = 'BLUE (3) ? OR PURPLE (3) ?';
        }

        return nextChoice;
    },
    'checkGame': () => {
        let choice = Session.get('gamePick');
        if (choice === 'b' || choice === 'g' || choice === 'p') {
            return true;
        }
        return false;
    },
});

Template.home.events({

    'click #show-quick-help': () => {

        Session.set('showStats', 'none');
        
        if (Session.get('quick') === 'false') {
            Session.set('quick', 'true');
        }

        else if (Session.get('quick') === 'true') {
            Session.set('quick', 'false');
        }
    },
    'click #close-quick-help': () => {
        Session.set('quick', 'false');
        Session.set('showStats', 'none');
    }
});

const emptyStats = () => {
    Session.set('bpg', 0); Session.set('bgp', 0);
    Session.set('pbg', 0); Session.set('pgb', 0);
    Session.set('gbp', 0); Session.set('gpb', 0);
    Session.set('bpgLost', 0); Session.set('bgpLost', 0);
    Session.set('pbgLost', 0); Session.set('pgbLost', 0);
    Session.set('gbpLost', 0); Session.set('gpbLost', 0);
}