// import { Meteor } from "meteor/meteor";

// Meteor.methods({

//     'enoughBalance': (userId) => {

//         if (isEmpty(userId)) {
//             throw new Meteor.Error('error');
//         }
//         trimInput(userId);

//         let balance = 0;
//         let isValid = 'none';

//         UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {

//             if(userId.toString() === doc.userId){
//                 isValid = 'exist';
//                 balance = doc.balance;
//             }
//         });

//         if(isValid.toString() === 'none'){
//             throw new Meteor.Error('error');
//         }

//         else if(isValid.toString() === 'exist'){

//             if(parseFloat(balance) > 0){
//                 return true;
//             }else{
//                 throw new Meteor.Error('error');
//             }

//         }

//     }

// });