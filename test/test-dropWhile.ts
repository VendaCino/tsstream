import {TsStream} from "../src/TsStream";

describe('DropWhile', () => {
    it('dropWhile num array', () => {

        let data = [1, 2, 3, 2, 1];

        let result = TsStream.from(data)
            .dropWhile(function (num) {
                return num < 3;
            })
            .toArray();

        expect(result.length).toBe(3);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(1);

        // assert original data is untouched
        expect(data.length).toBe(5);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(2);
        expect(data[4]).toBe(1);

    })
    it('dropWhile object', () => {

        let data = {a: 1, b: 2, c: 3, d: 1};

        let result = TsStream<number>(data)
            .dropWhile(function (num) {
                return num < 3;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(1);

        // assert original data is untouched
        expect(data.a).toBe(1);
        expect(data.b).toBe(2);
        expect(data.c).toBe(3);
        expect(data.d).toBe(1);

    })
    it('dropWhile empty', () => {

        let result = TsStream.from([])
            .dropWhile(function () {
                return true;
            })
            .toArray();

        expect(result.length).toBe(0);

    })
    it('dropWhile via regexp literal', () => {

        let data = ["a1", "a2", "b3", "a4"];

        let result = TsStream.from(data)
            .dropWhile(/a.*/)
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("b3");
        expect(result[1]).toBe("a4");

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");
        expect(data[3]).toBe("a4");

    })
    it('dropWhile via regexp object', () => {

        let data = ["a1", "a2", "b3", "a4"];

        let result = TsStream.from(data)
            .dropWhile(new RegExp("a.*"))
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("b3");
        expect(result[1]).toBe("a4");

        // assert original data is untouched
        expect(data.length).toBe(4);
        expect(data[0]).toBe("a1");
        expect(data[1]).toBe("a2");
        expect(data[2]).toBe("b3");
        expect(data[3]).toBe("a4");

    })
    it(
        'dropWhile via sample object (depth=1)', () => {

            let data = [
                {a: 1, b: 1},
                {a: 1, b: 2},
                {a: 2, b: 3},
                {a: 1, b: 4}
            ];

            let result = TsStream.from(data)
                .dropWhile(t => t.a === 1)
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(2);
            expect(result[0].b).toBe(3);
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(4);

        }
    )
    it(
        'dropWhile via sample object (depth=2)', () => {

            let data = [
                {a: 1, b: 1, c: {x: "x1"}},
                {a: 1, b: 2, c: {x: "x1"}},
                {a: 2, b: 3, c: {x: "x3"}},
                {a: 1, b: 4, c: {x: "x1"}}
            ];

            let result = TsStream.from(data)
                .dropWhile(t => t.a === 1 && t.c.x === "x1")
                .toArray();

            expect(result.length).toBe(2);
            expect(result[0].a).toBe(2);
            expect(result[0].b).toBe(3);
            expect(result[0].c.x).toBe("x3");
            expect(result[1].a).toBe(1);
            expect(result[1].b).toBe(4);
            expect(result[1].c.x).toBe("x1");

        }
    )
})
