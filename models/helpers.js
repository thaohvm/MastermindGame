function generateRandomNum(numOfDigit, max = 7, min = 0) {
    let result = [];
        for (let i = 0; i < numOfDigit; i++) {
        result.push(Math.floor(Math.random() * (max - min) + min))
    }
    return result;
}

module.exports = { generateRandomNum }
