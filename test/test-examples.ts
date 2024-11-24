// @ts-nocheck
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
            // @ts-ignore
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


import {Collectors, TsStream} from "../src/TsStream";

describe('Examples', () => {
    it(
        'filter - flatMap - map - distinct - filter - join', () => {

            // @ts-ignore
            let people = [];

            let names = TsStream.from(people)
                .filter(t => t.married)
                .flatMap(t => t["children"])
                .map(t => t["firstName"])
                .distinct()
                .filter(/a.*/i)
                .collect(Collectors.joining(", "));

            expect(names).toBe("");

        }
    )
    it(
        'filter - map - toArray', () => {

            let numFilter = 0;
            let numMap = 0;

            let data = [1, 2, 3, 4];

            let result =
                TsStream.from(data)
                    .filter(function (num) {
                        numFilter++;
                        return num % 2 === 1;
                    })
                    .map(function (num) {
                        numMap++;
                        return "obj" + num;
                    })
                    .toArray();

            expect(result.length).toBe(2);
            expect(result[0]).toBe('obj1');
            expect(result[1]).toBe('obj3');
            expect(numFilter).toBe(4);
            expect(numMap).toBe(2);

            // assert original data is untouched
            expect(data.length).toBe(4);
            expect(data[0]).toBe(1);
            expect(data[1]).toBe(2);
            expect(data[2]).toBe(3);
            expect(data[3]).toBe(4);

        }
    )
    it(
        'parent / children 1', () => {

            let parents = createParents(5, 3);

            expect(parents.length).toBe(5);

            for (let i = 0; i < parents.length; i++) {
                let parent = parents[i];
                expect(parent.parentId).toBe(i);
                expect(parent.type).toBe('parent');
                expect(parent.children.length).toBe(3);
                for (let j = 0; j < parent.children.length; j++) {
                    let child = parent.children[j];
                    expect(child.childId).toBe(j);
                    expect(child.type).toBe('child');
                    expect(child.parent).toBe(parent);
                }
            }

        }
    )
    it(
        'parent / children 2', () => {

            let parents = createParents(5, 3);

            let children = TsStream.from(parents)
                .filter(function (p) {
                    return p.parentId > 2;
                })
                .flatMap(function (p) {
                    return p.children;
                })
                .toArray();

            expect(children.length).toBe(6);
            expect(children[0].childId).toBe(0);
            expect(children[1].childId).toBe(1);
            expect(children[2].childId).toBe(2);
            expect(children[3].childId).toBe(0);
            expect(children[4].childId).toBe(1);
            expect(children[5].childId).toBe(2);

        }
    )
})
