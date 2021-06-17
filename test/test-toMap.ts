
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class toObjMap {
@test 'toObjMap'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = TsStream(data)
        .toObjMap( obj => obj["lastName"],obj => obj);

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);

}
@test 'toObjMap path'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = TsStream(data)
        .toObjMap(e=>e.lastName,e=>e);

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);

}
@test 'toObjMap empty'() {

    var map = TsStream([])
        .toObjMap(e=>e.lastName,e=>e);

    assert.equal(Object.keys(map).length, 0);

}
@test 'toObjMap duplicate key'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    assert.throws(function () {
        TsStream(data)
            .toObjMap(e=>e.lastName,e=>e);
    });

}
@test 'toObjMap duplicate key merge'() {

    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = TsStream(data)
        .toObjMap(e=>e.lastName,e=>e,
            (e1,_)=>e1);



    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[2]);

}

}
