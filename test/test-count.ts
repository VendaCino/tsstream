
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Count {
@test 'count'() {

    let result = TsStream([1, 2, 3, 4]).count();
    assert.equal(result, 4);

}
@test 'count empty'() {

    let result = TsStream([]).count();
    assert.equal(result, 0);

}

}
