
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Skip {
@test 'skip'() {

    let result = TsStream([1, 2, 3, 4])
        .skip(2)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 3);
    assert.equal(result[1], 4);

}
@test 'skip empty'() {

    let result = TsStream([])
        .skip(1)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'skip high'() {

    let result = TsStream([1, 2, 3, 4])
        .skip(10)
        .toArray();

    assert.equal(result.length, 0);

}
@test 'skip zero'() {

    let result = TsStream([1, 2, 3, 4])
        .skip(0)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

}
@test 'skip negative'() {

    let result = TsStream([1, 2, 3, 4])
        .skip(-1)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

}

}
