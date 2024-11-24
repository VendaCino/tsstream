import {TsStream} from "../src/TsStream";

describe('Distinct', () => {
    it('distinct', () => {

        let result = TsStream.from([1, 3, 3, 1])
            .distinct()
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(3);

    })
    it('distinct empty', () => {

        let result = TsStream.from([])
            .distinct()
            .toArray();

        expect(result.length).toBe(0);

    })
})
