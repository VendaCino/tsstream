import {TsStream} from "../src/TsStream";

describe('Skip', () => {
    it('skip', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .skip(2)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(4);

    })
    it('skip empty', () => {

        let result = TsStream.from([])
            .skip(1)
            .toArray();

        expect(result.length).toBe(0);

    })
    it('skip high', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .skip(10)
            .toArray();

        expect(result.length).toBe(0);

    })
    it('skip zero', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .skip(0)
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
        expect(result[3]).toBe(4);

    })
    it('skip negative', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .skip(-1)
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
        expect(result[3]).toBe(4);

    })
})
