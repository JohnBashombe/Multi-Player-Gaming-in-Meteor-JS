isEmpty = (e) => { if (e === '' || e === null || e === undefined || e === NaN) { return true; } return false; }
isNotPassword = (e) => { if (e.toString().length < 6) { return true; } return false; }
trimInput = (x) => { return x.replace(/^\s*|\s*$/g, ""); }
isEmail = (x) => { const regx = /^([a-zA-Z0-9\.\-]+)@([a-zA-Z0-9\-]+)\.([a-zA-Z]+)(.[a-zA-Z]+)?$/; if (regx.test(x)) { return true; } return false; }
EmptyEmailPassword = (x, y) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Email Address cannot be Empty</b>'; y.classList.remove('hide', 'text-danger'); y.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Password cannot be Empty</b>'; }
EmptyEmail = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle"></i> Email Address cannot be Empty</b>'; }
EmptyPassword = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle"></i> Password cannot be Empty</b>'; }
invalidEmail = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Invalid Email Address</b>'; }
wrongOld = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Wrong Password </b>'; }
wrongUpdate = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Process Failed </b>'; }
invalidLogin = (x, y) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Wrong Credentials </b>'; y.classList.remove('hide', 'text-danger'); y.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Wrong Credentials </b>'; }
invalidDetails = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> An Error occured </b>'; }
createAccount = (x, y) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> This Email Address is taken </b>'; y.classList.remove('hide', 'text-danger'); y.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Failed to set Password </b>'; }
emailTaken = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Sorry! This Email Address is taken </b>'; }
invalidPassword = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Password should be greater than 6 </b>'; }
invalidTerms = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> You must accept our Conditions of Use </b>'; }
unfoundEmail = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Unfound email address </b>'; }
EmptyCode = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> The Code Cannot be Empty </b>'; }
invalidCode = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> The Code is Invalid</b>'; }
onlyNumbers = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Only Numbers are allowed </b>'; }
codeLength = (x) => { if (x.toString().length < 6 || x.toString().length > 6) { return true; } if (x.toString().length === 6) { return false; } }
shortCode = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Wrong Code length </b>'; }
notMatch = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Password do not Match </b>'; }
wrongData = (x, y) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Not Authorized </b>'; y.classList.remove('hide'); y.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Not Authorized </b>'; }
notPasswordMatch = (x, y) => { if (x.toString() !== y.toString()) { return true; } return false; }
maximumAttempt = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> You have reached daily max attempts'; }
wrongCode = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> The Code is Invalid </b>'; }
checkNumber = (input) => { for (let i = 0; i < input.length; i++) { if (input.charAt(i) !== '0' && input.charAt(i) !== '1' && input.charAt(i) !== '2' && input.charAt(i) !== '3' && input.charAt(i) !== '4' && input.charAt(i) !== '5' && input.charAt(i) !== '6' && input.charAt(i) !== '7' && input.charAt(i) !== '8' && input.charAt(i) !== '9') { return false; } } return true; }
displayCounter = (x, y) => { Meteor.call('showCurrentAttempt', y, (err, res) => { if (err) Session.set('attempt', 0); if (res) Session.set('attempt', res); }); let count = 10 - (Session.get('attempt') + 1); if (count <= 0) { count = 0; } if (count > 1) { x.innerHTML = '<b>' + count + ' Attempts left</b>'; } else { x.innerHTML = '<b>' + count + ' Attempt left</b>'; } }
gamesEmpty = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Set your Games </b>'; }
invalidGames = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Only Numbers </b>'; }
invalidChoice = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-times-circle"></i> Invalid </b>'; }
gameFailed = (x) => { x.classList.remove('hide'); x.innerHTML = '<b class="text-danger"><i class="fas fa-exclamation-triangle pr-1"></i> Process Failed </b>'; }
redBottom = (x) => { x.style.borderBottomColor = 'red'; x.style.borderBottomWidth = '1.5px'; setTimeout(() => { x.style.borderBottomColor = ''; x.style.borderBottomWidth = ''; }, 1000); }
referralLength = (x) => { let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; if (x === '') { return true; } else { let hasAlphabet = 0; let hasNumber = 0; if (x.length === 9) { for (let i = 0; i < 3; i++) { for (let j = 0; j < aplhabet.length; j++) { if (x.charAt(i) === aplhabet[j]) { hasAlphabet++; } } } for (let i = 4; i < 9; i++) { for (let j = 0; j < numbers.length; j++) { if (x.charAt(i) === numbers[j]) { hasNumber++; } } } } if ((x.charAt(3) === '-') && (hasAlphabet === 3) && (hasNumber === 5)) { return true; } return false; } }
maxPasswordLength = (x) => { if (x.length > 30) { return true; } return false; }
invalidLength = (input) => { if (input.length < 6 || input.length > 20) { return true; } return false; }
invalidSearch = (input) => { if (input.length > 18) { return true; } return false; }
checkFloat = (input) => {
    let countComma = 0;
    if (input.charAt(0) === '.') { return false; }

    for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === '.') { countComma++; }
        if (input.charAt(i) !== '0' && input.charAt(i) !== '1' && input.charAt(i) !== '2' && input.charAt(i) !== '3' &&
            input.charAt(i) !== '4' && input.charAt(i) !== '5' && input.charAt(i) !== '6' && input.charAt(i) !== '7' &&
            input.charAt(i) !== '8' && input.charAt(i) !== '9' && input.charAt(i) !== '.') {
            return false;
        }
        if (countComma > 1) { return false; }
    }
    return true;
}
isInvalidAddress = (input) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let err = 'none';
    for (let i = 0; i < input.length; i++) {

        for (let j = 0; j < aplhabet.length; j++) {
            if (input.charAt(i) === aplhabet[j]) {
                // console.log('The Input is: ' + input.charAt(i) + ' and the alphabet is: ' + aplhabet[j]);
                break;
            }

            else if (j === (aplhabet.length - 1)) {
                // console.log('We have found an error here');
                err = 'found';
                break;
            }
        }
        if (err.toString() === 'found') { break; }
    }
    if (err.toString() === 'found') { return true; }
    else { return false; }
}
invalidMessage = (input) => {
    input.classList.add('shake'); input.style.borderBottomWidth = '1px'; input.style.borderBottomColor = 'red';
    setTimeout(
        () => {
            input.classList.remove('shake'); input.style.borderBottomWidth = ''; input.style.borderBottomColor = '';
        }, 700);
}
isInvalidName = (input) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // let checker = 'none';
    let err = 'none';

    for (let i = 0; i < input.length; i++) {

        for (let j = 0; j < aplhabet.length; j++) {
            if (input.charAt(i) === aplhabet[j]) {
                // console.log('The Input is: ' + input.charAt(i) + ' and the alphabet is: ' + aplhabet[j]);
                break;
            }

            else if (j === (aplhabet.length - 1)) {
                // console.log('We have found an error here');
                err = 'found'; break;
            }
        }
        if (err.toString() === 'found') { break; }
    }
    if (err.toString() === 'found') { return true; }
    else { return false; }
}
