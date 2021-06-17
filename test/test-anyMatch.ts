
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class AnyMatch {
@test 'anyMatch true'() {

    let result = TsStream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 4;
        });
    assert.equal(result, true);

}
@test 'anyMatch false'() {

    let result = TsStream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 5;
        });
    assert.equal(result, false);

}
@test 'anyMatch empty'() {

    let result = TsStream([])
        .anyMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);

}
@test 'anyMatch regexp true'() {

    let result = TsStream(["a1", "a2", "a3"])
        .anyMatch(/a.*/);
    assert.equal(result, true);

}
@test 'anyMatch regexp false'() {

    let result = TsStream(["b1", "b2", "b3"])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch regexp empty'() {

    let result = TsStream([])
        .anyMatch(/a.*/);
    assert.equal(result, false);

}
@test 'anyMatch sample true'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch(t=>t.a===1);
    assert.equal(result, true);

}
@test 'anyMatch sample false'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch(t=>t.a===4);
    assert.equal(result, false);

}
@test 'anyMatch sample empty'() {

    let result = TsStream([])
        .anyMatch(t=>t.a===1);
    assert.equal(result, false);

}

}
