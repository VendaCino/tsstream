import {TsStream} from "../src/TsStream";

describe('Slice', () => {
    it('slice', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .slice(1, 3)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(2);
        expect(result[1]).toBe(3);

    })
    it('slice empty', () => {

        let result = TsStream.from([])
            .slice(1, 2)
            .toArray();

        expect(result.length).toBe(0);

    })
    it('slice high', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .slice(10, 20)
            .toArray();

        expect(result.length).toBe(0);

    })
})
