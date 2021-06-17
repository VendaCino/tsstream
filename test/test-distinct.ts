
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Distinct {
@test 'distinct'() {

    let result = TsStream([1, 3, 3, 1])
        .distinct()
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

}
@test 'distinct empty'() {

    let result = TsStream([])
        .distinct()
        .toArray();

    assert.equal(result.length, 0);

}

}
