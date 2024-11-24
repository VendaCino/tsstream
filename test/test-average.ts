import {TsStream} from '../src/TsStream';

describe('Average', () => {
    it('average', () => {
        let result = TsStream.from([1, 2, 3, 4]).average();

        expect(result).toBe(2.5);
    });
    it('average empty', () => {
        let result = TsStream.from([]).average();
        expect(result).toBe(null);
    });
});
