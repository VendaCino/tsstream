
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class Slice {
@test 'slice'() {

    var result = TsStream([1, 2, 3, 4])
        .slice(1, 3)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 2);
    assert.equal(result[1], 3);

}
@test 'slice empty'() {

    var result = TsStream([])
        .slice(1, 2)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'slice high'() {

    var result = TsStream([1, 2, 3, 4])
        .slice(10, 20)
        .toArray();

    assert.equal(result.length, 0);

}
}
