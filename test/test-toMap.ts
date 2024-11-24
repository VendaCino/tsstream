import {TsStream} from "../src/TsStream";

describe('ToObjMapTest', () => {
    it('toObjMap', () => {

        let data = [
            {firstName: "Peter", lastName: "Parker"},
            {firstName: "John", lastName: "Doe"}
        ];

        let map = TsStream.from(data)
            .toObjMap(obj => obj["lastName"], obj => obj);

        expect(map.hasOwnProperty("Parker")).toBe(true);
        expect(map.hasOwnProperty("Doe")).toBe(true);
        expect(map["Parker"]).toBe(data[0]);
        expect(map["Doe"]).toBe(data[1]);

    })
    it('toObjMap path', () => {

        let data = [
            {firstName: "Peter", lastName: "Parker"},
            {firstName: "John", lastName: "Doe"}
        ];

        let map = TsStream.from(data)
            .toObjMap(e => e.lastName, e => e);

        expect(map.hasOwnProperty("Parker")).toBe(true);
        expect(map.hasOwnProperty("Doe")).toBe(true);
        expect(map["Parker"]).toBe(data[0]);
        expect(map["Doe"]).toBe(data[1]);

    })
    it('toObjMap empty', () => {

        let map = TsStream.from([])
            // @ts-ignore
            .toObjMap(e => e.lastName, e => e);

        expect(Object.keys(map).length).toBe(0);

    })
    it('toObjMap duplicate key', () => {

        let data = [
            {firstName: "Peter", lastName: "Parker"},
            {firstName: "Sandra", lastName: "Parker"},
            {firstName: "John", lastName: "Doe"}
        ];

        expect(function () {
            TsStream.from(data)
                .toObjMap(e => e.lastName, e => e);
        }).toThrow();

    })
    it('toObjMap duplicate key merge', () => {

        let data = [
            {firstName: "Peter", lastName: "Parker"},
            {firstName: "Sandra", lastName: "Parker"},
            {firstName: "John", lastName: "Doe"}
        ];

        let map = TsStream.from(data)
            .toObjMap(e => e.lastName, e => e,
                (e1, _) => e1);


        expect(map.hasOwnProperty("Parker")).toBe(true);
        expect(map.hasOwnProperty("Doe")).toBe(true);
        expect(map["Parker"]).toBe(data[0]);
        expect(map["Doe"]).toBe(data[2]);

    })
})
