import {TsStream} from "../src/TsStream";

describe('Sum', () => {
    it('sum', () => {

        let result = TsStream.from([1, 2, 3, 4]).sum();
        expect(result).toBe(10);

    })
    it('sum empty', () => {

        let result = TsStream.from([]).sum();
        expect(result).toBe(0);

    })
})
