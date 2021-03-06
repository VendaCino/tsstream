
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Limit {
@test 'limit'() {

    let result = TsStream([1, 2, 3, 4])
        .limit(2)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);

}
@test 'limit empty'() {

    let result = TsStream([])
        .limit(1)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'limit high'() {

    let result = TsStream([1, 2, 3, 4])
        .limit(10)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

}
@test 'limit zero'() {

    let result = TsStream([1, 2, 3, 4])
        .limit(0)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'limit negative'() {

    let result = TsStream([1, 2, 3, 4])
        .limit(-1)
        .toArray();

    assert.equal(result.length, 0);

}

}
