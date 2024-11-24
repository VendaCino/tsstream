import {Collectors, TsStream} from "../src/TsStream";

describe('Joining', () => {
    it('joining', () => {
        let result = TsStream.from([1, 2, 3, 4]).collect(Collectors.joining());
        expect(result).toBe("1234")
    })
    it('joining empty', () => {

        let result = TsStream.from([]).collect(Collectors.joining(','));
        expect(result).toBe("")

    })
    it('joining with delimiter', () => {

        let result = TsStream.from([1, 2, 3, 4]).collect(Collectors.joining(','));
        expect(result).toBe("1,2,3,4")

    })
})
