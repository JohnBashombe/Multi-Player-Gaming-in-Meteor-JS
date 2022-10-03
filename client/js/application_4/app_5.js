
Session.set('ShareCode', 0);
Session.set('codeSubject', 0);

Template.share.rendered = () => {
    loadShareCode();
}

Template.share.helpers({
    'loadCode': () => {
        if (Session.get('ShareCode') === 0) { return 'Loading...'; }
        else { return Session.get('ShareCode'); }
    },

    'codeSubject': () => { return Session.get('codeSubject'); }
});

loadShareCode = () => {
    if (Meteor.userId()) {
        Meteor.call('loadUserCode', Meteor.userId(), (err, res) => {
            if (err) { Session.set('ShareCode', 0); }
            else {
                // console.log('results are: ' + res);
                Session.set('ShareCode', res[0]);
                Session.set('codeSubject', res[1]);
            }
        });
    }
}