import {TsStream} from "../src/TsStream";

describe('Max', () => {
    it('max', () => {

        let result = TsStream.from([1, 2, 3, 4]).max();

        expect(result).toBe(4);

    })
    it('max empty', () => {

        let result = TsStream.from([]).max();

        expect(result).toBe(null);

    })
    it('max (comparator)', () => {

            let result = TsStream.from([1, 2, 3, 4])
                .max(function (a, b) {
                    if (a === b) return 0;
                    if (a > b) return -1;
                    return 1;
                });

            expect(result).toBe(1);

        }
    )


})
