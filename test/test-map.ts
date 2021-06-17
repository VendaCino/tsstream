
import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {TsStream} from "../src/TsStream";

@suite
class Map {
@test 'map num array'() {

    let data = [1, 2, 3, 4];

    let result = TsStream(data)
        .map(function (num) {
            return "obj" + num;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj2');
    assert.equal(result[2], 'obj3');
    assert.equal(result[3], 'obj4');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);

}
@test 'map object array'() {

    let data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    let result = TsStream(data)
        .map(function (obj) {
            return {b: obj.a};
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 2);
    assert.equal(result[2].b, 3);
    assert.equal(result[3].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);

}
@test 'map empty array'() {

    let result = TsStream([])
        .map(function (num) {
            return "obj" + num;
        })
        .toArray();

    assert.equal(result.length, 0);

}
@test 'map with null'() {

    let data = [1, null, undefined, 4];

    let result = TsStream(data)
        .map(function (val) {
            return "map_" + val;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'map_1');
    assert.equal(result[1], 'map_null');
    assert.equal(result[2], 'map_undefined');
    assert.equal(result[3], 'map_4');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], null);
    assert.equal(data[2], undefined);
    assert.equal(data[3], 4);

}


}
