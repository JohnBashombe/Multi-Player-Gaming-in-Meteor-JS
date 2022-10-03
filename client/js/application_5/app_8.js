Template.withdraw.rendered = () => {
    Session.set('errorWithdraw', 'false'); Session.set('successWithdraw', 'false');
    Session.set('checkService', 'false'); Session.set('showWithdrawCode', 'false');
    Session.set('addressWithdraw', 'none'); Session.set('amountWithdraw', 0);
    Session.set('checkService', 'false'); Session.set('showMinimumAlert', 'false');
    Session.set('loadProcessing', 'false'); Session.set('completion', 'false');
    Session.set('limit', 0); loadWithdraw();
}

Template.withdraw.helpers({
    'balance': () => {
        if (!Meteor.userId()) return '0';
        if (Meteor.userId()) { loadBalanceInstantly(); loadRealBalance(); return Session.get('balance'); }
    },
    'errorWithdraw': () => { if (Session.get('errorWithdraw') === 'true') { return true; } return false; },
    'successWithdraw': () => { if (Session.get('successWithdraw') === 'true') { return true; } return false; },
    'amountWithdraw': () => Session.get('amountWithdraw'),
    'addressWithdraw': () => Session.get('addressWithdraw'),
    'dateWithdraw': () => Session.get('dateWithdraw'),
    'resendCode': () => { if (Session.get('resendCode') === 'true') { return true; } return false; },
    'loadProcessing': () => { if (Session.get('loadProcessing') === 'true') { return true; } return false; },
    'checkService': () => { if (Session.get('checkService') === 'true') { return true; } return false; },
    'showWithdrawCode': () => { if (Session.get('showWithdrawCode') === 'true') { return true; } return false; },
    'showMinimumAlert': () => { if (Session.get('showMinimumAlert') === 'true') { return true; } return false; },
    'addressWithdraw': () => Session.get('addressWithdraw'),
    'amountWithdraw': () => Session.get('amountWithdraw'),
    'minimum': () => {
        if (Meteor.userId()) {
            Meteor.call('loadLimit', (err, res) => {
                if (err) { Session.set('limit', 'calculating...') } else { Session.set('limit', res) }
            });
            return Session.get('limit');
        }
    },
});

