
import {suite, test} from '@testdeck/mocha';
import chai,{ assert } from 'chai';
import {Collectors, TsStream} from "../src/TsStream";

@suite
class Constructors {
@test 'input array'() {

    var input = [1, 2, 3];
    var result = TsStream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'input undefined'() {

    var result = TsStream(undefined).toArray();
    assert.equal(result.length, 0);

}
@test 'input null'() {

    var result = TsStream(null).toArray();
    assert.equal(result.length, 0);

}
@test 'input makeshift iterator'() {

  function iter(){
    var index = 0;

    return {
       next: function(){
           if (index >= 10) return;
           return { value: index++, done: (index >= 10) };
       }
    };
  }

  var input = iter();
  var result = TsStream.iterator(input)
    .filter((i) => {
        return i % 2 === 1;
    })
    .takeWhile(function(i) {
        return i < 7;
    })
    .toArray();

  assert.equal(result.length, 3);
  assert.equal(result[0], 1);
  assert.equal(result[1], 3);
  assert.equal(result[2], 5);

}

@test 'input object'() {

    var input = {
        foo: 1, bar: 2, foobar: 3
    };

    var result = TsStream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'input string'() {

    var result = TsStream.chars("abcd")
        .filter(function (c) {
            return c !== 'b';
        })
        .map(function (c) {
            return c.toUpperCase();
        })
        .collect(Collectors.joining());

    assert.equal(result, "ACD");

}
@test 'from array'() {

    var input = [1, 2, 3];
    var result = TsStream.from(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'from undefined'() {

    var result = TsStream.from(undefined).toArray();
    assert.equal(result.length, 0);

}
@test 'from null'() {

    var result = TsStream.from(null).toArray();
    assert.equal(result.length, 0);

}
@test 'from object'() {

    var input = {
        foo: 1, bar: 2, foobar: 3
    };

    var result = TsStream.from(Object.values(input)).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'from string'() {

    var result = TsStream.chars("abcd")
        .filter(function (c) {
            return c !== 'b';
        })
        .map(function (c) {
            return c.toUpperCase();
        })
        .collect(Collectors.joining());

    assert.equal(result, "ACD");

}
@test 'of'() {

    var result = TsStream.of(1, 2, 3, 4)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .map(function (num) {
            return "odd" + num;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "odd1");
    assert.equal(result[1], "odd3");

}
@test 'empty'() {

    var result = TsStream.empty().toArray();
    assert.equal(result.length, 0);

}
@test 'range'() {

    var result = TsStream.range(0, 4).toArray();
    assert.equal(result.length, 4);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);

}
@test 'rangeClosed'() {

    var result = TsStream.range(0, 5).toArray();
    assert.equal(result.length, 5);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);
    assert.equal(result[4], 4);

}
@test 'generate'() {

    var result = TsStream
        .supplier(Math.random)
        .limit(10)
        .toArray();

    assert.equal(result.length, 10);

}
}
