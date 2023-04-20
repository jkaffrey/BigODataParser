/**
 * Perform a comparison between the count on two bitlinks to determine sort order.
 * @param {*} firstBitLink 
 * @param {*} secondBitLink 
 * @returns 
 */
export function descendingCountSort(firstBitLink, secondBitLink) {
    return secondBitLink.count - firstBitLink.count;
}

/**
 * Check if the passed in clickMetricObj is from the specified year, if so take the reference clickMetricTracker and utilize to
 * to increment the count based on the number of occurances for that year.
 * @param {*} clickMetricObj A single json object representing a line containing information for the bitlink click
 * @param {*} year The year we want to only return values for
 * @param {*} clickMetricTracker A variable passed in via reference to store the number of clicks of a bitlink from a given year
 * @returns The modified object with the count incremented if the year matched the requested year
 */
export function filterByYearAndCountSimilar(clickMetricObj, year, clickMetricTracker) {
    if (new Date(clickMetricObj.timestamp).getFullYear() === year) {

        var key = clickMetricObj.bitlink;
        clickMetricTracker[key] = (clickMetricTracker[key] || 0) + 1
        return clickMetricObj;
    }
}