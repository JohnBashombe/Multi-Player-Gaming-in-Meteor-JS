import { Meteor } from "meteor/meteor";
import { Client } from '../coinbase/index.js';

Meteor.methods({

    'loadBtcAddress': (userId) => {
        return loadAddress(userId);
    },

    // 'checkService': () => {
    //     //check coinbase availability service
    //     // if the service is not available
    //     // throw new Meteor.Error('gone');
    //     throw new Meteor.Error('present');
    // }
});


loadAddress = (userId) => {

    if (isEmpty(userId)) throw new Meteor.Error('error');
    trimInputID(userId);

    let verify = 'none';

    UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
        if (userId.toString() === doc.userId) verify = 'exist';
    });

    const bound = Meteor.bindEnvironment((callback) => { callback(); });

    let address = '';

    const apiKey = apiKeyDeposit();
    const apiSecret = apiSecretKeyDeposit();
    let id = apiKeyIdDeposit();

    let client = new Client({
        'apiKey': apiKey,
        'apiSecret': apiSecret
    });

    if (verify.toString() === 'none') throw new Meteor.Error('error');
    else if (verify.toString() === 'exist') {

        UserDetails.find({ 'userId': userId }, { limit: 1 }).map((doc) => {
            address = doc.btcAddress;
        }, (err) => {
            if (err) throw new Meteor.Error('error');
        });

        if (address.toString() === 'none') {

            let i = 0; let value = 'none';

            client.getAccount(id, (err, account) => {

                bound(() => {

                    if (err) {
                        // console.log('The loading btc address error is: ' + err);
                    }

                    else {
                        account.createAddress(null, (err, result) => {

                            bound(() => {

                                if (err) {
                                    // console.log('The error while creating the address is: ' + err);
                                }

                                else {
                                    value = result.address;

                                    while (i < 1) {
                                        if (value.toString() === 'none') {
                                            i = 0;
                                        }
                                        else {
                                            i = 10;
                                            changeUserId(userId, value);
                                        }
                                    }
                                }
                            });
                        });
                    }
                });

            })
        }
    }

    else throw new Meteor.Error('error');

    return userBtcAddress(userId);
}

userBtcAddress = (userId) => {

    let address = UserDetails.findOne({ 'userId': userId }).btcAddress;
    return address;

}

changeUserId = (userId, newAddress) => {

    UserDetails.update({ 'userId': userId }, {
        $set: { 'btcAddress': newAddress }
    }, (err) => {
        if (err) {
            throw new Meteor.Error('error');
        }
    });
}


apiKeyDeposit = () => { return 'e7JVNoiWTuKGzKeR'; }

apiSecretKeyDeposit = () => { return 'bUvFLwE41iLPMRKImypIZNgkbZIevIDX'; }

apiKeyIdDeposit = () => { return 'fd891985-e186-5d73-bf9e-aff5932e5ccf'; }