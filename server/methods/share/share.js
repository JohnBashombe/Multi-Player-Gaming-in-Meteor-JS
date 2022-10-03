
Meteor.methods({

    'loadUserCode': (userId) => {

        if (isEmpty(userId)) throw new Meteor.Error('error');
        trimInputID(userId);

        let userVerifier = 'none';
        Meteor.users.find({ _id: userId }).map((doc) => {
            if (userId.toString() === doc._id) userVerifier = 'exist';
        });

        let userCode = 'Loading';
        let countSubject = 0;
        let arrayData = [];

        if (userVerifier.toString() === 'none') throw new Meteor.Error('error');

        else if (userVerifier.toString() === 'exist') {

            UserDetails.find({ 'userId': userId }).map((doc) => {
                userCode = doc.referralCode;
            });


            UserDetails.find({ 'hostId': userId }).map(() => {
                countSubject++;
            });


            arrayData[0] = userCode;
            arrayData[1] = countSubject;
        }

        // console.log('User Info: ' + arrayData);

        return arrayData;
    }
});