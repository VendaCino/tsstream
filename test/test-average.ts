
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Average {
@test 'average'() {

    let result = TsStream([1, 2, 3, 4]).average();

    assert.equal(result, 2.5);

}
@test 'average empty'() {

    let result = TsStream([]).average();
    assert.equal(result, null);

}

}
