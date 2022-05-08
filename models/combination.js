"use strict";
const { default: axios } = require('axios');
const ExpressError = require('../error');

const config = require('../config');

class Combination {
    static getRandomGeneratorUrl(numDigits, min, max) {
        return `${config.combination.baseUrl}/?num=${numDigits}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
    }

    static async getRandomInt(numDigits = config.combination.numDigits, min = config.combination.min, max = config.combination.max) {
        return axios.get(Combination.getRandomGeneratorUrl(numDigits, min, max))
            .then(function (response) {
                console.log(response.data);
                if (!/^[0-9\s]+$/.test(response.data)) {
                    // Response should only include digits and new line characters
                    console.log("Invalid data format from Random Generator!");
                    return Combination.getLocalRandomInt(numDigits, min, max);
                }

                return response.data.trim().split('\n').map(el => parseInt(el));
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(`Failed to query Random Generator - Status ${error.response.status} - Error: ${error.response.data}`);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log(`Failed to query Random Generator - Error: ${error.message}`);
                }

                return Combination.getLocalRandomInt(numDigits, min, max);
            })
    }

    static getLocalRandomInt(numDigits, min, max) {
        let combinations = [];
        for (let i = 0; i < numDigits; i++) {
            combinations.push(Math.floor(Math.random() * (max - min) + min))
        }
        return combinations;
    }
}

module.exports = Combination;
