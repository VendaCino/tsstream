
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class ForEach {
@test 'forEach'() {

    let data = [];

    TsStream([1, 2, 3, 4])
        .forEach(function (num) {
            data.push(num);
        });

    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);

}
@test 'forEach empty'() {

    let called = false;

    TsStream([])
        .forEach(function () {
            called = true;
        });

    assert.equal(called, false);

}
@test 'forEach console.log'() {

    TsStream(["forEach"])
        .forEach(console.log);

    assert.ok(true);    // assert no error

}

}
