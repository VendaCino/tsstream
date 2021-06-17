
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {TsStream} from "../src/TsStream";

@suite
class Collect {
@test 'collect'() {

    var result = TsStream([1, 2, 3, 4]).collect<string,string>({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        },
        finisher: function (val) {
            return val + "!";
        }
    });

    assert.equal(result, "Data: 1 2 3 4 !");

}
@test 'collect without finisher'() {

    var result = TsStream.from([1, 2, 3, 4]).collect<string,string>({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        }
    });

    assert.equal(result, "Data: 1 2 3 4 ");

}
@test 'collect empty'() {

    var result = TsStream([]).collect({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        },
        finisher: function (val) {
            return val + "!";
        }
    });

    assert.equal(result, "Data: !");

}

}
