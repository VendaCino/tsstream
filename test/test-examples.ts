
let createParents = function (numParents, numChildren) {
    return TsStream
        .range(0, numParents)
        .map(function (num) {
            return {
                parentId: num,
                type: 'parent',
                children: []
            };
        })
        .peek(function (parent) {
            parent.children = TsStream
                .range(0, numChildren)
                .map(function (num) {
                    return {
                        childId: num,
                        type: 'child',
                        parent: parent
                    };
                })
                .toArray();
        })
        .toArray();
};



import {suite, test} from "@testdeck/mocha";
import chai,{ assert } from "chai";
import {Collectors, TsStream} from "../src/TsStream";

@suite
class Examples {
@test 'filter - flatMap - map - distinct - filter - join'() {

    let people = [];

    let names = TsStream(people)
        .filter(t=>t.married)
        .flatMap(t=>t["children"])
        .map(t=>t["firstName"])
        .distinct()
        .filter(/a.*/i)
        .collect(Collectors.joining(", "));

    assert.equal(names, "");

}
@test 'filter - map - toArray'() {

    let numFilter = 0;
    let numMap = 0;

    let data = [1, 2, 3, 4];

    let result =
        TsStream(data)
            .filter(function (num) {
                numFilter++;
                return num % 2 === 1;
            })
            .map(function (num) {
                numMap++;
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj3');
    assert.equal(numFilter, 4);
    assert.equal(numMap, 2);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);

}
@test 'parent / children 1'() {

    let parents = createParents(5, 3);

    assert.equal(parents.length, 5);

    for (let i = 0; i < parents.length; i++) {
        let parent = parents[i];
        assert.equal(parent.parentId, i);
        assert.equal(parent.type, 'parent');
        assert.equal(parent.children.length, 3);
        for (let j = 0; j < parent.children.length; j++) {
            let child = parent.children[j];
            assert.equal(child.childId, j);
            assert.equal(child.type, 'child');
            assert.equal(child.parent, parent);
        }
    }

}
@test 'parent / children 2'() {

    let parents = createParents(5, 3);

    let children = TsStream(parents)
        .filter(function (p) {
            return p.parentId > 2;
        })
        .flatMap(function (p) {
            return p.children;
        })
        .toArray();

    assert.equal(children.length, 6);
    assert.equal(children[0].childId, 0);
    assert.equal(children[1].childId, 1);
    assert.equal(children[2].childId, 2);
    assert.equal(children[3].childId, 0);
    assert.equal(children[4].childId, 1);
    assert.equal(children[5].childId, 2);

}

}
