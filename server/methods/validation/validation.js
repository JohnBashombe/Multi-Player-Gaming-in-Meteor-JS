
isEmpty = (e) => { if (e === '' || e === null || e === undefined || e === NaN) { return true; } return false; }

choiceLength = (x) => { if (x.length == 1) { return true; } return false; }

isNotPassword = (e) => { if (e.length < 6) { return true; } return false; }

trimInputID = (x) => {
    x = x.toString();
    let y = x.replace(/[^a-zA-Z0-9 ]/g, '');
    return y;
}

trimInputGames = (x) => {
    x = x.toString();
    let y = x.replace(/[^0-9 ]/g, '');
    return y;
}

trimInputEmail = (x) => {
    x = x.toString();
    let y = x.replace(/[&\/\\#,+()$~%'":*?<>{}^`=!]/g, '');
    return y;
}

trimInput = (x) => {
    x = x.toString();
    let y = x.replace(/[&\/\\#,+()$~%.'":*?<>{}^@`=!]/g, '');
    return y;
}

isEmail = (x) => {
    const regx = /^([a-zA-Z0-9\.\-]+)@([a-zA-Z0-9\-]+)\.([a-zA-Z]+)(.[a-zA-Z]+)?$/;
    if (regx.test(x)) { return true; }
    return false;
}

codeLength = (x) => { if (x.length === 6) { return true; } return false; }

checkNumber = (input) => {

    for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) !== '0' && input.charAt(i) !== '1' && input.charAt(i) !== '2'
            && input.charAt(i) !== '3' && input.charAt(i) !== '4' && input.charAt(i) !== '5'
            && input.charAt(i) !== '6' && input.charAt(i) !== '7' && input.charAt(i) !== '8'
            && input.charAt(i) !== '9') {
            // alert('This is not a real number');
            return false;
        }
    }
    return true;
}

referralLength = (x) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (x === '') return true;
    else {

        let hasAlphabet = 0; let hasNumber = 0;

        if (x.length === 9) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < aplhabet.length; j++) {
                    if (x.charAt(i) === aplhabet[j]) { hasAlphabet++; }
                }
            }

            for (let i = 4; i < 9; i++) {
                for (let j = 0; j < numbers.length; j++) {
                    if (x.charAt(i) === numbers[j]) { hasNumber++; }
                }
            }
        }

        if ((x.charAt(3) === '-') && (hasAlphabet === 3) && (hasNumber === 5)) { return true; }
        return false;
    }
}

maxPasswordLength = (x) => { if (x.length > 30) { return true; } return false; }

wrongText = (text) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "'",
        '.', ',', '?', '%', ' ', '\n'];

    // let checker = 'none';
    let err = 'none';

    for (let i = 0; i < text.length; i++) {

        for (let j = 0; j < aplhabet.length; j++) {
            if (text.charAt(i) === aplhabet[j]) {
                // console.log('The Input is: ' + input.charAt(i) + ' and the alphabet is: ' + aplhabet[j]);
                break;
            }

            else if (j === (aplhabet.length - 1)) {
                // console.log('We have found an error here');
                err = 'found';
                break;
            }
        }

        if (err.toString() === 'found') break;
    }

    if (err.toString() === 'found') return true;
    else return false;
}

checkFloat = (input) => {

    let countComma = 0;
    if (input.charAt(0) === '.') return false;

    for (let i = 0; i < input.length; i++) {

        if (input.charAt(i) === '.') countComma++;

        if (input.charAt(i) !== '0' && input.charAt(i) !== '1' &&
            input.charAt(i) !== '2' && input.charAt(i) !== '3' &&
            input.charAt(i) !== '4' && input.charAt(i) !== '5' &&
            input.charAt(i) !== '6' && input.charAt(i) !== '7' &&
            input.charAt(i) !== '8' && input.charAt(i) !== '9' &&
            input.charAt(i) !== '.') {
            return false;
        }
        if (countComma > 1) return false;
    }
    return true;
}

isInvalidAddress = (input) => {

    let aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
                err = 'found';
                break;
            }
        }

        if (err.toString() === 'found') break;

    }

    if (err.toString() === 'found') return true;
    else return false;
}

messageLength = (input) => {
    if (input.length > 300) return true;
    else if (input.length < 10) return true;
    else return false;
}
invalidLengthServer = (input) => {

    if (input.length > 20) {
        return true;
    }
    return false;

}

invalidLengthName = (input) => {
    if (input.length < 6 || input.length > 20) {
        return true;
    }
    return false;
}