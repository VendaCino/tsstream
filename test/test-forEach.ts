import {TsStream} from "../src/TsStream";

describe('ForEach', () => {
    it('forEach', () => {

        let data: number[] = [];

        TsStream.from([1, 2, 3, 4])
            .forEach(function (num) {
                data.push(num);
            });

        expect(data.length).toBe(4);
        expect(data[0]).toBe(1);
        expect(data[1]).toBe(2);
        expect(data[2]).toBe(3);
        expect(data[3]).toBe(4);

    })
    it('forEach empty', () => {

        let called = false;

        TsStream.from([])
            .forEach(function () {
                called = true;
            });

        expect(called).toBe(false);

    })
    it(
        'forEach console.log', () => {

            TsStream.from(["forEach"])
                .forEach(console.log);

            expect(true).toBe(true);    // assert no error

        }
    )
})
