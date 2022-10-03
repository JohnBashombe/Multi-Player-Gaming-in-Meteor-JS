Meteor.methods({

    'addUser': (email, password, referral) => {
        addNewUser(email, password, referral);
    }
});

addNewUser = (email, password, referral) => {

    if (isEmpty(email)) throw new Meteor.Error('error');
    if (isEmpty(password)) throw new Meteor.Error('error');
    if (maxPasswordLength(password)) throw new Meteor.Error('error');
    if (isNotPassword(password)) throw new Meteor.Error('error');

    email = trimInputEmail(email); password = trimInput(password); referral = trimInput(referral);

    if (isInvalidName(referral)) { throw new Meteor.Error('error'); }
    else if (!referralLength(referral)) { throw new Meteor.Error('error'); }
    else if (!isEmail(email)) { throw new Meteor.Error('error'); }

    else {

        let hostId = 'none'; let hostExist = 'none';

        if (!isEmpty(referral)) {
            UserDetails.find({ 'referralCode': referral }, { limit: 1 }).map((doc) => {
                hostId = doc.userId;
                hostExist = 'exist';
            });
        }

        if (hostExist.toString() === 'none') {
            hostId = 'none'
            // console.log('The host does not exist');
        }
        else if (hostExist.toString() === 'exist') {
            hostId = hostId;
            // console.log('The host Id is: ' + hostId); 
            // console.log('The host Email Address is: ' + Meteor.users.findOne({ _id: hostId }).emails[0].address);
        }
        else { hostId = 'none' }

        let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let letters = ''; let num = '';
        let verifier = true; let referralCode = ''; let verifyCode = 'none';

        while (verifier) {

            referralCode = ''; num = ''; letters = '';

            for (let i = 0; i < 3; i++) {
                letters = letters + aplhabet[Math.round(Math.random() * (aplhabet.length - 1))];
            }

            for (let i = 0; i < 5; i++) {
                num = num + numbers[Math.round(Math.random() * (numbers.length - 1))];
            }

            referralCode = letters + '-' + num;

            UserDetails.find({ 'referralCode': referralCode }, { limit: 1 }).map((doc) => {
                if (referralCode.toString() === doc.referralCode) {
                    verifyCode = 'exist';
                }
            },
                (err) => {
                    if (err) { throw new Meteor.Error('error'); }
                });

            if (verifyCode.toString() === 'exist') { verifier = true; }
            else if (verifyCode.toString() === 'none') { verifier = false; }
        }

        // console.log('The user referral code is: ' + referralCode);

        let addNewUser = Accounts.createUser({ email: email, password: password });

        let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
        let todayDate = month + '/' + day + '/' + year;

        UserDetails.insert({
            userId: addNewUser,     // Get the proper User ID
            balance: 0,             // Store the user Balance
            challengeBalance: 0,    // Store the Challenge Balance
            coupon: 0,              // Store the user coupon
            challengeId: 'none',    // Get the challenge Id
            challengeTeam: 'none',  // Get the Challenge Team of The user
            closeChallenge: 'false',// Contains the request if he has requested to close a challenge
            bonusCalc: 0,           // Calculate the user Bonus
            shareCalc: 0,           // Calaculate the user Share in Challenge
            confirmCode: 'none',    // Contains the confirm code for password reset
            maxEmailPerDay: 0,      // Count the Email a user can receive to reset the password
            todayDate: todayDate,   // Store the current date to count the daily emails
            maxCodeAttempt: 0,      // Calculate how many times the user has attempted to enter the code
            currentGame: [],        // Conatains all games played by the user
            remainGames: 0,         // Fix the max amount of Games for that user to Play for this particular Games
            gameToPlay: 'none',     // Get the current Game ID for the user to play
            choice1: '',            // Insert the first choice of the particular Game
            gameDate: todayDate,    // Get the old date and compare it with the new date to clean the gamePlayed[] array
            btcAddress: 'none',     // Get the BTC Address
            hostId: hostId,         // It contains the Id of the person who invites him on WOH
            referralCode: referralCode,  // It contains the sharing code of the current user
            lastChallengeId: 'none', // it stores the latest user challenge Id
            lastChallengeTeam: 'none', // it stores the latest user team
            lastChallengeWin: 0,    // it stores the latest challenge win
            lastChallengeShare: 0,  // it stores the latest challenge share
            amountWithdraw: 0,  // Amount to withdraw
            addressWithdraw: 'none',  // Address to withdraw
            // codeWithdraw: 'none',  // code to withdraw with from your gmail Account
            countcodeWithdraw: 0,  // counter for code withdraw attempt code to withdraw with from your gmail Account
            withdrawRight: 'allowed',  // Gives the user the right to withdraw
            withdrawRightDate: todayDate,  // Count the date on attempts
            withdrawPaymentStatus: 'none',     // Get the Current status of user Payement

        }, (err) => {
            if (err) throw new Meteor.Error('error');
        });
    }
}
