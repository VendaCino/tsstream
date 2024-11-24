import {TsStream} from "../src/TsStream";

describe('Reduce', () => {
    it('reduce', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .reduce(1000, function (identity, num) {
                return identity + num;
            });
        expect(result).toBe(1010);

    })
    it('reduce empty', () => {

        let result = TsStream.from([])
            .reduce(1000, function (identity, num) {
                return identity + num;
            });
        expect(result).toBe(1000);

    })
    it('reduce first', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .reduce0(function (identity, num) {
                return identity * num;
            });
        expect(result).toBe(24);

    })
    it('reduce first empty', () => {

        let result = TsStream.from([])
            // @ts-ignore
            .reduce0(function (identity, num) {
                return identity * num;
            }) ?? ("NOTHING");
        expect(result).toBe("NOTHING")

    })
})
