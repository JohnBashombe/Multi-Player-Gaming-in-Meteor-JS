
// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

// import './main.html';
// // import { Session } from 'inspector';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

// // Template.address.rendered = () => {
// //   createNewAddress();
// // }
// Session.set('info', 'none');

// Template.address.helpers({

//   'BTCaddress': () => {
//     // displayContent();
//     // createNewAddress();
//     createWallet();
//     // console.log('The address for this user is: ' + displayContent());

//     return Session.get('info');
//   }

// });

// displayContent = () => {

//   // let result = '';

//   // npm install crypto
//   var crypto = require('crypto');
//   // npm install request
//   var request = require('request');

//   // Set these in your ENVironment, or enter them here with the actual string
//   var apiKey = 'E3hvgS9oE5ITtcih';
//   var apiSecret = 'JRKD3oWyCNm5v57q2P0IS0Z9jQhdMbt3';


//   //get unix time in seconds
//   var timestamp = Math.floor(Date.now() / 1000);

//   // set the parameter for the request message
//   var req = {
//     method: 'GET',
//     path: '/v2/exchange-rates?currency=USD',
//     body: ''
//   };

//   var message = timestamp + req.method + req.path + req.body;
//   console.log(message);

//   //create a hexedecimal encoded SHA256 signature of the message
//   var signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");

//   //create the request options object
//   var options = {
//     baseUrl: 'https://api.coinbase.com/',
//     url: req.path,
//     method: req.method,
//     headers: {
//       'CB-ACCESS-SIGN': signature,
//       'CB-ACCESS-TIMESTAMP': timestamp,
//       'CB-ACCESS-KEY': apiKey,
//       'CB-VERSION': '2015-07-22'
//     }
//   };

//   request(options, function (err, response) {
//     if (err) console.log(err);
//     console.log(response.body);
//     // result = response.body;
//     Session.set('info', response.body);
//   });

//   // return result;

// }


// createWallet = () => {

//   // let result = '';

//   // npm install crypto
//   var crypto = require('crypto');
//   // npm install request
//   var request = require('request');

//   let Client = require('coinbase').Client;

//   // Set these in your ENVironment, or enter them here with the actual string
//   // const apiKey = 'E3hvgS9oE5ITtcih';
//   // const apiSecret = 'JRKD3oWyCNm5v57q2P0IS0Z9jQhdMbt3';

//   const apiKey = 'e7JVNoiWTuKGzKeR';
//   const apiSecret = 'bUvFLwE41iLPMRKImypIZNgkbZIevIDX';

//   //get unix time in seconds
//   var timestamp = Math.floor(Date.now() / 1000);
//   //fd891985-e186-5d73-bf9e-aff5932e5ccf
//   // // set the parameter for the request message
//   var req = {
//     method: 'GET',
//     path: '/v2/accounts/:fd891985-e186-5d73-bf9e-aff5932e5ccf/addresses',
//     body: ''
//   };

//   var message = timestamp + req.method + req.path + req.body;
//   // console.log(message);

//   //create a hexedecimal encoded SHA256 signature of the message
//   var signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");

//   //create the request options object
//   var options = {
//     baseUrl: 'https://api.coinbase.com/',
//     url: req.path,
//     method: req.method,
//     headers: {
//       'CB-ACCESS-SIGN': signature,
//       'CB-ACCESS-TIMESTAMP': timestamp,
//       'CB-ACCESS-KEY': apiKey,
//       'CB-VERSION': '2019-08-22'
//     }
//   };

//   request(options, function (err, response) {

//     console.log('The response is: ' + response.body);
//     console.log('The error is : ' + err);

//     let client = new Client({
//       'apiKey': apiKey,
//       'apiSecret': apiSecret
//     });

//     client.getAccount('fd891985-e186-5d73-bf9e-aff5932e5ccf', function (err, account) {

//       console.log("the account details are: " + account);

//       account.createAddress('fd891985-e186-5d73-bf9e-aff5932e5ccf', function (err, address) {
//         if (err) {
//           console.log('The error is : ' + err);
//         } else {
//           console.log('The address is: ' + address);
//           console.log('The address is: ' + address.address + ' and the address Id is: ' + address.id);
//         }
//       });
//     });

//     // console.log(response.body);
//     // // result = response.body;
//   });

//   // return result;

// }




// createNewAddress = () => {

//   const apiKey = 'E3hvgS9oE5ITtcih';
//   const apiSecret = 'JRKD3oWyCNm5v57q2P0IS0Z9jQhdMbt3';

//   // let id = '';

//   let Client = require('coinbase').Client;

//   let client = new Client({
//     'apiKey': apiKey,
//     'apiSecret': apiSecret
//   });

//   client.getAccount('fd891985-e186-5d73-bf9e-aff5932e5ccf', (err, account) => {

//     // id = account.id;

//     console.log('My primary Account ID is: ' + account.id);
//     console.log('My primary Account Name is: ' + account.name);
//     console.log('My primary Account Balance is: ' + account.balance.amount);
//     console.log('My primary Account Currency is: ' + account.balance.currency);
//     console.log('My primary Account in UGX is: ' + account.native_balance.amount);

//     if (err) {
//       console.log('The error is: ' + err);
//     }
//     else {

//       client.getAccount('fd891985-e186-5d73-bf9e-aff5932e5ccf', (err, account) => {

//         if (err) {
//           console.log('Error! ' + err);
//         }
//         else {
//           account.createAddress(null, (err, address) => {

//             if (err) {
//               console.log('The error is: ' + err);
//             }
//             else {
//               console.log('The address is: ' + address.address + ' and the address Id is: ' + address.id);
//             }
//             // console.log('The address name is: ' + address);
//           });
//         }
//       });
//     }
//   });

//   // console.log('The id is: ' + id);

//   // return id;

// }

// // createNewAddress();

