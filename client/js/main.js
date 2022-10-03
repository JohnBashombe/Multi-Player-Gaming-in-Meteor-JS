
Session.set('email', '');

Template.signup.events({

    'submit #signup': (e) => {

        e.preventDefault();
        let email = e.target.email.value, password = e.target.password.value,
            referral = e.target.referral.value, terms = document.getElementById('terms'),
            emailError = document.getElementById('errorEmail'),
            passwordError = document.getElementById('errorPassword'),
            termsError = document.getElementById('errorTerms');

        let emailId = document.getElementById('email');
        let passId = document.getElementById('password');
        let referId = document.getElementById('referral');

        email = trimInput(email); password = trimInput(password); referral = trimInput(referral);

        if (isEmpty(email) && isEmpty(password)) { invalidMessage(emailId); invalidMessage(passId); return false; }
        else if (isEmpty(email)) { invalidMessage(emailId); return false; }
        else if (isEmpty(password)) { invalidMessage(passId); return false; }
        else if (maxPasswordLength(password)) { invalidMessage(passId); return false; }
        else if (isInvalidName(referral)) { invalidMessage(referId); return false; }
        else if (!referralLength(referral)) { invalidMessage(referId); return false; }
        else if (terms.checked === false) { invalidTerms(termsError); return false; }

        if (isNotPassword(password)) { invalidPassword(passwordError); return false; }
        if (!isEmail(email)) { invalidEmail(emailError); return false; }

        else {
            Meteor.call('addUser', email, password, referral, (err) => {
                if (err) {
                    if (err.toString() === 'Error: Email already exists. [403]') emailTaken(emailError);
                    else createAccount(emailError, passwordError);
                }
                else {
                    Meteor.loginWithPassword(email, password, (err) => {
                        if (err) invalidLogin(emailError, passwordError);
                        else document.location.reload(true);
                    });
                }
            });
        }
    },

    'keypress #email': () => { document.getElementById('errorEmail').classList.add('hide'); document.getElementById('errorTerms').classList.add('hide'); },
    'keypress #password': () => { document.getElementById('errorPassword').classList.add('hide'); document.getElementById('errorTerms').classList.add('hide'); },
    'click #terms': () => { document.getElementById('errorTerms').classList.add('hide'); },
    'keyup #referral': () => {

        // alert('Writing the code');
        let r = document.getElementById('referral');
        let referral = document.getElementById('referral').value;

        let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let hasAlphabet = 0;
        // alert('The code is: ' + referral);
        // check if the first three are alphabets then add a hyphen
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < aplhabet.length; j++) {
                if (referral.charAt(i) === aplhabet[j]) { hasAlphabet++; }
            }
        }
        // check if we are on the third item to add a hyphen
        if ((hasAlphabet === 3) && (referral.length === 3)) { r.value = referral + '-'; }
    }
});

Template.login.events({

    'submit #login': (e) => {

        e.preventDefault();
        let email = e.target.email.value, password = e.target.password.value;
        let emailError = document.getElementById('errorEmail'), passwordError = document.getElementById('errorPassword');
        email = trimInput(email); password = trimInput(password);

        let emailId = document.getElementById('email'), passId = document.getElementById('password');

        if (isEmpty(email) && isEmpty(password)) {
            invalidMessage(emailId);
            invalidMessage(passId);
            return false;
        }
        else if (isEmpty(email)) { invalidMessage(emailId); return false; }
        else if (isEmpty(password)) { invalidMessage(passId); return false; }
        else if (maxPasswordLength(password)) { invalidMessage(passId); return false; }

        if (!isEmail(email)) { invalidEmail(emailError); return false; }
        else {
            Meteor.loginWithPassword(email, password, (err) => {
                if (err) invalidLogin(emailError, passwordError);
                else document.location.reload(true);
            });
        }
    },

    'keypress #email': () => { document.getElementById('errorEmail').classList.add('hide'); },
    'keypress #password': () => { document.getElementById('errorPassword').classList.add('hide'); }

});

Template.sidebar.events({

    'click #logout': () => {

        // let sidebar = document.getElementById('sidenav'), overlay = document.getElementById('woh-overlay');
        Meteor.logout((err) => {
            if (err) { }
            else {
                let sidenav = document.getElementById("sidenav"), overlay = document.getElementById("woh-overlay");
                sidenav.style.display = "none"; overlay.style.display = "none";
                document.location.reload(true);
            }
        });
        // Session.set('inChallenge', 'false');
    }
});

Template.login.rendered = () => { if (Meteor.userId()) { Router.go('/'); } Session.set('email', ''); }

