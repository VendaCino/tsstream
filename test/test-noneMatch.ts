
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class NoneMatch {
@test 'noneMatch true'() {

    var result = TsStream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num < 0;
        });
    assert.equal(result, true);

}
@test 'noneMatch false'() {

    var result = TsStream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num > 3;
        });
    assert.equal(result, false);

}
@test 'noneMatch empty'() {

    var result = TsStream([])
        .noneMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);

}
@test 'noneMatch regexp true'() {

    var result = TsStream(["a1", "a2", "a3"])
        .noneMatch(/b.*/);
    assert.equal(result, true);

}
@test 'noneMatch regexp false'() {

    var result = TsStream(["b1", "a2", "b3"])
        .noneMatch(/a.*/);
    assert.equal(result, false);

}
@test 'noneMatch regexp empty'() {

    var result = TsStream([])
        .noneMatch(/a.*/);
    assert.equal(result, true);

}
@test 'noneMatch sample true'() {

    var result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch(t=>t.a===4);
    assert.equal(result, true);

}
@test 'noneMatch sample false'() {

    var result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch(t=>t.a===1);
    assert.equal(result, false);

}
@test 'noneMatch sample empty'() {

    var result = TsStream([])
        .noneMatch(t=>t.a===1);
    assert.equal(result, true);

}

}
