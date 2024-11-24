import {TsStream} from "../src/TsStream";

describe('FlatMap', () => {
    it('flatMap num array', () => {

        let data = [1, 2, 3];

        let result = TsStream.from(data)
            .flatMap(function (num) {
                return [num, num];
            })
            .toArray();

        expect(result.length).toBe(6);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(1);
        expect(result[2]).toBe(2);
        expect(result[3]).toBe(2);
        expect(result[4]).toBe(3);
        expect(result[5]).toBe(3);

        // assert original data is untouched
        expect(data.length).toBe(3);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);

    })
    it('flatMap object array', () => {

        let data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

        let result = TsStream.from(data)
            .flatMap(function (obj) {
                return [{b: obj.a}, {b: obj.a}];
            })
            .toArray();

        expect(result.length).toBe(8);
        expect(result[0].b).toBe(1);
        expect(result[1].b).toBe(1);
        expect(result[2].b).toBe(2);
        expect(result[3].b).toBe(2);
        expect(result[4].b).toBe(3);
        expect(result[5].b).toBe(3);
        expect(result[6].b).toBe(4);
        expect(result[7].b).toBe(4);

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0].a).toBe(1);
        expect(data[1].a).toBe(2);
        expect(data[2].a).toBe(3);
        expect(data[3].a).toBe(4);

    })
    it('flatMap empty array', () => {

        let result = TsStream.from([])
            .flatMap(function (num) {
                return [num, num];
            })
            .toArray();

        expect(result.length).toBe(0);

    })
})
