import {TsStream} from "../src/TsStream";

describe('Map', () => {
    it('map num array', () => {

        let data = [1, 2, 3, 4];

        let result = TsStream.from(data)
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe('obj1');
        expect(result[1]).toBe('obj2');
        expect(result[2]).toBe('obj3');
        expect(result[3]).toBe('obj4');

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);

    })
    it('map object array', () => {

        let data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

        let result = TsStream.from(data)
            .map(function (obj) {
                return {b: obj.a};
            })
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0].b).toBe(1);
        expect(result[1].b).toBe(2);
        expect(result[2].b).toBe(3);
        expect(result[3].b).toBe(4);

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0].a).toBe(1);
        expect(data[1].a).toBe(2);
        expect(data[2].a).toBe(3);
        expect(data[3].a).toBe(4);

    })
    it('map empty array', () => {

        let result = TsStream.from([])
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

        expect(result.length).toBe(0);

    })
    it('map with null', () => {

        let data = [1, null, undefined, 4];

        let result = TsStream.from(data)
            .map(function (val) {
                return "map_" + val;
            })
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe('map_1');
        expect(result[1]).toBe('map_null');
        expect(result[2]).toBe('map_undefined');
        expect(result[3]).toBe('map_4');

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(null);
        expect(data[2]).toBe(undefined);
        expect(data[3]).toBe(4);

    })

})
