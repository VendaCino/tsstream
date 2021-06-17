Dart Stream
=====================

A collection util inspired by java streams
<br>

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/VendaCino/dart_stream/main/LICENSE)


### Show Case
<img alt="loading" src="https://raw.githubusercontent.com/VendaCino/tsstream/main/doc/assets/example.gif" >

### Example

```typescript
let list = ["a1","a2","a3","b4","c5"];
TsStream.from(list).filter(e=>e.startsWith("a")).map(e=>e.substring(1))
    .toArray();

```

### Todo List
- [x] : shuffle
- [x] : reverse
- [x] : takeWhile
- [x] : dropWhile
- [ ] : more unit test
- [ ] : more async method

### See Also
* [Dart Stream](https://github.com/VendaCino/dart_stream)
* [Typescript Stream](https://github.com/VendaCino/tsstream)

### License

The MIT License, see [LICENSE](https://github.com/VendaCino/tsstream/raw/main/LICENSE).