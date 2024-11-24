import {TsStream} from '../src/TsStream';

describe('Reverse', () => {
    it('reverse', () => {
        let data = [1, 2, 3, 4];

        let result = TsStream.from(data).reverse().toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(4);
        expect(result[1]).toBe(3);
        expect(result[2]).toBe(2);
        expect(result[3]).toBe(1);

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);
    });
});
