const { default: axios } = require('axios');
const ExpressError = require('../expressError');
const BASE_URL = "https://www.random.org/integers"
const { generateRandomNum } = require('./helpers');

class Combination {
    constructor(numDigits, numAttemps,) {
        this.numDigits = numDigits;
        this.numAttemps = numAttemps;
        this.makeRandNum();
        this.generateRandomNum();
    }
    static async makeRandNum(numDigits) {

        const res = await axios.get(`${BASE_URL}/?num=${numDigits}&min=0&max=7&col=1&base=10&format=plain&rnd=new`);
        const answerInStr = res.data.trim().split('\n');
        if (answerInStr === undefined) {
            const answer = generateRandomNum(numDigits)
        } else {
            answer = answerInStr.map(el => parseInt(el))
        }
        console.log(answer)
        return answer
    }

    static getRandomNum(numDigits, max = 7, min = 0) {
        let result = [];
        for (let i = 0; i < numDigits; i++) {
            result.push(Math.floor(Math.random() * (max - min) + min))
        }
        return result;
    }
}

module.exports = Combination;
