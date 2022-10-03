
Template.deposit.rendered = () => {
    
    Session.set('copy', 'false');
    Session.set('address', 'false');
    loadBTCAddress();
    executeTwice();
    Session.set('checkService', 'false');
}

Template.deposit.helpers({

    'showTick': () => {
        if (Session.get('copy') === 'true') return true;
        return false;
    },

    'loadAddress': () => {
        if (Session.get('address') === 'false') return 'Network Connection...';
        else if (Session.get('address') === 'none') return 'Loading...';
        return Session.get('address');
    },

    'checkService': () => {
        if (Session.get('checkService') === 'true') { return true; }
        return false;
    },

});

Template.deposit.events({

    'click #copyAddress': () => {

        document.getElementById('copyAddressValue').select();
        document.execCommand('copy');

        if (Session.get('address') !== 'false') {
            Session.set('copy', 'true');
            setTimeout(() => { Session.set('copy', 'false'); },
                5000);
        }
    },

    'click #copyAddressValue': () => {

        document.getElementById('copyAddressValue').select();
        document.execCommand('copy');

        if (Session.get('address') !== 'false') {
            Session.set('copy', 'true');
            setTimeout(() => { Session.set('copy', 'false'); },
                5000);
        }
    },

    'click #checkNetwork': () => { loadBTCAddress(); }
});

loadBTCAddress = () => {

    if (Meteor.userId()) {
        Meteor.call('loadBtcAddress', Meteor.userId(), (err, res) => {
            if (err) {
                Session.set('address', 'false');
                if (err.toString() === 'Error: [gone]') {
                    Session.set('checkService', 'true');
                }
            }
            else { Session.set('address', res); Session.set('checkService', 'false'); }
        });
    }
}

executeTwice = () => {

    if (Session.get('address') === 'false') {
        let x = setInterval(() => {
            if ((Session.get('address') !== 'none') && (Session.get('address') !== 'false')) {
                clearInterval(x);
            } else { loadBTCAddress(); }
        }, 2000);
    }
}