Template.signup.rendered = () => { if (Meteor.userId()) { Router.go('/'); } Session.set('email', ''); }

Template.reset.events({

    'submit #reset': (e) => {
        e.preventDefault();
        let email = e.target.email.value;
        let emailError = document.getElementById('errorEmail');
        email = trimInput(email);
        let emailId = document.getElementById('email');

        if (isEmpty(email)) { invalidMessage(emailId); return false; }
        if (!isEmail(email)) { invalidEmail(emailError); return false; }

        else {
            Meteor.call('reset', email, (err) => {
                if (err) {
                    if (err.toString() === 'Error: [none]') { unfoundEmail(emailError); }
                    else if (err.toString() === 'Error: [max]') maximumAttempt(emailError);
                    else { invalidEmail(emailError); }
                }
                else { Session.set('email', email); Router.go('/update'); }
            });
        }
    },

    'keypress #email': () => { document.getElementById('errorEmail').classList.add('hide'); },

});

Template.update.helpers({
    'loadEmail': () => {
        if (Session.get('email').toString() === '') { return 'Invalid Email'; }
        else { return Session.get('email'); }
    }
});

Template.update.events({

    'submit #update': (e) => {

        e.preventDefault();
        let password = e.target.password.value, confirm_password = e.target.confirm_password.value,
            code = e.target.code.value;

        let passwordError = document.getElementById('errorPassword'),
            confirmError = document.getElementById('errorConfirm'),
            errorCode = document.getElementById('errorCode');

        password = trimInput(password); confirm_password = trimInput(confirm_password); code = trimInput(code);

        let passId = document.getElementById('password'),
            ConfirmId = document.getElementById('confirm_password'),
            codeId = document.getElementById('code');

        if (isEmpty(password) && isEmpty(confirm_password) && isEmpty(code)) {
            invalidMessage(passId); invalidMessage(ConfirmId); invalidMessage(codeId);
            return false;
        }
        if (isEmpty(password)) { invalidMessage(passId); return false; }
        if (isEmpty(code)) { invalidMessage(codeId); return false; }
        if (codeLength(code)) { invalidMessage(codeId); return false; }
        if (!checkNumber(code)) { invalidMessage(codeId); return false; }
        if (maxPasswordLength(password)) { invalidMessage(passId); return false; }
        if (maxPasswordLength(confirm_password)) { invalidMessage(ConfirmId); return false; }
        if (isEmpty(confirm_password)) { invalidMessage(ConfirmId); return false; }
        if (isNotPassword(password)) { invalidPassword(passwordError); return false; }
        if (isNotPassword(confirm_password)) { invalidPassword(confirmError); return false; }
        if (notPasswordMatch(password, confirm_password)) { notMatch(confirmError); return false; }
        else {
            Meteor.call('updatePassword', Session.get('email'), password, code, (err) => {
                if (err) {
                    if (err.toString() === 'Error: [wrong]') { invalidCode(errorCode); }
                    else if (err.toString() === 'Error: [max]') { maximumAttempt(errorCode); setTimeout(() => { Router.go('/reset'); }, 3000); }
                    else { invalidDetails(errorCode); invalidDetails(passwordError); invalidDetails(confirmError); }
                }
                else {
                    Meteor.loginWithPassword(Session.get('email'), password, (err) => {
                        if (err) { invalidDetails(errorCode); invalidDetails(passwordError); invalidDetails(confirmError); }
                        else Router.go('/');
                    });
                }
            });
        }
    },

    'keypress #code': (evt) => {
        let code = document.getElementById('code');
        let charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)) { invalidMessage(code); return false; }
        return true;
    },

    'keypress #code': () => {
        document.getElementById('errorConfirm').classList.add('hide');
        document.getElementById('errorPassword').classList.add('hide');
        document.getElementById('errorCode').classList.add('hide');
    },
    'keypress #password': () => {
        document.getElementById('errorConfirm').classList.add('hide');
        document.getElementById('errorPassword').classList.add('hide');
        document.getElementById('errorCode').classList.add('hide');
    },

    'keypress #confirm_password': () => {
        document.getElementById('errorConfirm').classList.add('hide');
        document.getElementById('errorPassword').classList.add('hide');
        document.getElementById('errorCode').classList.add('hide');
    },

});

Template.update.rendered = () => {
    if (Session.get('email').toString() === '') { Router.go('/reset'); }
    if (Meteor.userId()) { Router.go('/'); }
}

Template.reset.rendered = () => { Session.set('email', ''); if (Meteor.userId()) Router.go('/'); }
