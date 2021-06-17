
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Collectors, TsStream} from "../src/TsStream";

@suite
class Joining {
@test 'joining'() {
    var result = TsStream([1, 2, 3, 4]).collect(Collectors.joining());
    assert.equal(result, "1234");
}
@test 'joining empty'() {

    var result = TsStream([]).collect(Collectors.joining(','));
    assert.equal(result, "");

}

@test 'joining with delimiter'() {

    var result = TsStream([1, 2, 3, 4]).collect(Collectors.joining(','));
    assert.equal(result, "1,2,3,4");

}

}
