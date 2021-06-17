
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Sorted {
@test 'sorted'() {

    let result = TsStream([4, 1, 3, 2])
        .sorted()
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

}
@test 'sorted (comparator)'() {

    let result = TsStream([4, 1, 3, 2])
        .sorted(function (num1, num2) {
            if (num1 === num2) return 0;
            return num1 < num2 ? 1 : -1;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 4);
    assert.equal(result[1], 3);
    assert.equal(result[2], 2);
    assert.equal(result[3], 1);

}
@test 'sorted empty'() {

    let result = TsStream([])
        .sorted()
        .toArray();

    assert.equal(result.length, 0);

}


}
