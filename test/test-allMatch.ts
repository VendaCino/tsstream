
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class AllMatch {
@test 'allMatch true'() {

    let result = TsStream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 0;
        });
    assert.equal(result, true);

}
@test 'allMatch false'() {

    let result = TsStream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);

}
@test 'allMatch empty'() {

    let result = TsStream([])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);

}
@test 'allMatch regexp true'() {

    let result = TsStream(["a1", "a2", "a3"])
        .allMatch(/a.*/);
    assert.equal(result, true);

}
@test 'allMatch regexp false'() {

    let result = TsStream(["a1", "a2", "b3"])
        .allMatch(/a.*/);
    assert.equal(result, false);

}
@test 'allMatch regexp empty'() {

    let result = TsStream([])
        .allMatch(/a.*/);
    assert.equal(result, true);

}
@test 'allMatch sample true'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .allMatch(t=>t.b===5);
    assert.equal(result, true);

}
@test 'allMatch sample false'() {

    let result = TsStream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .allMatch(t=>t.a===1);
    assert.equal(result, false);

}
@test 'allMatch sample empty'() {

    let result = TsStream([])
        .allMatch(t=>t.a===1);
    assert.equal(result, true);

}

}
