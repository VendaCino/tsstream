
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Sum {
@test 'sum'() {

    let result = TsStream([1, 2, 3, 4]).sum();
    assert.equal(result, 10);

}
@test 'sum empty'() {

    let result = TsStream([]).sum();
    assert.equal(result, 0);

}

}
