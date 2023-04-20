import fs from 'fs';
import { convertCSVToJsonBitLinks, composeClickMetricsFromJson } from "../src/main.js";

describe('Testing convertCSVToJsonBitLinks', function () {

    it('Should throw an error is a non csv file was passed in.', function () {
        spyOn(fs, 'existsSync').and.returnValue(true);
        expect(() => convertCSVToJsonBitLinks('./invalid/file/encodes.json')).toThrow(new Error('Invalid file specified for conversion.'))
    })

    it('Should throw an error is an non-existant file path is passed in.', function () {
        spyOn(fs, 'readFileSync').and.returnValue('I technically exist.')
        expect(() => convertCSVToJsonBitLinks('./invalid/file/encodes.csv')).toThrow(new Error('Invalid file specified for conversion.'))
    })

    it('Should succeed and convert the csv file, ignoring the first line of data.', function () {
        spyOn(fs, 'readFileSync').and.returnValue(`long_url,domain,hash\r\nhttps://google.com/,bit.ly,31Tt55y,\r\nhttps://github.com/,bit.ly,2kJO0qS`)
        spyOn(fs, 'existsSync').and.returnValue(true);
        const output = JSON.stringify(convertCSVToJsonBitLinks('testCSV.csv'));
        const expectedOutput = JSON.stringify([
            { bitLink: 'http://bit.ly/31Tt55y', longUrl: 'https://google.com/' },
            { bitLink: 'http://bit.ly/2kJO0qS', longUrl: 'https://github.com/' }
        ]);

        expect(output).toEqual(expectedOutput);
    })
})

describe('Testing composeClickMetricsFromJson', function () {

    it('Should throw an error is a non json file was passed in.', function () {
        spyOn(fs, 'existsSync').and.returnValue(true);
        expect(() => composeClickMetricsFromJson(2021, './invalid/file/encodes.csv')).toThrow(new Error('Invalid file specified for conversion.'))
    })

    it('Should throw an error is an non-existant file path is passed in.', function () {
        spyOn(fs, 'readFileSync').and.returnValue('I technically exist.')
        expect(() => composeClickMetricsFromJson(2021, './invalid/file/encodes.json')).toThrow(new Error('Invalid file specified for conversion.'))
    })

    it('(Simple) Should succeed and group data based on matching bitlinks and year passed in.', async function () {
        const output = await composeClickMetricsFromJson(2021, './assets/decodes_test_simple.json');

        expect(output).toEqual({ 'http://bit.ly/spoilers': 2 });
    })

    it('(Complex) Should succeed and group data based on matching bitlinks and year passed in.', async function () {
        const output = await composeClickMetricsFromJson(2021, './assets/decodes_test_complex.json');

        expect(output).toEqual({ 'http://bit.ly/spoilers': 2, 'http://bit.ly/bOtIS': 1 });
    })
})