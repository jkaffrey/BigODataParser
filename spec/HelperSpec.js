import { checkFileExtension } from "../src/helpers.js";

describe('Testing checkFileExtension', function() {
    it('Should return false if the file extension does match.', function() {
        
        const output = checkFileExtension('./test/path/example.csv', 'csv');
        expect(output).toBe(false);
    })

    it('Should return true if the file extension does not match.', function() {
        
        const output = checkFileExtension('./test/path/example.csv', 'json');
        expect(output).toBe(true);
    })
})