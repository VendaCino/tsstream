import {TsStream} from "../src/TsStream";

describe('Sorted', () => {
    it('sorted', () => {

        let result = TsStream.from([4, 1, 3, 2])
            .sorted()
            .toArray();

        expect(result.length).toBe(4);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
        expect(result[3]).toBe(4);

    })
    it(
        'sorted (comparator)', () => {

            let result = TsStream.from([4, 1, 3, 2])
                .sorted(function (num1, num2) {
                    if (num1 === num2) return 0;
                    return num1 < num2 ? 1 : -1;
                })
                .toArray();

            expect(result.length).toBe(4);
            expect(result[0]).toBe(4);
            expect(result[1]).toBe(3);
            expect(result[2]).toBe(2);
            expect(result[3]).toBe(1);

        }
    )
    it('sorted empty', () => {

        let result = TsStream.from([])
            .sorted()
            .toArray();

        expect(result.length).toBe(0);

    })

})
