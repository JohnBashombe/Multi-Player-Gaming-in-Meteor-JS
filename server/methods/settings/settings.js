import { Meteor } from "meteor/meteor";

Meteor.methods({
    'updateUserPassword': (userId, oldPassword, newPassword) => {
        updateThisUser(userId, oldPassword, newPassword);
    }
});

updateThisUser = (userId, oldPassword, newPassword) => {

    if (isEmpty(oldPassword)) throw new Meteor.Error('error');
    if (isEmpty(newPassword)) throw new Meteor.Error('error');
    if (isEmpty(userId)) throw new Meteor.Error('error');
    if (maxPasswordLength(oldPassword)) throw new Meteor.Error('error');
    if (maxPasswordLength(newPassword)) throw new Meteor.Error('error');

    oldPassword = trimInput(oldPassword);
    newPassword = trimInput(newPassword);
    userId = trimInputID(userId);

    if (isNotPassword(oldPassword)) throw new Meteor.Error('error');
    if (isNotPassword(newPassword)) throw new Meteor.Error('error');

    let verify = 'none';

    UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
        if (userId.toString() === doc.userId) verify = 'exist';
    });

    if (verify.toString() === 'none') throw new Meteor.Error('error');
    else if (verify.toString() === 'exist') {

        let email = Meteor.users.findOne({ '_id': userId }).emails[0].address;
        let user = Accounts.findUserByEmail(email);
        let result = Accounts._checkPassword(user, oldPassword);

        if (result.error === undefined) {
            Accounts.setPassword(userId, newPassword);
        }
        else if (result.error.toString() === 'Error: Incorrect password [403]') throw new Meteor.Error('wrong');
        else throw new Meteor.Error('wrong');
    }
    else throw new Meteor.Error('error');
}