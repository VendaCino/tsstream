
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Max {
@test 'max'() {

    let result = TsStream([1, 2, 3, 4]).max();

    assert.equal(result, 4);

}
@test 'max empty'() {

    let result = TsStream([]).max();

    assert.equal(result, null);

}
@test 'max (comparator)'() {

    let result = TsStream([1, 2, 3, 4])
        .max(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, 1);

}



}
