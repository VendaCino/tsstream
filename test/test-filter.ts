import {TsStream} from "../src/TsStream";

describe('Filter', () => {
    it('filter num array', () => {

        let data = [1, 2, 3, 4];

        let result = TsStream.from(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(3);

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);

    })
    it('filter object array', () => {

        let data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

        let result = TsStream.from(data)
            .filter(function (obj) {
                return obj.a % 2 === 1;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0].a).toBe(1);
        expect(result[1].a).toBe(3);

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0].a).toBe(1);
        expect(data[1].a).toBe(2);
        expect(data[2].a).toBe(3);
        expect(data[3].a).toBe(4);

    })
    it('filter object', () => {

        let data = {a: 1, b: 2, c: 3, d: 4};

        // @ts-ignore
        let result = TsStream.from<number>(data)
            .filter(function (num: number) {
                return num % 2 === 1;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(3);

        // assert original data is untouched
        expect(data.a).toBe(1);
        expect(data.b).toBe(2);
        expect(data.c).toBe(3);
        expect(data.d).toBe(4);

    })
    it('filter empty', () => {

        let result = TsStream.from([])
            .filter(function () {
                return true;
            })
            .toArray();

        expect(result.length).toBe(0);

    })
    it('filter with null', () => {

        let result = TsStream.from([1, null, undefined, 2])
            .filter(function () {
                return true;
            })
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(null);
        expect(result[2]).toBe(undefined);
        expect(result[3]).toBe(2);

    })
    it('filter via regexp literal', () => {

        let data = ["a1", "a2", "b3"];

        let result = TsStream.from(data)
            .filter(/a.*/)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("a1");
        expect(result[1]).toBe("a2");

        // assert original data is untouched
        expect(data.length).toBe(3);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");

    })
    it('filter via regexp object', () => {

        let data = ["a1", "a2", "b3"];

        let result = TsStream.from(data)
            .filter(new RegExp("a.*"))
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("a1");
        expect(result[1]).toBe("a2");

        // assert original data is untouched
        expect(data.length).toBe(3);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");

    })
    it(
        'filter via sample object (depth=1)', () => {

            let data = [
                {a: 1, b: 1},
                {a: 2, b: 2},
                {a: 1, b: 3}
            ];

            let result = TsStream.from(data)
                .filter(t => t.a === 1)
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(1);
            expect(result[0].b).toBe(1);
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(3);

        }
    )
    it(
        'filter via sample object (depth=2)', () => {

            let data = [
                {a: 1, b: 1, c: {x: "x1"}},
                {a: 2, b: 2, c: {x: "x2"}},
                {a: 1, b: 3, c: {x: "x3"}},
                {a: 1, b: 4, c: {x: "x1"}}
            ];

            let result = TsStream.from(data)
                .filter(t => t.a === 1 && t.c.x === "x1")
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(1);
            expect(result[0].b).toBe(1);
            expect(result[0].c.x).toBe("x1");
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(4);
            expect(result[1].c.x).toBe("x1");

        }
    )
})
