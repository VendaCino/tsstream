
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class Count {
@test 'count'() {

    var result = TsStream([1, 2, 3, 4]).count();
    assert.equal(result, 4);

}
@test 'count empty'() {

    var result = TsStream([]).count();
    assert.equal(result, 0);

}

}
