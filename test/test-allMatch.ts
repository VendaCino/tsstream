import {TsStream} from '../src/TsStream';

describe('allMatch', () => {
    it('allMatch true', () => {
        let result = TsStream.from([1, 2, 3, 4]).allMatch(function (num) {
            return num > 0;
        });
        expect(result).toBe(true);
    });
    it('allMatch false', () => {
        let result = TsStream.from([1, 2, 3, 4]).allMatch(function (num) {
            return num > 1;
        });
        expect(result).toBe(false);
    });
    it('allMatch empty', () => {
        let result = TsStream.from([]).allMatch(function (num) {
            return num > 1;
        });
        expect(result).toBe(true);
    });
    it('allMatch regexp true', () => {
        let result = TsStream.from(['a1', 'a2', 'a3']).allMatch(/a.*/);
        expect(result).toBe(true);
    });
    it('allMatch regexp false', () => {
        let result = TsStream.from(['a1', 'a2', 'b3']).allMatch(/a.*/);
        expect(result).toBe(false);
    });
    it('allMatch regexp empty', () => {
        let result = TsStream.from([]).allMatch(/a.*/);
        expect(result).toBe(true);
    });
    it('allMatch sample true', () => {
        let result = TsStream.from([
            {a: 1, b: 5},
            {a: 2, b: 5},
            {a: 3, b: 5},
        ]).allMatch((t) => t.b === 5);
        expect(result).toBe(true);
    });
    it('allMatch sample false', () => {
        let result = TsStream.from([
            {a: 1, b: 5},
            {a: 2, b: 5},
            {a: 3, b: 5},
        ]).allMatch((t) => t.a === 1);
        expect(result).toBe(false);
    });
    it('allMatch sample empty', () => {
        // @ts-ignore
        let result = TsStream.from([]).allMatch((t) => t.a === 1);
        expect(result).toBe(true);
    });
});
