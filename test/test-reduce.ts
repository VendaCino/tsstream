
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class Reduce {
@test 'reduce'() {

    var result = TsStream([1, 2, 3, 4])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1010);

}
@test 'reduce empty'() {

    var result = TsStream([])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1000);

}
@test 'reduce first'() {

    var result = TsStream([1, 2, 3, 4])
        .reduce0(function (identity, num) {
            return identity * num;
        });
    assert.equal(result, 24);

}
@test 'reduce first empty'() {

    var result = TsStream([])
        .reduce0(function (identity, num) {
            return identity * num;
        }) ??("NOTHING");
    assert.equal(result, "NOTHING");

}

}
