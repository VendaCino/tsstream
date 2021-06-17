
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {Collectors, TsStream} from "../src/TsStream";

@suite
class Joining {
@test 'joining'() {
    let result = TsStream([1, 2, 3, 4]).collect(Collectors.joining());
    assert.equal(result, "1234");
}
@test 'joining empty'() {

    let result = TsStream([]).collect(Collectors.joining(','));
    assert.equal(result, "");

}

@test 'joining with delimiter'() {

    let result = TsStream([1, 2, 3, 4]).collect(Collectors.joining(','));
    assert.equal(result, "1,2,3,4");

}

}
