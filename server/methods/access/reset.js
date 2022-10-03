
Meteor.methods({
    'reset': (email) => {
        reset(email);
    }
});

reset = (email) => {

    if (isEmpty(email)) throw new Meteor.Error('error');
    email = trimInputEmail(email);
 
    if (!isEmail(email)) throw new Meteor.Error('error');
    else {

        let valid = 'none'; let thisUserId = '';

        Meteor.users.find({}).map((doc) => {
            if (email.toString() === doc.emails[0].address) {
                valid = 'valid';
                thisUserId = doc._id;
                // console.log('The real id is: ' + doc._id);
            }
        });

        // console.log('User Id: ' + thisUserId);


        if (valid.toString() === 'none') throw new Meteor.Error('none');

        else if (valid.toString() === 'valid') {

            let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
            let todayDate = month + '/' + day + '/' + year;

            // Generate the random code and add it to the user account
            let code = '';
            for (let i = 0; i < 6; i++) { code = code + Math.round(Math.random() * 9); }
            // Get the amount of time the user has request the password reset
            let currentDate = UserDetails.findOne({ 'userId': thisUserId }).todayDate;
            // console.log('Old date from DB: ' + currentDate + ' New date from Code: ' + todayDate);
            if (currentDate.toString() !== todayDate.toString()) {
                // console.log('Old date is: ' + currentDate + ' and new date is: ' + todayDate);
                UserDetails.update({ 'userId': thisUserId }, {
                    $set: { 'maxEmailPerDay': 0, 'todayDate': todayDate, 'maxCodeAttempt': 0, 'confirmCode': 'none' }
                });
            }

            let max = UserDetails.findOne({ 'userId': thisUserId }).maxEmailPerDay;
            let maxTrying = UserDetails.findOne({ 'userId': thisUserId }).maxCodeAttempt;

            // console.log('The code is: ' + code);
            // console.log('Max daily emails: ' + max);
            // console.log('Max daily attempts: ' + maxTrying);
            // console.log('Email Address is: ' + email);
            // console.log('The today date is: ' + UserDetails.findOne({ 'userId': thisUserId }).todayDate);

            if ((parseInt(max) <= 2) && (parseInt(maxTrying) <= 9)) {

                UserDetails.update({ 'userId': thisUserId },
                    {
                        $inc: { 'maxEmailPerDay': +1 },
                        $set: { 'confirmCode': code }
                    }
                    , (err) => {
                        if (err) throw new Meteor.Error('error');
                        else {
                            // send the reset email to user with this current email address
                            // console.log('The code sent to user: ' + email + ' is ' + code);
                            customEmailReset(email, code);
                        }
                    });
            }

            else throw new Meteor.Error('max');
        }
        else throw new Meteor.Error('error');
    }
}
