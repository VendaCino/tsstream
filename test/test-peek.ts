import {TsStream} from "../src/TsStream";

describe('Peek', () => {
    it('peek', () => {

        let poke: number[] = [];
        let result = TsStream.from([1, 2, 3, 4])
            .peek(function (num) {
                poke.push(num);
            })
            .toArray();

        expect(result.length).toBe(poke.length);
        expect(result[0]).toBe(poke[0]);
        expect(result[1]).toBe(poke[1]);
        expect(result[2]).toBe(poke[2]);
        expect(result[3]).toBe(poke[3]);

    })
    it('peek empty', () => {

        let poke: number[] = [];
        let result = TsStream.from([])
            .peek(function (num) {
                poke.push(num);
            })
            .toArray();

        expect(poke.length).toBe(0);
        expect(result.length).toBe(0);

    })
    it('peek console.log', () => {

        TsStream.from(["peek"])
            .peek(console.log)
            .toArray();

        expect(true).toBe(true);    // assert no error

    })
})
