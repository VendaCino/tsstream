import {TsStream} from "../src/TsStream";

describe('TakeWhile', () => {
    it('takeWhile num array', () => {

        let data = [1, 2, 3, 2, 1];

        let result = TsStream.from(data)
            .takeWhile(function (num) {
                return num < 3;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);

        // assert original data is untouched
        expect(data.length).toBe(5);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(2);
        expect(data[4]).toBe(1);

    })
    it('takeWhile object', () => {

        let data = {a: 1, b: 2, c: 3, d: 2};

        let result = TsStream<number>(data)
            .takeWhile(function (num) {
                return num < 3;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);

        // assert original data is untouched
        expect(data.a).toBe(1);
        expect(data.b).toBe(2);
        expect(data.c).toBe(3);
        expect(data.d).toBe(2);

    })
    it('takeWhile empty', () => {

        let result = TsStream.from([])
            .takeWhile(function () {
                return true;
            })
            .toArray();

        expect(result.length).toBe(0);

    })
    it('takeWhile via regexp literal', () => {

        let data = ["a1", "a2", "b3", "a4"];

        let result = TsStream.from(data)
            .takeWhile(/a.*/)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("a1");
        expect(result[1]).toBe("a2");

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");
        expect(data[3]).toBe("a4");

    })
    it('takeWhile via regexp object', () => {

        let data = ["a1", "a2", "b3", "a4"];

        let result = TsStream.from(data)
            .takeWhile(new RegExp("a.*"))
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("a1");
        expect(result[1]).toBe("a2");

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");
        expect(data[3]).toBe("a4");

    })
    it(
        'takeWhile via sample object (depth=1)', () => {

            let data = [
                {a: 1, b: 1},
                {a: 1, b: 2},
                {a: 2, b: 3},
                {a: 1, b: 4}
            ];

            let result = TsStream.from(data)
                .takeWhile(t => t.a === 1)
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(1);
            expect(result[0].b).toBe(1);
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(2);

        }
    )
    it(
        'takeWhile via sample object (depth=2)', () => {

            let data = [
                {a: 1, b: 1, c: {x: "x1"}},
                {a: 1, b: 2, c: {x: "x1"}},
                {a: 2, b: 3, c: {x: "x3"}},
                {a: 1, b: 4, c: {x: "x1"}}
            ];

            let result = TsStream.from(data)
                .takeWhile(t => t.a === 1 && t.c.x === "x1")
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(1);
            expect(result[0].b).toBe(1);
            expect(result[0].c.x).toBe("x1");
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(2);
            expect(result[1].c.x).toBe("x1");

        }
    )
})
