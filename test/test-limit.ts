import {TsStream} from "../src/TsStream";

describe('Limit', () => {
    it('limit', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .limit(2)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);

    })
    it('limit empty', () => {

        let result = TsStream.from([])
            .limit(1)
            .toArray();

        expect(result.length).toBe(0);

    })
    it('limit high', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .limit(10)
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
        expect(result[3]).toBe(4);

    })
    it('limit zero', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .limit(0)
            .toArray();

        expect(result.length).toBe(0);

    })
    it('limit negative', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .limit(-1)
            .toArray();

        expect(result.length).toBe(0);

    })
})
