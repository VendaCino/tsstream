import {TsStream} from '../src/TsStream';

describe('Shuffle', () => {
    it('shuffle num array', () => {
        let data = [1, 2, 3, 4, 5];

        let result = TsStream.from(data).shuffle().toArray();

        expect(result.length).toBe(data.length);
        expect(result.indexOf(1) > -1).toBe(true);
        expect(result.indexOf(2) > -1).toBe(true);
        expect(result.indexOf(3) > -1).toBe(true);
        expect(result.indexOf(4) > -1).toBe(true);
        expect(result.indexOf(5) > -1).toBe(true);

        // assert original data is untouched
        expect(data.length).toBe(5);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);
        expect(data[4]).toBe(5);
    });
});
