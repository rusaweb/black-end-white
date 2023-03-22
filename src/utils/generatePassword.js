export const generatePassword = () => {
    let charactersArray = 'a-z,A-Z,0-9'.split(',');
    let CharacterSet = '';
    let result = '';

    if( charactersArray.indexOf('a-z') >= 0) {
        CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
    }
    if( charactersArray.indexOf('A-Z') >= 0) {
        CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if( charactersArray.indexOf('0-9') >= 0) {
        CharacterSet += '0123456789';
    }

    for(let i=0; i < 8; i++) {
        result += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
    }
    return result;
}
