// @ts-nocheck
import {Collectors, TsStream} from "../src/TsStream";

describe('Constructors', () => {
    it('input array', () => {

        let input = [1, 2, 3];
        let result = TsStream.from(input).toArray();
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);

    })

    it('input undefined', () => {

        let result = TsStream.from(undefined).toArray();
        expect(result.length).toBe(0);

    })

    it('input null', () => {

        let result = TsStream.from(null).toArray();
        expect(result.length).toBe(0);

    })

    it('input makeshift iterator', () => {

        function iter() {
            let index = 0;

            return {
                next: function () {
                    if (index >= 10) return;
                    return {value: index++, done: (index >= 10)};
                }
            };
        }

        let input = iter();
        let result = TsStream.iterator(input)
            .filter((i) => {
                return i % 2 === 1;
            })
            .takeWhile(function (i) {
                return i < 7;
            })
            .toArray();

        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(3);
        expect(result[2]).toBe(5);

    })

    it('input object', () => {

        let input = {
            foo: 1, bar: 2, foobar: 3
        };

        let result = TsStream.from(input).toArray();
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);

    })

    it('input string', () => {

        let result = TsStream.chars("abcd")
            .filter(function (c) {
                return c !== 'b';
            })
            .map(function (c) {
                return c.toUpperCase();
            })
            .collect(Collectors.joining());

        expect(result).toBe("ACD")

    })

    it('from array', () => {

        let input = [1, 2, 3];
        let result = TsStream.from(input).toArray();
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);

    })

    it('from undefined', () => {

        let result = TsStream.from(undefined).toArray();
        expect(result.length).toBe(0);

    })

    it('from null', () => {

        let result = TsStream.from(null).toArray();
        expect(result.length).toBe(0);

    })

    it('from object', () => {

        let input = {
            foo: 1, bar: 2, foobar: 3
        };

        let result = TsStream.from(Object.values(input)).toArray();
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);

    })

    it('from string', () => {

        let result = TsStream.chars("abcd")
            .filter(function (c) {
                return c !== 'b';
            })
            .map(function (c) {
                return c.toUpperCase();
            })
            .collect(Collectors.joining());

        expect(result).toBe("ACD")

    })

    it('of', () => {

        let result = TsStream.of(1, 2, 3, 4)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return "odd" + num;
            })
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("odd1");
        expect(result[1]).toBe("odd3");

    })

    it('empty', () => {

        let result = TsStream.empty().toArray();
        expect(result.length).toBe(0);

    })

    it('range', () => {

        let result = TsStream.range(0, 4).toArray();
        expect(result.length).toBe(4);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(1);
        expect(result[2]).toBe(2);
        expect(result[3]).toBe(3);

    })

    it('rangeClosed', () => {

        let result = TsStream.range(0, 5).toArray();
        expect(result.length).toBe(5);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(1);
        expect(result[2]).toBe(2);
        expect(result[3]).toBe(3);
        expect(result[4]).toBe(4);

    })

    it('generate', () => {

        let result = TsStream
            .supplier(Math.random)
            .limit(10)
            .toArray();

        expect(result.length).toBe(10);

    })
})
