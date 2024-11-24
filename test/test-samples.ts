// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$


import {Collectors, TsStream} from "../src/TsStream";

let persons = [
    {name: "Max", age: 18},
    {name: "Peter", age: 23},
    {name: "Pamela", age: 23},
    {name: "David", age: 12}
];

describe('Introductiones6', () => {
    it('sample 1', () => {

        let myList = ["a1", "a2", "b1", "c2", "c1"];

        let result = TsStream.from(myList)
            .filter(s => s.indexOf("c") === 0)
            .map(s => s.toUpperCase())
            .sorted()
            .toArray();

        expect(result.length).toBe(2);
        expect(result[0]).toBe("C1");
        expect(result[1]).toBe("C2");

    })
    it('sample 2', () => {

        let r1 = TsStream.from(["a1", "a2", "a3"])
            .findFirst();
        expect(r1).toBe("a1");

        r1 = TsStream.of("a1", "a2", "a3")
            .findFirst();
        expect(r1).toBe("a1");

        let result = TsStream
            .range(1, 4)
            .toArray();

        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);

    })
    it('sample 3', () => {

        let avg = TsStream.of(1, 2, 3)
            .map(n => 2 * n + 1)
            .average();
        expect(avg).toBe(5.0);

    })
    it('sample 4', () => {

        let max = TsStream.of("a1", "a2", "a3")
            .map(s => s.slice(1))
            .map(s => parseInt(s, 10))
            .max()
        expect(max).toBe(3);

    })
    it('sample 5', () => {

        TsStream.of("a1", "b2", "c3")
            .filter(s => {
                console.log("filtering: %s", s);
                return true;
            });

    })
    it('sample 6', () => {

        let ops: string[] = [];

        TsStream.of("a1", "b2", "c3")
            .filter(s => {
                ops.push("filter: " + s);
                return true;
            })
            .forEach(s => ops.push("forEach: " + s));

        expect(ops.length).toBe(6);
        expect(ops[0]).toBe("filter: a1");
        expect(ops[1]).toBe("forEach: a1");
        expect(ops[2]).toBe("filter: b2");
        expect(ops[3]).toBe("forEach: b2");
        expect(ops[4]).toBe("filter: c3");
        expect(ops[5]).toBe("forEach: c3");

    })
    it(
        'sample 6-2', () => {

            let ops: string[] = [];

            TsStream.of("d2", "a2", "b1", "b3", "c")
                .map(s => {
                    ops.push("map: " + s);
                    return s.toUpperCase();
                })
                .anyMatch(s => {
                    ops.push("anyMatch: " + s);
                    return s.indexOf("A") === 0;
                });

            expect(ops.length).toBe(4);
            expect(ops[0]).toBe("map: d2");
            expect(ops[1]).toBe("anyMatch: D2");
            expect(ops[2]).toBe("map: a2");
            expect(ops[3]).toBe("anyMatch: A2");

        }
    )
    it('sample 7', () => {

        let ops: string[] = [];

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

        expect(ops.length).toBe(7);
        expect(ops[0]).toBe("filter: d2");
        expect(ops[1]).toBe("filter: a2");
        expect(ops[2]).toBe("map: a2");
        expect(ops[3]).toBe("forEach: A2");
        expect(ops[4]).toBe("filter: b1");
        expect(ops[5]).toBe("filter: b3");
        expect(ops[6]).toBe("filter: c");

    })
    it('sample 8', () => {

        expect(function () {
            let stream = TsStream.of(1, 2, 3)
                .filter(n => n % 2 === 1);

            stream.anyMatch(n => true);     // ok
            stream.toArray();               // error
        }).toThrow();

    })
    it('sample 9', () => {

        let odd = (array: Array<number>) =>
            TsStream.from(array).filter(n => n % 2 === 1);

        expect(odd([1, 2, 3]).anyMatch(n => true)).toBe(true);
        expect(odd([1, 2, 3]).toArray().length).toBe(2);
    })
    it('sample 10', () => {

        let avg = TsStream.from(persons)
            .map(p => p.age)
            .average();

        expect(avg).toBe(19);

        avg = TsStream.from(persons)
            .map(e => e.age)
            .average();

        expect(avg).toBe(19);

    })
    it('sample 11', () => {

        let phrase = TsStream.from(persons)
            .filter(p => p.age >= 18)
            .map(p => p.name)
            .collect(Collectors.joining(" | "));

        expect(phrase).toBe('Max | Peter | Pamela');

    })
    it('sample 12', () => {

        let result = TsStream.from(persons)
            .collect({
                supplier: () => '[',
                accumulator: (s, p) => s + ' ' + p.name.toUpperCase(),
                finisher: (s) => s + ' ]'
            });

        expect(result).toBe("[ MAX PETER PAMELA DAVID ]")

    })
    it('sample 13', () => {

        let oldest = TsStream.from(persons)
            .reduce0((p1, p2) => p1.age > p2.age ? p1 : p2);
        // @ts-ignore
        expect(oldest.name).toBe("Pamela");

    })
    it('sample 13-2', () => {

        let result = TsStream.from(persons)
            .sorted((e1, e2) => e1.age - e2.age)
            .reverse()
            // @ts-ignore
            .reduce({names: [], sumOfAges: 0}, (res, p) => {
                // @ts-ignore
                res.names.push(p.name);
                res.sumOfAges += p.age;
                return res;
            });

        expect(result.names.length).toBe(4);
        expect(result.names[0]).toBe("Pamela");
        expect(result.names[1]).toBe("Peter");
        expect(result.names[2]).toBe("Max");
        expect(result.names[3]).toBe("David");
        expect(result.sumOfAges).toBe(76);

    })
})
