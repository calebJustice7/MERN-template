module.exports = (type, str) => {

    if (type === 'camelCase' && str.indexOf('-') !== -1) {
        let finalStr = str; 
        let dash = str.indexOf('-');
        newStr = str.replace('-', '');
        let arr = newStr.split('');
        arr[dash] = arr[dash].toUpperCase();
        finalStr = arr.join('');

        return finalStr;
    } else {
        return str;
    }
}
