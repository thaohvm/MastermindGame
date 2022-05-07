"use strict";
const { default: axios } = require('axios');
const ExpressError = require('../expressError');
const BASE_URL = "https://www.random.org/integers"

const DEFAULT_NUM_DIGITS = 4;
const DEFAULT_RAND_MIN = 0;
const DEFAULT_RAND_MAX = 7;
const DEFAULT_FALLBACK = false;

class Combination {
    constructor() {
        this.getRandomNum();
        this.getLocalRandomNum();
    }

    static async getRandomNum(numDigits = DEFAULT_NUM_DIGITS, min = DEFAULT_RAND_MIN, max = DEFAULT_RAND_MAX, fallback = DEFAULT_FALLBACK) {
        return axios.get(`${BASE_URL}/?num=${numDigits}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
            .then(function (response) {
                if (response.data === undefined) {
                    return handleApiErrors('Cannot query Random Generator API');
                }
                let answer = response.data.trim().split('\n').map(el => parseInt(el));
                console.log(answer);
                return answer;
            })
            .catch(function (error) {
                return handleApiErrors(error.data, fallback);
            })
    }

    static handleApiErrors(errorMessage, fallback) {
        if (fallback) {
            return this.getLocalRandomNum();
        } else {
            throw new Error(`Failed to generate random combination! ${errorMessage}`)
        }
    }

    static getLocalRandomNum(numDigits, max, min) {
        let result = [];
        for (let i = 0; i < numDigits; i++) {
            result.push(Math.floor(Math.random() * (max - min) + min))
        }
        return result;
    }
}

module.exports = Combination;
