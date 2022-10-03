import { Meteor } from "meteor/meteor";

Meteor.methods({

    'sendMessage': (email, message) => {
        receiveMessage(email, message);
    }

});

receiveMessage = (email, message) => {

    if (isEmpty(email)) throw new Meteor.Error('error');
    if (isEmpty(message)) throw new Meteor.Error('error');
    trimInput(email); trimInput(message);
    if (!isEmail(email)) throw new Meteor.Error('error');
    else if (wrongText(message)) throw new Meteor.Error('error');
    else if (messageLength(message)) throw new Meteor.Error('error');
    else {

        let year = new Date().getFullYear(); let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        let todayDate = month + '/' + day + '/' + year;
        let countMessage = Contact.find({ $and: [{ 'email': email, 'todayDate': todayDate }] }).count();

        if (countMessage < 10) {
            Contact.insert({
                email: email,
                message: message,
                todayDate: todayDate,
                createdAt: new Date()
            }, (err) => {
                if (err) throw new Meteor.Error('error');
            });
        } else throw new Meteor.Error('max');
    }
}