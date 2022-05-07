"use strict";
const axios = require('axios');
const { getRandomNum } = require('./combination');
const Combination = require('./combination');

jest.mock('axios');

describe("getRandomNum", () => {
    test('fetch succsessfully data from the API', async () => {

        const resp = {data: ["1", "2", "3", "4"]};
        axios.get.mockResolvedValue(resp)
        return Combination.getRandomNum().then(data => expect(data).toEqual(resp))
    })
})
