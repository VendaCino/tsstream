import {TsStream} from "../src/TsStream";

describe('NoneMatch', () => {
    it('noneMatch true', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .noneMatch(function (num) {
                return num < 0;
            });
        expect(result).toBe(true);

    })
    it('noneMatch false', () => {

        let result = TsStream.from([1, 2, 3, 4])
            .noneMatch(function (num) {
                return num > 3;
            });
        expect(result).toBe(false);

    })
    it('noneMatch empty', () => {

        let result = TsStream.from([])
            .noneMatch(function (num) {
                return num > 1;
            });
        expect(result).toBe(true);

    })
    it('noneMatch regexp true', () => {

        let result = TsStream.from(["a1", "a2", "a3"])
            .noneMatch(/b.*/);
        expect(result).toBe(true);

    })
    it('noneMatch regexp false', () => {

        let result = TsStream.from(["b1", "a2", "b3"])
            .noneMatch(/a.*/);
        expect(result).toBe(false);

    })
    it('noneMatch regexp empty', () => {

        let result = TsStream.from([])
            .noneMatch(/a.*/);
        expect(result).toBe(true);

    })
    it('noneMatch sample true', () => {

        let result = TsStream.from([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
            .noneMatch(t => t.a === 4);
        expect(result).toBe(true);

    })
    it('noneMatch sample false', () => {

        let result = TsStream.from([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
            .noneMatch(t => t.a === 1);
        expect(result).toBe(false);

    })
    it('noneMatch sample empty', () => {

        let result = TsStream.from([])
            // @ts-ignore
            .noneMatch(t => t.a === 1);
        expect(result).toBe(true);

    })
})
