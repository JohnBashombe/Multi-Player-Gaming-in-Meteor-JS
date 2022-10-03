import { Meteor } from "meteor/meteor";

UserDetails = new Meteor.Collection('UserDetails');
Games = new Meteor.Collection('Games');
History = new Meteor.Collection('History');
HistorySetter = new Meteor.Collection('HistorySetter');
Challenges = new Meteor.Collection('Challenges');
ChallengeHistory = new Meteor.Collection('ChallengeHistory');
Contact = new Meteor.Collection('Contact');
Transaction = new Meteor.Collection('Transaction');

// Notifications = new Meteor.Collection('Notifications');
// Users = new Meteor.Collection('Users', Meteor.users);
// Users = new Meteor.Collection('Users');
// Users = Meteor.users
// // Users = Meteor.Collection('Users', Users);

// Users.find({}).map((doc) => {
//     console.log('Users are: ' + doc._id + ', email: ' + doc.emails[0].address);
// });