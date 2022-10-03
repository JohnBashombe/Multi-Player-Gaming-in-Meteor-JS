
customEmailReset = (email, code) => {

    let text = '';
    let year = new Date().getFullYear();
    let subject = 'Reset Password';

    // text = '<div style="padding-right: 15px; padding-left: 15px; margin-right: auto; margin-left: auto;">' +
    //     '<div style = "margin-right: -15px; margin-left: -15px; text-align: center;" >' +
    //     '<div style="width: 100%; padding-right: 15px; padding-left: 15px; max-width: 100%;">' +
    //     '<h1 style = "color: #000000; margin-bottom: .5rem; line-height: 1.2; font-size: 50px; font-weight: 500; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; margin-top: 3rem; text-align: center;" > ' +
    //     'NTAVIGWA </h1> </div>' +
    text =
        '<div style="width: 100%; padding-right: 15px; padding-left: 15px;  max-width: 100%;">' +
        '<h6 style = " margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 15px; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #000000;" >You have requested to reset your password' +
        '</h6> </div>' +
        '<div style = " width: 100%; padding-right: 15px; padding-left: 15px;  max-width: 100%; margin-top: 1rem; text-align: center;" >' +
        '<h4 style = " margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 15px; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #000000;" >' +
        '<b style=" font-weight: bolder;">Your code</b></h4>' +
        '<h1 style = " margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 30px; letter-spacing: 1px; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #000000;" >' +
        '<b>' + code + '</b> </h1> </div></div>' +
        '<div style = "width: 100%; padding-right: 15px; padding-left: 15px;  max-width: 100%; margin-top: 1rem; text-align: center;" >' +
        '<p style = " margin-top: 0; margin-bottom: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif;" >' +
        '<b style=" font-weight: bolder;"> Please! Ignore this message if it was not you. </b></p>' +
        '<p style = " margin-bottom: 1rem; margin-top: 3rem; text-align: center; color: #000000; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif;" >' +
        '<small style=" font-size: 12px; font-weight: 400;"> <b style=" font-weight: bolder;"> ntavigwa&copy;' + year + '. All rights reserved' +
        '</b> </small>' +
        '</p>' +
        '</div>' +
        '</div > ';

    Email.send({
        to: email,
        from: 'Ntavigwa@ntavigwa.com',
        subject: subject,
        html: text,
    });
}

// customEmailWithdraw = (email, code, amount, address, todayDate) => {

//     let subject = "Withdraw Request";
//     let text = '';
//     let year = new Date().getFullYear();

//     text = '<div style="width: 100%; padding-right: 15px; padding-left: 15px; margin-right: auto; margin-left: auto;">' +
//         '<div style="margin-right: -15px; margin-left: -15px; text-align: center;">' +
//         '<div style="width: 100%; padding-right: 15px; padding-left: 15px; max-width: 100%;">' +
//         '<h1 style = "color: #000000; margin-bottom: .5rem; line-height: 1.2; font-size: 50px; font-weight: 500; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; margin-top: 3rem; text-align: center;"> ' +
//         'War <span style="color: #007bff;"> of </span> half </h1></div>' +
//         '<div style="width: 100%; padding-right: 15px; padding-left: 15px; max-width: 100%; margin-top: 3rem;">' +
//         '<h2 style = "margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 2rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; padding-bottom: .5rem; text-align: left; color: #17a2b8;">  Withdraw Request </h2>' +
//         '<hr style = "height: 0; margin-top: 1rem; margin-bottom: 1rem; border: 0; border-top: 1px solid rgba(0, 0, 0, .1);"></div> ' +
//         '<div style="width: 100%; padding-right: 15px; padding-left: 15px;  max-width: 100%;">' +
//         '<h6 style = "margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #6c757d;"> You have requested to withdraw from your account </h6>' +
//         '<h6 style = " margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #6c757d;">' + amount + ' BTC</h6>' +
//         '<h6 style = " margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #6c757d;">' +
//         '<span style=" color: #343a40;"> <b style=" font-weight: bolder;"> On </b> </span> ' + todayDate + ' </h6>' +
//         '<h6 style = "margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #6c757d;">' +
//         '<span style=" color: #343a40;"> <b style=" font-weight: bolder;"> To </b> </span>' + address + '</h6></div>' +
//         '<div style = "width: 100%; padding-right: 15px; padding-left: 15px; max-width: 100%; margin-top: 1rem; text-align: center;">' +
//         '<h4 style = "margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 1.5rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #343a40;">' +
//         '<b style=" font-weight: bolder;">Use the code below</b></h4>' +
//         '<h1 style = "margin-top: 0; margin-bottom: .5rem; font-weight: 500; line-height: 1.2; font-size: 2.5rem; letter-spacing: 3px; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; color: #007bff;"><b>' + code + '</b></h1></div></div>' +
//         '<div style = "width: 100%; padding-right: 15px; padding-left: 15px;  max-width: 100%; margin-top: 1rem; text-align: center;">' +
//         '<p style = "margin-top: 0; margin-bottom: 1rem; font-family: \'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif;">' +
//         '<b style=" font-weight: bolder;"> If you did not request this,' +
//         '<a href="https://warofhalf.com/login" style = " cursor: pointer; color: #007bff; text-decoration: none; background-color: transparent;">' +
//         'Sign In Here</a> to change the password and cancel the transaction' +
//         '</b></p>' +
//         '<p style="margin-bottom: 1rem; margin-top: 3rem; text-align: center; color: #6c757d;">' +
//         '<small style="font-size: 80%; font-weight: 400;"> <b style=" font-weight: bolder;"> WAR OF HALF &copy; ' + year + '. All rights reserved' +
//         '</b></small>' +
//         '</p>' +
//         '</div>' +
//         '</div>';

//     Email.send({
//         to: email,
//         from: 'no-reply@warofhalf.com',
//         subject: subject,
//         html: text,
//     });

// }
