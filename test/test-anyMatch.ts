import {TsStream} from '../src/TsStream';

describe('AnyMatch', () => {
    it('anyMatch true', () => {
        let result = TsStream.from([1, 2, 3, 4]).anyMatch(function (num) {
            return num === 4;
        });
        expect(result).toBe(true);
    });
    it('anyMatch false', () => {
        let result = TsStream.from([1, 2, 3, 4]).anyMatch(function (num) {
            return num === 5;
        });
        expect(result).toBe(false);
    });
    it('anyMatch empty', () => {
        let result = TsStream.from([]).anyMatch(function (num) {
            return num > 1;
        });
        expect(result).toBe(false);
    });
    it('anyMatch regexp true', () => {
        let result = TsStream.from(['a1', 'a2', 'a3']).anyMatch(/a.*/);
        expect(result).toBe(true);
    });
    it('anyMatch regexp false', () => {
        let result = TsStream.from(['b1', 'b2', 'b3']).anyMatch(/a.*/);
        expect(result).toBe(false);
    });
    it('anyMatch regexp empty', () => {
        let result = TsStream.from([]).anyMatch(/a.*/);
        expect(result).toBe(false);
    });
    it('anyMatch sample true', () => {
        let result = TsStream.from([
            {a: 1, b: 5},
            {a: 2, b: 5},
            {a: 3, b: 5},
        ]).anyMatch((t) => t.a === 1);
        expect(result).toBe(true);
    });
    it('anyMatch sample false', () => {
        let result = TsStream.from([
            {a: 1, b: 5},
            {a: 2, b: 5},
            {a: 3, b: 5},
        ]).anyMatch((t) => t.a === 4);
        expect(result).toBe(false);
    });
    it('anyMatch sample empty', () => {
        // @ts-ignore
        let result = TsStream.from([]).anyMatch((t) => t.a === 1);
        expect(result).toBe(false);
    });
});
