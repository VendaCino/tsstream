
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class AnyMatch {
@test 'anyMatch true'() {

    var result = TsStream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 4;
        });
    assert.equal(result, true);

}
@test 'anyMatch false'() {

    var result = TsStream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 5;
        });
    assert.equal(result, false);

}
@test 'anyMatch empty'() {

    var result = TsStream([])
        .anyMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);

}
@test 'anyMatch regexp true'() {

    var result = TsStream(["a1", "a2", "a3"])
        .anyMatch(/a.*/);
    assert.equal(result, true);

}
@test 'anyMatch regexp false'() {

    var result = TsStream(["b1", "b2", "b3"])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch regexp empty'() {

    var result = TsStream([])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch sample true'() {

    var result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch(t=>t.a===1);
    assert.equal(result, true);

}
@test 'anyMatch sample false'() {

    var result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch(t=>t.a===4);
    assert.equal(result, false);

}
@test 'anyMatch sample empty'() {

    var result = TsStream([])
        .anyMatch(t=>t.a===1);
    assert.equal(result, false);

}

}
