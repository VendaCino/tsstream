import {TsStream} from "../src/TsStream";

describe('Count', () => {
    it('count', () => {

        let result = TsStream.from([1, 2, 3, 4]).count();
        expect(result).toBe(4);

    })
    it('count empty', () => {

        let result = TsStream.from([]).count();
        expect(result).toBe(0);

    })
})
