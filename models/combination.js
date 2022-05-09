"use strict";
const { default: axios } = require('axios');
const ExpressError = require('../error');

const config = require('../config');

/** Class providing utilities to generate random combination of integers */
class Combination {
    /**
     * Generate the required Random Generator API URL to generate
     * a numDigits combination of intergers within [min, max] range
     * @param {int} numDigits Number of intergers in the combination
     * @param {int} min Minumum value of the intergers (inclusive)
     * @param {int} max Maximum value of the intergers (inclusive)
     * @returns {str} Full Random Generator URL
     */
    static getRandomGeneratorUrl(numDigits, min, max) {
        return `${config.combination.BASE_URL}/?num=${numDigits}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
    }

    /**
     * Generate a numDigits combination of intergers within [min, max] range
     * via Random Generator API or fallback local generator
     * @param {int} numDigits Number of intergers in the combination
     * @param {int} min Minumum value of the intergers (inclusive)
     * @param {int} max Maximum value of the intergers (inclusive)
     * @returns {int[]} Generated combination
     */
    static async getRandomInt(numDigits, min, max) {
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

    /**
     * Generate a numDigits combination of intergers within [min, max] range
     * @param {int} numDigits Number of intergers in the combination
     * @param {int} min Minumum value of the intergers (inclusive)
     * @param {int} max Maximum value of the intergers (inclusive)
     * @returns {int[]} Generated combination
     */
    static getLocalRandomInt(numDigits, min, max) {
        let combinations = [];
        for (let i = 0; i < numDigits; i++) {
            combinations.push(Math.floor(Math.random() * (max - min) + min))
        }
        return combinations;
    }
}

module.exports = Combination;
