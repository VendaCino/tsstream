
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class FindFirst {
@test 'findFirst'() {

    var result = TsStream([1, 2, 3, 4])
        .filter(function (num) {
            return num % 2 === 0;
        })
        .findFirst();

    assert.equal(result, 2);

}
@test 'findFirst empty'() {

    var result = TsStream([]).findFirst();
    assert.equal(result, null);

}
@test 'findFirst object'() {

    var result = TsStream({a: 1, b: 2}).findFirst();

    assert.equal(result, 1);

}

}
