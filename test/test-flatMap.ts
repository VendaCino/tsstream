
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class FlatMap {
@test 'flatMap num array'() {

    let data = [1, 2, 3];

    let result = TsStream(data)
        .flatMap(function (num) {
            return [num, num];
        })
        .toArray();

    assert.equal(result.length, 6);
    assert.equal(result[0], 1);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 2);
    assert.equal(result[4], 3);
    assert.equal(result[5], 3);

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);

}
@test 'flatMap object array'() {

    let data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    let result = TsStream(data)
        .flatMap(function (obj) {
            return [{b: obj.a}, {b: obj.a}];
        })
        .toArray();

    assert.equal(result.length, 8);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 1);
    assert.equal(result[2].b, 2);
    assert.equal(result[3].b, 2);
    assert.equal(result[4].b, 3);
    assert.equal(result[5].b, 3);
    assert.equal(result[6].b, 4);
    assert.equal(result[7].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);

}
@test 'flatMap empty array'() {

    let result = TsStream([])
        .flatMap(function (num) {
            return [num, num];
        })
        .toArray();

    assert.equal(result.length, 0);

}

}
