import fs from 'fs';
import JSONStream from 'JSONStream';
import { descendingCountSort, filterByYearAndCountSimilar } from './filters.js';
import { checkFileExtension } from './helpers.js';

/**
 * Take a filePath representing a CSV file that contains the shortened URL information and compose it into an array of JSON objects.
 * @param {*} filePath path to csv file
 * @returns An array of objects representing the CSV file
 * @throws Throws an error if the file extention is not csv or if the file does not exist
 */
export function convertCSVToJsonBitLinks(filePath) {

    if (checkFileExtension(filePath, 'csv') || !fs.existsSync(filePath)) {
        throw new Error('Invalid file specified for conversion.')
    }

    const encodesCSVData = [];

    const encodesData = fs.readFileSync(filePath, 'utf-8');
    encodesData.split(/\r?\n/).forEach((line, index) => {
        if (index > 0) {

            const lineInformation = line.split(',');
            encodesCSVData.push(
                {
                    bitLink: 'http://' + lineInformation[1] + '/' + lineInformation[2],
                    longUrl: lineInformation[0]
                }
            )
        }
    })

    return encodesCSVData;
}

/**
 * Read through the json file that represents the clicks for each bitLink. In the process group common bitlinks if they match the year
 * and increment the count associated with them.
 * @param {*} year The year we want to track click metrics for
 * @param {*} filePath path to json file
 * @returns An object with a key of bitlinks and a value that reprents the count
 * @throws Throws an error if the file extention is not json or if the file does not exist
 */
export function composeClickMetricsFromJson(year, filePath) {

    if (checkFileExtension(filePath, 'json') || !fs.existsSync(filePath)) {
        throw new Error('Invalid file specified for conversion.')
    }

    return new Promise((resolve, reject) => {

        try {
            // This is declared here as a global variable that is passed by reference to the JSONStream library to group and count each
            // click metric based on bitlink via the filterByYearAndCountSimilar function.
            var clickMetricTracker = {};

            var stream = fs.createReadStream(filePath),
                parser = JSONStream.parse('*', streamObject => { filterByYearAndCountSimilar(streamObject, year, clickMetricTracker) })

            stream.pipe(parser)
            stream.on('close', function streamFullfilled() {

                resolve(clickMetricTracker)
            })
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * A self-calling function to perform the reading in of data from the coresponding CSV and JSON files and then returns an descending ordered array
 * representing the click count of the bitlinks from the requested year (in this instance 2021) mapped to their long_url.
 */
(async function main() {

    let output = []

    var clickCounts = await composeClickMetricsFromJson(2021, './assets/decodes.json');
    var encodesData = convertCSVToJsonBitLinks('./assets/encodes.csv');
    encodesData.forEach(encodeData => {
        if (clickCounts[encodeData.bitLink]) {
            let count = clickCounts[encodeData.bitLink]
            output.push(
                {
                    longUrl: encodeData.longUrl,
                    count
                }
            )
        }
    })

    output.sort(descendingCountSort);
    console.log(output);
    return output;
}())