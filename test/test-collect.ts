import {TsStream} from '../src/TsStream';

describe('Collect', () => {
    it('collect', () => {
        let result = TsStream.from([1, 2, 3, 4]).collect<string, string>({
            supplier: function () {
                return 'Data: ';
            },
            accumulator: function (val, num) {
                return val + num + ' ';
            },
            finisher: function (val) {
                return val + '!';
            },
        });

        expect(result).toBe('Data: 1 2 3 4 !');
    });
    it('collect without finisher', () => {
        let result = TsStream.from([1, 2, 3, 4]).collect<string, string>({
            supplier: function () {
                return 'Data: ';
            },
            accumulator: function (val, num) {
                return val + num + ' ';
            },
        });

        expect(result).toBe('Data: 1 2 3 4 ');
    });
    it('collect empty', () => {
        let result = TsStream.from([]).collect({
            supplier: function () {
                return 'Data: ';
            },
            accumulator: function (val, num) {
                return val + num + ' ';
            },
            finisher: function (val) {
                return val + '!';
            },
        });

        expect(result).toBe('Data: !');
    });
});
