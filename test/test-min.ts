
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class Min {
@test 'min'() {
    var result = TsStream([1, 2, 3, 4]).min();
    assert.equal(result, 1);

}
@test 'min empty'() {

    var result = TsStream([]).min();
    assert.equal(result, null);

}
@test 'min (comparator)'() {

    var result = TsStream([1, 2, 3, 4])
        .min(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, 4);

}


}
