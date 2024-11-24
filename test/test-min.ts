import {TsStream} from "../src/TsStream";

describe('Min', () => {
    it('min', () => {
        let result = TsStream.from([1, 2, 3, 4]).min();
        expect(result).toBe(1);

    })
    it('min empty', () => {

        let result = TsStream.from([]).min();
        expect(result).toBe(null);

    })
    it(
        'min (comparator)', () => {

            let result = TsStream.from([1, 2, 3, 4])
                .min(function (a, b) {
                    if (a === b) return 0;
                    if (a > b) return -1;
                    return 1;
                });

            expect(result).toBe(4);

        }
    )

})