Template.withdraw.events({

    'submit #withdraw': (e) => {
        // first step in withdrawing
        e.preventDefault();
        let address = e.target.address.value, amount = e.target.amount.value;
        const addr = document.getElementById('address'), value = document.getElementById('amount'),
            errorWithdraw = document.getElementById('errorWithdraw');
        // check if all these conditions are true
        if (!Meteor.userId()) { invalidMessage(addr); invalidMessage(value); return false; }
        else if (isEmpty(address) && isEmpty(amount)) { invalidMessage(addr); invalidMessage(value); return false; }
        else if (isEmpty(address)) { invalidMessage(addr); return false; }
        else if (isEmpty(amount)) { invalidMessage(value); return false; }
        else if (!checkFloat(amount)) { invalidMessage(value); return false; }
        else if (isInvalidAddress(address)) { invalidMessage(addr); return false; }
        else {
            trimInput(address); trimInput(amount);
            // alert('All conditions were checked');
            if ((amount) >= parseFloat(Session.get('limit'))) {
                // if the amount is greater than the minimum amount
                if ((parseFloat(Session.get('balance')) > 0) && (parseFloat(Session.get('balance')) >= amount)) {
                    // if the balance is greater than 0 and >= balance
                    Meteor.call('withdraw', Meteor.userId(), address, amount, (err) => {
                        if (err) {
                            if (err.toString() === 'Error: [max]') { errorWithdraw.innerHTML = '<b>Daily withdrawal attempts reached</b>'; }
                            if (err.toString() === 'Error: [gone]') { Session.set('checkService', 'true'); }
                            Session.set('errorWithdraw', 'true');
                            setTimeout(() => { errorWithdraw.innerHTML = ''; Session.set('errorWithdraw', 'false'); },
                                2000);
                            loadWithdraw();
                        } else {
                            // display the result
                            Session.set('showWithdrawCode', 'true');
                            e.target.address.value = ''; e.target.amount.value = '';
                            loadBalanceInstantly(); loadWithdraw();
                        }
                    });
                }
                else {
                    // show error
                    invalidMessage(value); return false;
                }
            }
            else {
                // show error
                Session.set('showMinimumAlert', 'true');
                setTimeout(() => { Session.set('showMinimumAlert', 'false'); },
                    1000);
            }
        }
    },
    // 'click #resendCode': () => {
    //     Session.set('resendCode', 'false');
    //     if (Meteor.userId()) {
    //         Meteor.call('resendCode', Meteor.userId(), (err) => {
    //             if (err) { Session.set('resendCode', 'false'); } else { Session.set('resendCode', 'true'); }
    //         });
    //     }
    // },
    'click #checkWithdraw': () => loadWithdraw(),
    // cancel the current transaction
    'click #cancel_transaction': () => {
        if (Meteor.userId()) {
            Meteor.call('cancelTransaction', Meteor.userId(), (err) => {
                if (err) { Session.set('showWithdrawCode', 'true'); }
                else {
                    loadBalanceInstantly(); Session.set('showWithdrawCode', 'false');
                    Session.set('addressWithdraw', 'none'); Session.set('amountWithdraw', 0);
                }
            });
        }
    },
    // display the current withdrawal process and complete the payment
    'click #sendBitcoin': () => {

        let passwordValue = document.getElementById('password').value,
            password = document.getElementById('password'), errorPassword = document.getElementById('errorPassword');
        if (!Meteor.userId()) { invalidMessage(password); return false; }
        if (isEmpty(passwordValue)) { invalidMessage(password); return false; }
        if (maxPasswordLength(passwordValue)) { invalidMessage(password); return false; }
        if (isNotPassword(passwordValue)) { invalidMessage(password); return false; }
        else {
            Session.set('loadProcessing', 'true'); Session.set('completion', 'true');
            Meteor.call('sendBitcoin', Meteor.userId(), passwordValue, (err) => {
                if (err) {
                    loadWithdraw();
                    if (err.toString() === 'Error: [max]') { errorPassword.innerHTML = '<b>Daily attempts reached</b>'; }
                    else if (err.toString() === 'Error: [gone]') { Session.set('checkService', 'true'); }
                    else if (err.toString() === 'Error: [wrong]') { errorPassword.innerHTML = '<b>Wrong Password</b>'; }
                    else if (err.toString() === 'Error: [not-allow]') { errorPassword.innerHTML = '<b>Some deposits are not completed. <br> Wait a moment please!.</b>'; }
                    else {
                        Session.set('errorWithdraw', 'true'); Session.set('showWithdrawCode', 'true');
                        Session.set('successWithdraw', 'false');
                        setTimeout(() => { Session.set('errorWithdraw', 'false'); },
                            1000);
                    }
                    Session.set('loadProcessing', 'false');
                } else {
                    loadWithdraw();
                    if (Session.get('completion') === 'true') {
                        let x = setInterval(() => {
                            loadWithdraw();
                            if (Session.get('completion') === 'false') {
                                clearInterval(x);
                                Session.set('loadProcessing', 'false');
                                // check after loading if the process has been completed
                                // if true, display a success message
                                if (Session.get('successWithdraw') === 'none') {
                                    Session.set('errorWithdraw', 'false');
                                    Session.set('showWithdrawCode', 'true');
                                    Session.set('successWithdraw', 'true');
                                    setTimeout(() => {
                                        loadWithdraw(); Session.set('amountWithdraw', 0);
                                        Session.set('successWithdraw', 'false'); Session.set('showWithdrawCode', 'false');
                                    }, 2500);
                                }
                                else {
                                    // another condition
                                    Session.set('errorWithdraw', 'true'); Session.set('showWithdrawCode', 'true');
                                    Session.set('successWithdraw', 'false');
                                    setTimeout(() => { Session.set('errorWithdraw', 'false'); }, 500);
                                }
                            }
                        }, 2000);
                        Session.set('showWithdrawCode', 'true'); Session.set('loadProcessing', 'true');
                    }
                }
                // load and update the balance
                loadBalanceInstantly();
            });
        }
        return false;
    },
    // delete the error message content on keypress
    'keyup #address': () => { document.getElementById('errorWithdraw').innerHTML = ''; },
    // delete the password error message content on keypress
    'keypress #password': () => { document.getElementById('errorPassword').innerHTML = ''; }
});
// load the current withdraw details if available
loadWithdraw = () => {
    if (Meteor.userId()) {
        Meteor.call('loadWithdraw', Meteor.userId(), (err, res) => {
            // display different types of errors
            if (err) {
                if (err.toString() === 'Error: [process]') { Session.set('showWithdrawCode', 'true'); Session.set('completion', 'true'); }
                else { Session.set('completion', 'false'); Session.set('showWithdrawCode', 'false'); }
            } else {
                // display the success message
                Session.set('completion', 'false'); Session.set('showWithdrawCode', 'true');
                Session.set('addressWithdraw', res[0]); Session.set('amountWithdraw', res[1]);
            }
        });
    }
}
