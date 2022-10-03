
Session.set('showUpdated', 'false');

Template.settings.helpers({
    'showUpdated': () => {
        if (Session.get('showUpdated').toString() === 'true') {
            return true;
        }
        return false;
    }
});

Template.settings.events({

    'submit #change': (e) => {
        e.preventDefault();

        let oldPassword = e.target.oldPassword.value;
        let newPassword = e.target.newPassword.value;
        let confirmNewPassword = e.target.confirmNewPassword.value;

        let old = document.getElementById('oldPassword');
        let newPass = document.getElementById('newPassword');
        let confirmNewPass = document.getElementById('confirmNewPassword');

        let errorOldPassword = document.getElementById('errorOldPassword');
        let errorNewPassword = document.getElementById('errorNewPassword');
        let errorConfirmNewPassword = document.getElementById('errorConfirmNewPassword');

        if (isEmpty(oldPassword) && isEmpty(newPassword) && isEmpty(confirmNewPassword)) {
            invalidMessage(old); invalidMessage(newPass); invalidMessage(confirmNewPass);
            return false;
        }

        if (isEmpty(oldPassword)) { invalidMessage(old); return false; }
        if (isEmpty(newPassword)) { invalidMessage(newPass); return false; }
        if (isEmpty(confirmNewPassword)) { invalidMessage(confirmNewPass); return false; }

        if (maxPasswordLength(oldPassword)) { invalidMessage(old); return false; }
        if (maxPasswordLength(newPassword)) { invalidMessage(newPass); return false; }
        if (maxPasswordLength(confirmNewPassword)) { invalidMessage(confirmNewPass); return false; }

        if (isNotPassword(oldPassword)) { invalidMessage(old); return false; }
        if (isNotPassword(newPassword)) { invalidMessage(newPass); return false; }
        if (isNotPassword(confirmNewPassword)) { invalidMessage(confirmNewPass); return false; }

        if (!Meteor.userId()) { return false; }

        if (newPassword !== confirmNewPassword) {
            invalidMessage(newPass); invalidMessage(confirmNewPass);
            return false;
        }

        else {

            trimInput(oldPassword); trimInput(newPassword);
            if (Meteor.userId()) {
                Meteor.call('updateUserPassword', Meteor.userId(), oldPassword, newPassword, (err) => {

                    if (err) {
                        if (err.toString() === 'Error: [wrong]') {
                            wrongOld(errorOldPassword);
                        } else {
                            wrongUpdate(errorOldPassword);
                            wrongUpdate(errorNewPassword);
                            wrongUpdate(errorConfirmNewPassword);
                        }
                    } else {
                        Session.set('showUpdated', 'true');

                        setTimeout(() => {
                            Session.set('showUpdated', 'false');
                            Router.go('/login');
                        }, 5000);

                        // e.target.oldPassword.value = '';
                        // e.target.newPassword.value = '';
                        // e.target.confirmNewPassword.value = '';
                    }

                });
            }
        }
        return false;
    },

    'keypress #oldPassword': () => {
        document.getElementById('errorOldPassword').classList.remove('hide');
        document.getElementById('errorNewPassword').classList.remove('hide');
        document.getElementById('errorConfirmNewPassword').classList.remove('hide');
    },
    'keypress #newPassword': () => {
        document.getElementById('errorOldPassword').classList.remove('hide');
        document.getElementById('errorNewPassword').classList.remove('hide');
        document.getElementById('errorConfirmNewPassword').classList.remove('hide');
    },
    'keypress #confirmNewPassword': () => {
        document.getElementById('errorOldPassword').classList.remove('hide');
        document.getElementById('errorNewPassword').classList.remove('hide');
        document.getElementById('errorConfirmNewPassword').classList.remove('hide');
    },
});