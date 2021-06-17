// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$


import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {Collectors, TsStream} from "../src/TsStream";

let persons = [
    {name: "Max", age: 18},
    {name: "Peter", age: 23},
    {name: "Pamela", age: 23},
    {name: "David", age: 12}
];

@suite
class Introductiones6 {
@test 'sample 1'() {

    let myList = ["a1", "a2", "b1", "c2", "c1"];

    let result = TsStream(myList)
        .filter(s => s.indexOf("c") === 0)
        .map(s => s.toUpperCase())
        .sorted()
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "C1");
    assert.equal(result[1], "C2");

}
@test 'sample 2'() {

    let r1 = TsStream(["a1", "a2", "a3"])
        .findFirst();
    assert.equal(r1, "a1");

    r1 = TsStream.of("a1", "a2", "a3")
        .findFirst();
    assert.equal(r1, "a1");

    let result = TsStream
        .range(1, 4)
        .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);

}
@test 'sample 3'() {

    let avg = TsStream.of(1, 2, 3)
        .map(n => 2 * n + 1)
        .average();
    assert.equal(avg, 5.0)

}
@test 'sample 4'() {

    let max = TsStream.of("a1", "a2", "a3")
        .map(s => s.slice(1))
        .map(s => parseInt(s, 10))
        .max()
    assert.equal(max, 3);

}
@test 'sample 5'() {

    TsStream.of("a1", "b2", "c3")
        .filter(s => {
            console.log("filtering: %s", s);
            assert.ok(false);
            return true;
        });

    assert.ok(true);

}
@test 'sample 6'() {

    let ops = [];

    TsStream.of("a1", "b2", "c3")
        .filter(s => {
            ops.push("filter: " + s);
            return true;
        })
        .forEach(s => ops.push("forEach: " + s));

    assert.equal(ops.length, 6);
    assert.equal(ops[0], "filter: a1");
    assert.equal(ops[1], "forEach: a1");
    assert.equal(ops[2], "filter: b2");
    assert.equal(ops[3], "forEach: b2");
    assert.equal(ops[4], "filter: c3");
    assert.equal(ops[5], "forEach: c3");

}
@test 'sample 6-2'() {

    let ops = [];

    TsStream.of("d2", "a2", "b1", "b3", "c")
        .map(s => {
            ops.push("map: " + s);
            return s.toUpperCase();
        })
        .anyMatch(s => {
            ops.push("anyMatch: " + s);
            return s.indexOf("A") === 0;
        });

    assert.equal(ops.length, 4);
    assert.equal(ops[0], "map: d2");
    assert.equal(ops[1], "anyMatch: D2");
    assert.equal(ops[2], "map: a2");
    assert.equal(ops[3], "anyMatch: A2");

}
@test 'sample 7'() {

    let ops = [];

    TsStream.of("d2", "a2", "b1", "b3", "c")
        .filter(s => {
            ops.push("filter: " + s);
            return s.indexOf("a") === 0;
        })
        .map(s => {
            ops.push("map: " + s);
            return s.toUpperCase();
        })
        .forEach(s => ops.push("forEach: " + s));

    assert.equal(ops.length, 7);
    assert.equal(ops[0], "filter: d2");
    assert.equal(ops[1], "filter: a2");
    assert.equal(ops[2], "map: a2");
    assert.equal(ops[3], "forEach: A2");
    assert.equal(ops[4], "filter: b1");
    assert.equal(ops[5], "filter: b3");
    assert.equal(ops[6], "filter: c");

}
@test 'sample 8'() {

    assert.throws(function () {
        let stream = TsStream.of(1, 2, 3)
            .filter(n => n % 2 === 1);

        stream.anyMatch(n => true);     // ok
        stream.toArray();               // error
    });

}
@test 'sample 9'() {

    let odd = (array:Array<number>) =>
        TsStream(array).filter(n => n % 2 === 1);

    assert.equal(odd([1, 2, 3]).anyMatch(n => true), true);
    assert.equal(odd([1, 2, 3]).toArray().length, 2);
}

@test 'sample 10'() {

    let avg = TsStream(persons)
        .map(p => p.age)
        .average();

    assert.equal(avg, 19);

    avg = TsStream(persons)
        .map(e=>e.age)
        .average();

    assert.equal(avg, 19);

}
@test 'sample 11'() {

    let phrase = TsStream(persons)
        .filter(p => p.age >= 18)
        .map(p => p.name)
        .collect(Collectors.joining(" | "));

    assert.equal(phrase, 'Max | Peter | Pamela');

}
@test 'sample 12'() {

    let result = TsStream(persons)
        .collect({
            supplier: () => '[',
            accumulator: (s, p) => s + ' ' + p.name.toUpperCase(),
            finisher: (s) => s + ' ]'
        });

    assert.equal(result, "[ MAX PETER PAMELA DAVID ]");

}
@test 'sample 13'() {

    let oldest = TsStream(persons)
        .reduce0((p1, p2) => p1.age > p2.age ? p1 : p2);
    assert.equal(oldest.name, "Pamela");

}
@test 'sample 13-2'() {

    let result = TsStream(persons)
        .sorted((e1,e2)=>e1.age-e2.age)
        .reverse()
        .reduce({names: [], sumOfAges: 0}, (res, p) => {
            res.names.push(p.name);
            res.sumOfAges += p.age;
            return res;
        });

    assert.equal(result.names.length, 4);
    assert.equal(result.names[0], "Pamela");
    assert.equal(result.names[1], "Peter");
    assert.equal(result.names[2], "Max");
    assert.equal(result.names[3], "David");
    assert.equal(result.sumOfAges, 76);

}

}
