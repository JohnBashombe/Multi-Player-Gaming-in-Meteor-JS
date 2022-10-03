import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // we have to change and add our custom domain name for beatiful email address with headers set up
  process.env.MAIL_URL = 'smtp://postmaster%40ntavigwa.com:52cbda29bc1c146df076964f33b3c6ac-af6c0cec-749a0509@smtp.mailgun.org:587';

  // UserDetails.update({ 'userId': 'G6C6qxPt6G9RgPrxx' }, { $inc: { 'balance': + 0.015204 } }); // 120$ is 0.015204
  // console.log('User balance updated');

});

// getTrick = () => {

//   let random = Math.round(Math.random() * 11);
//   let choice1 = '';
//   let choice2 = '';
//   let choice3 = '';
//   let status = '';

//   if (random === 0) {
//     choice1 = 'b';
//     choice2 = 'p';
//     choice3 = 'g';
//     status = 'won';
//   }
//   else if (random === 1) {
//     choice1 = 'b';
//     choice2 = 'p';
//     choice3 = 'g';
//     status = 'lost';
//   }
//   else if (random === 2) {
//     choice1 = 'b';
//     choice2 = 'g';
//     choice3 = 'p';
//     status = 'won';
//   }
//   else if (random === 3) {
//     choice1 = 'b';
//     choice2 = 'g';
//     choice3 = 'p';
//     status = 'lost';
//   }

//   else if (random === 4) {
//     choice1 = 'p';
//     choice2 = 'b';
//     choice3 = 'g';
//     status = 'won';
//   }
//   else if (random === 5) {
//     choice1 = 'p';
//     choice2 = 'b';
//     choice3 = 'g';
//     status = 'lost';
//   }
//   else if (random === 6) {
//     choice1 = 'p';
//     choice2 = 'g';
//     choice3 = 'b';
//     status = 'won';
//   }
//   else if (random === 7) {
//     choice1 = 'p';
//     choice2 = 'g';
//     choice3 = 'b';
//     status = 'lost';
//   }
//   else if (random === 8) {
//     choice1 = 'g';
//     choice2 = 'b';
//     choice3 = 'p';
//     status = 'won';
//   }
//   else if (random === 9) {
//     choice1 = 'g';
//     choice2 = 'b';
//     choice3 = 'p';
//     status = 'lost';
//   }
//   else if (random === 10) {
//     choice1 = 'g';
//     choice2 = 'p';
//     choice3 = 'b';
//     status = 'won';
//   }
//   else if (random === 11) {
//     choice1 = 'g';
//     choice2 = 'p';
//     choice3 = 'b';
//     status = 'lost';
//   }


//   let year = new Date().getFullYear();
//   let month = new Date().getMonth() + 1;
//   let day = new Date().getDate();

//   let todayDate = month + '/' + day + '/' + year;
//   // Insert into the history for better statistics calculations
//   History.insert({
//     gameId: 'G6C6qxPt6G9RgPrxx',
//     setterId: 'sqEExExqmj7SkJfAc',
//     playerId: 'sqEExExqmj7SkJfAc',
//     games: 3,
//     choice1: choice1,
//     choice2: choice2,
//     choice3: choice3,
//     status: status,
//     amount: 0.000358,
//     profit: 0.000256,
//     challengeId: 'none',
//     challengeTeam: 'none',
//     priviledge: 'priviledge',
//     todayDate: todayDate,
//     createdAt: new Date(),
//   }, (err) => {
//     if (err) {
//       // console.log('an error occured');
//     }
//     else {
//       // console.log('Content successfully added')
//     }
//   });

// }

// Meteor.setInterval(() => {
//   getTrick();
// }, 600000);