import {TsStream} from "../src/TsStream";

describe('FindFirst', () => {
    it('findFirst', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .filter(function (num) {
                return num % 2 === 0;
            })
            .findFirst();

        expect(result).toBe(2);

    })
    it('findFirst empty', () => {

        let result = TsStream.from([]).findFirst();
        expect(result).toBe(null);

    })
    it('findFirst object', () => {

        // @ts-ignore
        let result = TsStream.from({a: 1, b: 2}).findFirst();

        expect(result).toBe(1);

    })
})
