/**
 * Check if a filePath matches the specified file extension
 * @param {*} filePath Path to file to compare
 * @param {*} expectedExtension Extension that is expected
 * @returns true if the extension does not match, false otherwise
 */
export function checkFileExtension(filePath, expectedExtension) {

    var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length);
    return !(fileExtension && fileExtension === expectedExtension)
}