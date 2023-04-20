import { descendingCountSort, filterByYearAndCountSimilar } from "../src/filters.js";

describe('Testing descendingCountSort', function() {
    it('should sort in descending order.', function() {
        const testArr = [{ count: 5 }, { count: 1 }, { count: 2 }, { count: 4 }, { count: 3 }];
        testArr.sort(descendingCountSort);

        expect(testArr).toEqual([       
            { count: 5 },
            { count: 4 },
            { count: 3 },
            { count: 2 },
            { count: 1 } 
          ])
    })
})

describe('Testing filterByYearAndCountSimilar', function() {
    it('should not return anything if the year is not equal to what is specified in the function call.', function() {
        
        const clickMetricObj = { "bitlink": "http://bit.ly/whoAmI", "user_agent": "", "timestamp": "2020-02-15T00:00:00Z", "referrer": "who.me", "remote_ip": "0.0.0.0" };
        const output = filterByYearAndCountSimilar(clickMetricObj, 2021, {});

        expect(output).toEqual(undefined);
    })

    it('should return if the year is equal to what is specified in the function call.', function() {
        const clickMetricObj = { "bitlink": "http://bit.ly/bOTiS", "user_agent": "", "timestamp": "2021-02-15T00:00:00Z", "referrer": "who.me", "remote_ip": "0.0.0.0" };
        const output = filterByYearAndCountSimilar(clickMetricObj, 2021, {});

        expect(output).toBeTruthy();
    })
})