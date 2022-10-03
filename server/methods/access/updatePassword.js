Meteor.methods({
    'updatePassword': (email, password, code) => {
        changePassword(email, password, code);
    }
});

changePassword = (email, password, code) => {
    // check all conditions and entries before processing
    if (isEmpty(email)) throw new Meteor.Error('error');
    if (isEmpty(password)) throw new Meteor.Error('error');
    if (isEmpty(code)) throw new Meteor.Error('error');
    if (!checkNumber(code)) throw new Meteor.Error('error');
    if (!codeLength(code)) throw new Meteor.Error('error');
    if (maxPasswordLength(password)) throw new Meteor.Error('error');
    // remove unecessary strings from the input
    email = trimInputEmail(email); password = trimInput(password);
    code = trimInput(code);

    if (isNotPassword(password)) throw new Meteor.Error('error');
    if (!isEmail(email)) throw new Meteor.Error('error');

    else {
        // we check first if the user exists
        let valid = 'none';
        let thisUserId = 'none';

        Meteor.users.find({}).map((doc) => {
            if (email.toString() === doc.emails[0].address) {
                valid = 'valid';
                thisUserId = doc._id;
                // console.log('The email address is: ' + doc.emails[0].address);
            }
        });

        if (valid.toString() === 'none') throw new Meteor.Error('error');
        else if (valid.toString() === 'valid') {
            // fetch the max attempt to validate the user for password change
            let maxAttempt = 0;
            let userCode = 'none';
            let max = 0;

            UserDetails.find({ 'userId': thisUserId }, { limit: 1 }).map((doc) => {
                maxAttempt = doc.maxCodeAttempt;
                userCode = doc.confirmCode;
                max = doc.maxEmailPerDay;
            });

            // console.log('User New code: ' + code);
            // console.log('User old code: ' + userCode);

            if ((parseInt(max) <= 3) && (parseInt(maxAttempt) <= 9)) {

                if (userCode.toString() === code.toString()) {
                    // Update the User Password
                    Accounts.setPassword(thisUserId, password);
                    UserDetails.update({ 'userId': thisUserId }, {
                        $set: { 'confirmCode': 'none' }, $inc: { 'maxCodeAttempt': +1 }
                    });
                }
                else {

                    UserDetails.update({ 'userId': thisUserId },
                        { $inc: { 'maxCodeAttempt': +1 } }
                        , (err) => {
                            if (err) throw new Meteor.Error('error');
                        });
                    throw new Meteor.Error('wrong');
                }
            }
            else throw new Meteor.Error('max');
        }
        else throw new Meteor.Error('error');
    }
}
