
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class NoneMatch {
@test 'noneMatch true'() {

    let result = TsStream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num < 0;
        });
    assert.equal(result, true);

}
@test 'noneMatch false'() {

    let result = TsStream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num > 3;
        });
    assert.equal(result, false);

}
@test 'noneMatch empty'() {

    let result = TsStream([])
        .noneMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);

}
@test 'noneMatch regexp true'() {

    let result = TsStream(["a1", "a2", "a3"])
        .noneMatch(/b.*/);
    assert.equal(result, true);

}
@test 'noneMatch regexp false'() {

    let result = TsStream(["b1", "a2", "b3"])
        .noneMatch(/a.*/);
    assert.equal(result, false);

}
@test 'noneMatch regexp empty'() {

    let result = TsStream([])
        .noneMatch(/a.*/);
    assert.equal(result, true);

}
@test 'noneMatch sample true'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch(t=>t.a===4);
    assert.equal(result, true);

}
@test 'noneMatch sample false'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .noneMatch(t=>t.a===1);
    assert.equal(result, false);

}
@test 'noneMatch sample empty'() {

    let result = TsStream([])
        .noneMatch(t=>t.a===1);
    assert.equal(result, true);

}

}
