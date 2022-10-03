import { Meteor } from "meteor/meteor";

Template.contact.rendered = () => { Session.set('showSuccess', 'false'); Session.set('showFail', 'false'); }

Template.contact.helpers({

    'displayEmail': () => {
        loadUsername(); return Session.get('getUsername');
    },

    'showSuccessMessage': () => {
        if (Session.get('showSuccess') === 'true') return true;
        return false;
    },

    'showFailMessage': () => {
        if (Session.get('showFail') === 'true') return true;
        return false;
    }

});

Template.contact.events({

    'submit #contact': (e) => {

        e.preventDefault();
        let email = e.target.email.value, message = e.target.message.value;
        let emailID = document.getElementById('email'), messageID = document.getElementById('message'),
            emailError = document.getElementById('emailError'), underMessage = document.getElementById('underMessage');

        if (isEmpty(email) && isEmpty(message)) { invalidMessage(emailID); invalidMessage(messageID); return false; }
        if (isEmpty(email)) { invalidMessage(emailID); return false; }
        if (isEmpty(message)) { invalidMessage(messageID); return false; }
        if (messageLength(message)) { invalidMessage(messageID); return false; }

        trimInput(email); trimInput(message);

        if (!isEmail(email)) { invalidMessage(emailError); return false; }
        else if (wrongText(message)) { invalidMessage(messageID); return false; }

        else {

            Meteor.call('sendMessage', email, message, (err) => {
                if (err) {
                    if (err.toString() === 'Error: [max]') {
                        underMessage.classList.remove('text-dark'); underMessage.classList.add('text-danger');
                        underMessage.innerHTML = '<b>You cannot send more than 15 Messages in one day</b>'
                    }
                    else { invalidMessage(emailID); invalidMessage(messageID); }
                    Session.set('showFail', 'true');
                } else {
                    if (!Meteor.userId()) {
                        e.target.email.value = '';
                        e.target.message.value = '';
                    } else {
                        e.target.message.value = '';
                    }
                    Session.set('showSuccess', 'true');
                }
            });
        }
        return false;
    },

    'keypress #message': () => { getMaxLength(); },

    'keyup #message': () => { getMaxLength(); }

});

getMaxLength = () => {

    let num = document.getElementById('counter');
    let value = document.getElementById('message').value;

    let underMessage = document.getElementById('underMessage');
    Session.set('showSuccess', 'false'); Session.set('showFail', 'false');
    underMessage.classList.remove('text-danger'); underMessage.classList.add('text-dark');
    underMessage.innerHTML = '<b>Only allow a-z A-Z 0-9 and , . \' ! ? (10 - 160 letters)</b>';

    num.innerHTML = value.length;

    let txt = '';
    if (value.length > 300) {

        for (let i = 0; i < 300; i++) {
            txt += value.charAt(i);
        }

        document.getElementById('message').value = txt;
        invalidMessage(document.getElementById('message'));
    }
}

messageLength = (input) => {
    if (input.length > 300) return true;
    else if (input.length < 10) return true;
    else return false;
}

wrongText = (text) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "'",
        '.', ',', '?', '%', ' ', '\n'];

    let err = 'none';
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < aplhabet.length; j++) {
            if (text.charAt(i) === aplhabet[j]) { break; }
            else if (j === (aplhabet.length - 1)) { err = 'found'; break; }
        }
        if (err.toString() === 'found') { break; }
    }

    if (err.toString() === 'found') return true;
    else return false;
}
