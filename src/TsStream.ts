//----------API-------

export type StreamInput<T> = T[] | Object;

export function TsStream<T>(obj: StreamInput<T>): DartStream<T> {
  if (obj instanceof Array) return TsStream.from(obj);
  else if (obj instanceof Object) return TsStream<T>(Object.values(obj));
  else return new _Head<T, T>(null, _OpFlag.IS_SIZED, new _EmptyIterator<T>());
}

TsStream.chars = function (str: string): DartStream<String> {
  return new _Head<String, String>(
    null,
    _OpFlag.IS_SIZED,
    new _StringIterator(str),
  );
};
TsStream.from = function <T>(list: Array<T>): DartStream<T> {
  if (list === null || list === undefined) list = [];
  if (!Array.isArray(list)) list = Object.values(list);
  return new _Head<T, T>(null, _OpFlag.IS_SIZED, new _ArrayIterator<T>(list));
};

TsStream.of = function <T>(...list: Array<T>): DartStream<T> {
  return TsStream.from(list);
};

TsStream.supplier = function <T>(supplier: JSupplier<T>): DartStream<T> {
  return new _Head<T, T>(
    null,
    _OpFlag.NOT_SIZED,
    new _SupplierIterator<T>(supplier),
  );
};

TsStream.one = function <T>(value: T): DartStream<T> {
  return new _Head<T, T>(null, _OpFlag.IS_SIZED, new _ValueIterator<T>(value));
};

TsStream.iterator = function <T>(iterator: Iterator<T>): DartStream<T> {
  return new _Head<T, T>(
    null,
    _OpFlag.NOT_SIZED,
    new _IteratorIterator<T>(iterator),
  );
};

TsStream.empty = function <T>(): DartStream<T> {
  return new _Head<T, T>(null, _OpFlag.IS_SIZED, new _EmptyIterator<T>());
};

TsStream.range = function (start: number, end: number): DartStream<number> {
  let a = Array(end - start).fill(0);
  for (let i = 0; i < a.length; ++i) a[i] = i + start;
  return TsStream(a);
};

//-------DartStream--------
interface DartStream<T> {
  //-----Operation-------

  filter(predicate: JPredicate<T>): DartStream<T>;

  map<R>(mapper: JFunction<T, R>): DartStream<R>;

  flatMap<R>(mapper: JFunction<T, DartStream<R>>): DartStream<R>;

  distinct(): DartStream<T>;

  sorted(comparator?: JComparator<T>): DartStream<T>;

  peek(action: JConsumer<T>): DartStream<T>;

  limit(maxSize: number): DartStream<T>;

  skip(n: number): DartStream<T>;

  shuffle(): DartStream<T>;

  reverse(): DartStream<T>;

  takeWhile(predicate: JPredicate<T>): DartStream<T>;

  dropWhile(predicate: JPredicate<T>): DartStream<T>;

  // -----Terminal Operation-------
  toArray(): Array<T>;

  reduce0(accumulator: JBinaryOperator<T>): T | null;

  reduce<R>(identity: R, accumulator: JBiFunction<R, T, R>): R;

  collect<R, A>(collector: Collector<T, A, R>): R;

  min(comparator?: JComparator<T>): T | null;

  max(comparator?: JComparator<T>): T | null;

  count(): number;

  anyMatch(predicate: JPredicate<T>): boolean;

  allMatch(predicate: JPredicate<T>): boolean;

  noneMatch(predicate: JPredicate<T>): boolean;

  findFirst(): T | null;

  findAny(): T | null;

  forEach(action: JConsumer<T>): void;
}

//-------FUnctions-------
interface JPredicate<T> {
  (elem: T): boolean;
}

interface JSupplier<T> {
  (): T;
}

interface JFunction<T, U> {
  (elem: T): U;
}

interface JBiFunction<T, U, R> {
  (t: T, u: U): R;
}

interface JBinaryOperator<T> {
  (t: T, u: T): T;
}

interface JBiConsumer<T, U> {
  (t: T, u: U): void;
}

interface JComparator<T> {
  (e1: T, e2: T): number;
}

interface JConsumer<T> {
  (elem: T): void;
}

interface Collector<T, A, R> {
  supplier: JSupplier<A>;
  accumulator: JBiFunction<A, T, A>;
  finisher?: JFunction<A, R>;
}

//-----------------collector-----------------

class _Collector<T, A, R> implements Collector<T, A, R> {
  supplier: JSupplier<A>;
  accumulator: JBiFunction<A, T, A>;
  finisher: JFunction<A, R>;

  constructor(
    supplier: JSupplier<A>,
    accumulator: JBiFunction<A, T, A>,
    finisher: JFunction<A, R>,
  ) {
    this.supplier = supplier;
    this.accumulator = accumulator;
    this.finisher = finisher;
  }
}

export interface ObjMap<T> {
  [index: string]: T;
}

export class Collectors {
  static toList<T>(): Collector<T, Array<T>, Array<T>> {
    return new _Collector<T, Array<T>, Array<T>>(
      () => [],
      (l, r) => {
        l.push(r);
        return l;
      },
      (t) => t,
    );
  }

  static joining(delimiter?: string): Collector<any, any, string> {
    return new _Collector<any, any, string>(
      () => null,
      (l, r) => {
        if (l === null) return '' + r;
        return delimiter === undefined ? '' + l + r : l + delimiter + r;
      },
      (t) => (t === null ? '' : t),
    );
  }

  static toMap<T, K, U>(
    keyMapper: JFunction<T, K>,
    valueMapper: JFunction<T, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<Map<K, U>>,
  ): Collector<T, Map<K, U>, Map<K, U>> {
    if (mapSupplier === undefined) mapSupplier = () => new Map<K, U>();
    if (mergeFunction === undefined)
      mergeFunction = (_) => {
        throw new Error('Duplicated key');
      };
    let accumulator: JBiFunction<Map<K, U>, T, Map<K, U>> = (map, element) => {
      let key = keyMapper(element);
      let value = valueMapper(element);
      if (!map.has(key)) map.set(key, value);
      else map.set(key, mergeFunction!(map.get(key)!, value));
      return map;
    };
    return new _Collector(mapSupplier!, accumulator, (t) => t);
  }

  static toObjMap<T, K, U>(
    keyMapper: JFunction<T, K>,
    valueMapper: JFunction<T, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<ObjMap<U>>,
  ): Collector<T, ObjMap<U>, ObjMap<U>> {
    if (mapSupplier === undefined)
      mapSupplier = () => {
        return {};
      };
    if (mergeFunction === undefined)
      mergeFunction = (_) => {
        throw new Error('Duplicated key');
      };
    let accumulator: JBiFunction<ObjMap<U>, T, ObjMap<U>> = (map, element) => {
      let key = (keyMapper(element) + '') as string;
      let value = valueMapper(element);
      if (map[key] === undefined) map[key] = value;
      else map[key] = mergeFunction!(map[key], value);
      return map;
    };
    return new _Collector(mapSupplier!, accumulator, (t) => t);
  }
}

//-----------------sink-----------------
abstract class _Sink<T> {
  begin(size: number): void {}

  end(): void {}

  cancellationRequested(): boolean {
    return false;
  }

  abstract accept(t: T | null): void;
}

class _ChainedSink<T, E_OUT> extends _Sink<T> {
  downstream: _Sink<E_OUT>;
  consumer: JBiConsumer<T, _ChainedSink<T, E_OUT>> | undefined;

  constructor(
    downstream: _Sink<E_OUT>,
    consumer?: JBiConsumer<T, _ChainedSink<T, E_OUT>>,
  ) {
    super();
    this.downstream = downstream;
    this.consumer = consumer;
  }

  begin(size: number): void {
    this.downstream.begin(size);
  }

  end(): void {
    this.downstream.end();
  }

  cancellationRequested(): boolean {
    return this.downstream.cancellationRequested();
  }

  accept(t: T): void {
    this.consumer!(t, this);
  }
}

class _NotSizedChainedSink<T, E_OUT> extends _ChainedSink<T, E_OUT> {
  begin(size: number): void {
    this.downstream.begin(-1);
  }
}

class _FlatMapChainedSink<T, E_OUT> extends _ChainedSink<T, E_OUT> {
  consumerNotSized: JBiConsumer<T, _FlatMapChainedSink<T, E_OUT>>;
  cancellationRequestedCalled: boolean = false;

  constructor(
    downstream: _Sink<E_OUT>,
    consumerNotSized: JBiConsumer<T, _FlatMapChainedSink<T, E_OUT>>,
  ) {
    super(downstream, () => {});
    this.consumerNotSized = consumerNotSized;
  }

  begin(size: number): void {
    this.downstream.begin(-1);
  }

  cancellationRequested(): boolean {
    this.cancellationRequestedCalled = true;
    return this.downstream.cancellationRequested();
  }

  accept(t: T): void {
    this.consumerNotSized(t, this);
  }
}

//-----------------BaseIterator-----------------

abstract class BaseIterator<T> {
  static DISTINCT: number = 0x00000001;
  static ORDERED: number = 0x00000010;

  static SORTED: number = 0x00000004;
  static SIZED: number = 0x00000040;
  static IMMUTABLE: number = 0x00000400;

  abstract next(): T | null;

  done: boolean = false;
  toNil: boolean = false;

  characteristics(): number {
    return 0;
  }

  getExactSizeIfKnown(): number {
    return (this.characteristics() & BaseIterator.SIZED) === 0
      ? -1
      : this.estimateSize();
  }

  estimateSize(): number {
    return -1;
  }

  forEachRemaining(action: JConsumer<T | null>): void {
    while (!this.done) {
      let now: T | null = this.next();
      if (!this.toNil) action(now);
      else break;
    }
  }
}

class _ArrayIterator<T> extends BaseIterator<T> {
  data: Array<T>;
  origin: number;
  fence: number;

  constructor(array: Array<T>) {
    super();
    this.data = array ?? [];
    this.origin = 0;
    this.fence = this.data.length;
  }

  next(): T | null {
    if (this.origin >= this.fence) {
      this.done = true;
      this.toNil = true;
      return null;
    }
    try {
      return this.data[this.origin];
    } finally {
      this.origin++;
      if (this.origin >= this.fence) this.done = true;
    }
  }

  characteristics(): number {
    return BaseIterator.SIZED;
  }

  estimateSize(): number {
    return this.data?.length ?? -1;
  }
}

class _IteratorIterator<T> extends BaseIterator<T> {
  iterator: Iterator<T>;

  constructor(iterator: Iterator<T>) {
    super();
    this.iterator = iterator;
  }

  next(): T | null {
    let r = this.iterator.next();
    if (!r.done) {
      return r.value;
    } else {
      this.done = true;
      this.toNil = true;
      return null;
    }
  }
}

class _ValueIterator<T> extends BaseIterator<T> {
  value: T;

  constructor(value: T) {
    super();
    this.value = value;
    this.done = false;
  }

  next(): T | null {
    if (!this.done) {
      this.done = true;
      return this.value;
    }
    this.toNil = true;
    return null;
  }

  characteristics(): number {
    return BaseIterator.SIZED;
  }

  estimateSize(): number {
    return 1;
  }
}

class _EmptyIterator<T> extends BaseIterator<T> {
  constructor() {
    super();
    this.done = true;
  }

  next(): T | null {
    this.toNil = true;
    return null;
  }

  characteristics(): number {
    return BaseIterator.SIZED;
  }

  estimateSize(): number {
    return 0;
  }
}

class _StringIterator extends BaseIterator<String> {
  data: string;
  origin: number;
  fence: number;

  constructor(data: string) {
    super();
    this.data = data;
    this.origin = 0;
    this.fence = this.data.length;
  }

  next(): String | null {
    if (this.origin >= this.fence) {
      this.done = true;
      this.toNil = true;
      return null;
    }
    try {
      return this.data.charAt(this.origin);
    } finally {
      this.origin++;
      if (this.origin >= this.fence) this.done = true;
    }
  }

  characteristics(): number {
    return BaseIterator.SIZED;
  }

  estimateSize(): number {
    return this.data?.length ?? -1;
  }
}

class _SupplierIterator<T> extends BaseIterator<T> {
  supplier: JSupplier<T>;

  constructor(supplier: JSupplier<T>) {
    super();
    this.supplier = supplier;
  }

  next(): T | null {
    return this.supplier();
  }
}

//-----------------_StreamOpFlagType-----------------
class _OpFlagInfo {
  bitPosition: number;
  set: number;
  clear: number;
  preserve: number;

  constructor(
    bitPosition: number,
    set: number,
    clear: number,
    preserve: number,
  ) {
    this.bitPosition = bitPosition;
    this.set = set;
    this.clear = clear;
    this.preserve = preserve;
  }

  isKnown(flags: number): boolean {
    return (flags & this.preserve) === this.set;
  }

  isCleared(flags: number): boolean {
    return (flags & this.preserve) === this.clear;
  }

  isPreserved(flags: number): boolean {
    return (flags & this.preserve) === this.preserve;
  }
}

class _OpFlag {
  static DISTINCT: _OpFlagInfo = new _OpFlagInfo(0, 1, 2, 3);
  static SORTED: _OpFlagInfo = new _OpFlagInfo(2, 4, 8, 12);
  static SHORT_CIRCUIT: _OpFlagInfo = new _OpFlagInfo(4, 16, 32, 48);
  static SIZED: _OpFlagInfo = new _OpFlagInfo(6, 64, 128, 192);

  static combineOpFlags(newFlag: number, prevFlag: number): number {
    if (newFlag === 0) return prevFlag;
    let clearOldBit =
      ~((_OpFlag.FLAG_MASK_IS & newFlag) << 1) |
      ((_OpFlag.FLAG_MASK_NOT & newFlag) >> 1);
    return (prevFlag & clearOldBit) | newFlag;
  }

  static FLAG_MASK_IS: number = 85; //  0b01010101
  static FLAG_MASK_NOT: number = 170; //0b10101010
  static IS_DISTINCT: number = 1; //0b1
  static NOT_DISTINCT: number = 2; //0b10
  static IS_SORTED: number = 4; //0b100
  static NOT_SORTED: number = 8; //0b1000
  static IS_SHORT_CIRCUIT: number = 16; //0b10000
  // static NOT_SHORT_CIRCUIT : number = 32; //0b100000
  static IS_SIZED: number = 64; //0b1000000
  static NOT_SIZED: number = 128; //0b10000000
}

//-----------------operation_api-----------------
abstract class _TerminalOp<E_IN, R> {
  abstract makeSink(): _TerminalSink<E_IN, R>;

  getOpFlag(): number {
    return 0;
  }
}

abstract class _TerminalSink<T, O> extends _Sink<T> {
  abstract get(): O;
}

//-----------------_AbstractPipeline-----------------

abstract class _AbstractPipeline<E_IN, E_OUT> {
  static MSG_STREAM_LINKED: string =
    'stream has already been operated upon or closed';

  linkedOrConsumed: boolean = false;
  sourceIterator: BaseIterator<any>;
  combinedFlags: number;
  depth: number;
  previousStage: _AbstractPipeline<any, any> | null = null;
  nextStage: _AbstractPipeline<any, any> | null = null;

  constructor(
    previousStage: _AbstractPipeline<any, any> | null,
    opFlags: number,
    sourceIterator?: BaseIterator<any>,
  ) {
    if (previousStage === null) {
      this.previousStage = null;
      this.depth = 0;
      this.combinedFlags = opFlags;
      this.sourceIterator = sourceIterator!;
    } else {
      if (previousStage.linkedOrConsumed)
        throw new Error(_AbstractPipeline.MSG_STREAM_LINKED);
      this.previousStage = previousStage;
      this.previousStage.linkedOrConsumed = true;
      this.previousStage.nextStage = this;
      this.sourceIterator = previousStage.sourceIterator;
      this.combinedFlags = _OpFlag.combineOpFlags(
        opFlags,
        previousStage.combinedFlags,
      );
      this.depth = previousStage.depth + 1;
    }
  }

  abstract opWrapSink(flags: number, sink: _Sink<E_OUT>): _Sink<E_IN>;

  evaluate<R>(terminalOp: _TerminalOp<E_OUT, R>): R {
    if (this.linkedOrConsumed)
      throw new Error(_AbstractPipeline.MSG_STREAM_LINKED);
    this.linkedOrConsumed = true;

    let terminalFlags = terminalOp.getOpFlag();
    if (terminalFlags !== 0)
      this.combinedFlags = _OpFlag.combineOpFlags(
        this.combinedFlags,
        terminalFlags,
      );

    let finalSink = terminalOp.makeSink();
    let sink = this.wrapSink(finalSink);
    this.copyInto(sink, this.sourceIterator);

    return finalSink.get();
  }

  wrapSink<P_IN>(inSink: _Sink<E_OUT>): _Sink<P_IN> {
    let sink = inSink;
    let p: _AbstractPipeline<any, any>;
    for (p = this; p.depth > 0; p = p.previousStage!) {
      sink = p.opWrapSink(p.previousStage!.combinedFlags, sink);
    }
    return sink as unknown as _Sink<P_IN>;
  }

  copyInto<P_IN>(wrappedSink: _Sink<P_IN>, spliterator: BaseIterator<P_IN>) {
    if (!_OpFlag.SHORT_CIRCUIT.isKnown(this.combinedFlags)) {
      wrappedSink.begin(spliterator.getExactSizeIfKnown());
      spliterator.forEachRemaining((t) => wrappedSink.accept(t));
      wrappedSink.end();
    } else {
      this.copyIntoWithCancel(wrappedSink, spliterator);
    }
  }

  copyIntoWithCancel<P_IN>(
    wrappedSink: _Sink<P_IN>,
    spliterator: BaseIterator<P_IN>,
  ) {
    let p: _AbstractPipeline<any, any> = this;
    while (p.depth > 0) {
      p = p.previousStage!;
    }
    wrappedSink.begin(spliterator.getExactSizeIfKnown());
    // @ts-ignore
    p.forEachWithCancel(spliterator, wrappedSink);
    wrappedSink.end();
  }

  forEachWithCancel(it: BaseIterator<E_OUT>, sink: _Sink<E_OUT>) {
    while (!it.done) {
      if (sink.cancellationRequested()) {
        return;
      }
      let now = it.next();
      if (!it.toNil) sink.accept(now);
      else break;
    }
  }
}

//-------extension--------

declare interface DartStream<T> {
  takeWhile(predicate: RegExp): DartStream<T>;

  dropWhile(predicate: RegExp): DartStream<T>;

  anyMatch(predicate: RegExp): boolean;

  allMatch(predicate: RegExp): boolean;

  noneMatch(predicate: RegExp): boolean;

  filter(predicate: RegExp): DartStream<T>;

  slice(start: number, end: number): DartStream<T>;

  toMap<K, U>(
    keyMapper: JFunction<T, K>,
    valueMapper: JFunction<T, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<Map<K, U>>,
  ): Map<K, U>;

  toObjMap<K, U>(
    keyMapper: JFunction<T, K>,
    valueMapper: JFunction<T, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<ObjMap<U>>,
  ): ObjMap<U>;

  sum(start?: T): T;

  average(): number | null;

  flatMap<R>(mapper: JFunction<T, Array<R>>): DartStream<R>;
}

//----------Pipeline----------

abstract class _DsPipeline<P_IN, P_OUT>
  extends _AbstractPipeline<P_IN, P_OUT>
  implements DartStream<P_OUT>
{
  //--extension--method----
  slice(start: number, end: number): DartStream<P_OUT> {
    return this.skip(start).limit(end - start);
  }

  toMap<K, U>(
    keyMapper: JFunction<P_OUT, K>,
    valueMapper: JFunction<P_OUT, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<Map<K, U>>,
  ): Map<K, U> {
    return this.collect(
      Collectors.toMap(keyMapper, valueMapper, mergeFunction, mapSupplier),
    );
  }

  toObjMap<K, U>(
    keyMapper: JFunction<P_OUT, K>,
    valueMapper: JFunction<P_OUT, U>,
    mergeFunction?: JBinaryOperator<U>,
    mapSupplier?: JSupplier<ObjMap<U>>,
  ): ObjMap<U> {
    return this.collect(
      Collectors.toObjMap(keyMapper, valueMapper, mergeFunction, mapSupplier),
    );
  }

  sum(start?: P_OUT): P_OUT {
    if (!start) start = 0 as unknown as P_OUT;
    return this.reduce(start!, (t, u) => (t as any) + (u as any));
  }

  average(): number | null {
    let a = [0.0, 0.0];
    let r = this.reduce(a, (t, u) => {
      return [t[0] + 1, t[1] + (u as unknown as number)];
    });
    if (r[0] === 0) return null;
    else return r[1] / r[0];
  }

  constructor(
    previousStage: _AbstractPipeline<any, any> | null,
    opFlags: number,
    sourceIterator?: BaseIterator<any>,
  ) {
    super(previousStage, opFlags, sourceIterator);
  }

  private wrapPredicate(
    predicate: JPredicate<P_OUT> | RegExp,
  ): JPredicate<P_OUT> {
    if (predicate instanceof RegExp) {
      let reg = predicate as RegExp;
      return (t) => {
        return reg.test((t as any).toString());
      };
    } else return predicate;
  }

  allMatch(predicate: JPredicate<P_OUT> | RegExp): boolean {
    return this.evaluate(
      new _MatchOp<P_OUT>('ALL', this.wrapPredicate(predicate)),
    );
  }

  anyMatch(predicate: JPredicate<P_OUT> | RegExp): boolean {
    return this.evaluate(
      new _MatchOp<P_OUT>('ANY', this.wrapPredicate(predicate)),
    );
  }

  noneMatch(predicate: JPredicate<P_OUT> | RegExp): boolean {
    return this.evaluate(
      new _MatchOp<P_OUT>('NONE', this.wrapPredicate(predicate)),
    );
  }

  collect<R, A>(collector: Collector<P_OUT, A, R>): R {
    let container: A = this.reduce<A>(
      collector.supplier(),
      collector.accumulator,
    );
    if (collector.finisher !== null && collector.finisher !== undefined)
      return collector.finisher!(container);
    else return container as unknown as R;
  }

  count(): number {
    return this.reduce<number>(0, (t, _) => t + 1);
  }

  distinct(): DartStream<P_OUT> {
    return new _DistinctOp(this);
  }

  filter(predicate: JPredicate<P_OUT> | RegExp): DartStream<P_OUT> {
    let pre = this.wrapPredicate(predicate);
    return new _StatelessOp(
      this,
      _OpFlag.NOT_SIZED,
      (flag, sink) =>
        new _NotSizedChainedSink<P_OUT, P_OUT>(sink, (t, _this) => {
          if (pre(t)) _this.downstream.accept(t);
        }),
    );
  }

  findAny(): P_OUT | null {
    return this.evaluate(new _FindOp<P_OUT>());
  }

  findFirst(): P_OUT | null {
    return this.evaluate(new _FindOp<P_OUT>());
  }

  flatMap<R>(
    mapper: JFunction<P_OUT, DartStream<R> | Array<R>>,
  ): DartStream<R> {
    return new _StatelessOp<P_OUT, R>(
      this,
      _OpFlag.NOT_SORTED | _OpFlag.NOT_DISTINCT | _OpFlag.NOT_SIZED,
      (flag, sink) => {
        return new _FlatMapChainedSink<P_OUT, R>(sink, (t, _this) => {
          let r0 = mapper(t);
          if (r0 instanceof Array) r0 = TsStream(r0);
          let result: DartStream<R> = r0;
          if (result !== null) {
            if (!_this.cancellationRequestedCalled) {
              result.forEach((e) => _this.downstream.accept(e));
            } else {
              if (result instanceof _DsPipeline) {
                let it = result.sourceIterator;
                while (!it.done) {
                  if (_this.downstream.cancellationRequested()) return;
                  let now = it.next();
                  if (!it.toNil) sink.accept(now);
                  else break;
                }
              } else {
                result.forEach((e) => {
                  if (!_this.downstream.cancellationRequested())
                    _this.downstream.accept(e);
                });
              }
            }
          }
          return;
        });
      },
    );
  }

  map<R>(mapper: JFunction<P_OUT, R>): DartStream<R> {
    return new _StatelessOp<P_OUT, R>(
      this,
      _OpFlag.NOT_SORTED | _OpFlag.NOT_DISTINCT,
      (flag, sink) => {
        return new _ChainedSink<P_OUT, R>(sink, (t, _this) => {
          _this.downstream.accept(mapper(t));
        });
      },
    );
  }

  max(comparator?: JComparator<P_OUT>): P_OUT | null {
    if (comparator === undefined) comparator = _SortedOp.natureComparator;
    return this.reduce0((a, b) => (comparator!(a, b) >= 0 ? a : b));
  }

  min(comparator?: JComparator<P_OUT>): P_OUT | null {
    if (comparator === undefined) comparator = _SortedOp.natureComparator;
    return this.reduce0((a, b) => (comparator!(a, b) <= 0 ? a : b));
  }

  peek(action: JConsumer<P_OUT>): DartStream<P_OUT> {
    return new _StatelessOp<P_OUT, P_OUT>(this, 0, (flag, sink) => {
      return new _ChainedSink<P_OUT, P_OUT>(sink, (t, _this) => {
        action(t);
        _this.downstream.accept(t);
      });
    });
  }

  reduce<U>(identity: U, accumulator: JBiFunction<U, P_OUT, U>): U {
    return this.evaluate(
      new _ReduceOp<P_OUT, U, _TerminalSink<P_OUT, U>>(identity, accumulator),
    );
  }

  reduce0(accumulator: JBinaryOperator<P_OUT>): P_OUT | null {
    return this.evaluate(
      new _ReduceOp<P_OUT, P_OUT, _TerminalSink<P_OUT, P_OUT>>(
        undefined,
        accumulator,
      ),
    );
  }

  limit(maxSize: number): DartStream<P_OUT> {
    return new _SliceOp(this, 0, maxSize > 0 ? maxSize : 0);
  }

  skip(n: number): DartStream<P_OUT> {
    return new _SliceOp(this, n > 0 ? n : 0, -1);
  }

  sorted(comparator?: JComparator<P_OUT>): DartStream<P_OUT> {
    if (comparator !== null) return new _SortedOp(this, comparator!, false);
    else return new _SortedOp(this, _SortedOp.natureComparator, true);
  }

  toArray(): Array<P_OUT> {
    return this.collect(Collectors.toList());
  }

  forEach(action: JConsumer<P_OUT>): void {
    this.evaluate(new _ForEachOp(action));
  }

  shuffle(): DartStream<P_OUT> {
    return new _ShuffleOp(this);
  }

  reverse(): DartStream<P_OUT> {
    return new _ReverseOp(this);
  }

  takeWhile(predicate: JPredicate<P_OUT> | RegExp): DartStream<P_OUT> {
    return new _TakeWhileOp(this, this.wrapPredicate(predicate));
  }

  dropWhile(predicate: JPredicate<P_OUT> | RegExp): DartStream<P_OUT> {
    return new _DropWhileOp(this, this.wrapPredicate(predicate));
  }
}

class _Head<P_IN, P_OUT> extends _DsPipeline<P_IN, P_OUT> {
  opWrapSink(flags: number, sink: _Sink<P_OUT>): _Sink<P_IN> {
    throw new Error('NotSupport');
  }
}

class _StatelessOp<E_IN, E_OUT> extends _DsPipeline<E_IN, E_OUT> {
  wrapSinkFunction: JBiFunction<number, _Sink<E_OUT>, _Sink<E_IN>>;

  constructor(
    previousStage: _AbstractPipeline<any, any> | null,
    opFlags: number,
    wrapSinkFunction: JBiFunction<number, _Sink<E_OUT>, _Sink<E_IN>>,
  ) {
    super(previousStage, opFlags, undefined);
    this.wrapSinkFunction = wrapSinkFunction;
  }

  opWrapSink(flags: number, sink: _Sink<E_OUT>): _Sink<E_IN> {
    return this.wrapSinkFunction(flags, sink);
  }
}

//----ops-----
class _DistinctOp<T> extends _DsPipeline<T, T> {
  constructor(previousStage: _AbstractPipeline<any, any> | null) {
    super(previousStage, _OpFlag.IS_DISTINCT);
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    if (_OpFlag.DISTINCT.isKnown(flags)) {
      return sink;
    } else if (_OpFlag.SORTED.isKnown(flags)) {
      return new _DistinctSinkSorted(sink);
    } else {
      return new _DistinctSinkNotSorted(sink);
    }
  }
}

class _DistinctSinkSorted<T> extends _ChainedSink<T, T> {
  constructor(downstream: _Sink<T>) {
    super(downstream);
  }

  seenNull: boolean = false;
  lastSeen: T | null = null;

  begin(size: number): void {
    this.seenNull = false;
    this.lastSeen = null;
    this.downstream.begin(-1);
  }

  end(): void {
    this.seenNull = false;
    this.lastSeen = null;
    this.downstream.end();
  }

  accept(t: T): void {
    if (t === null) {
      if (!this.seenNull) {
        this.seenNull = true;
        this.lastSeen = null;
        this.downstream.accept(t);
      }
    } else if (this.lastSeen === null || t !== this.lastSeen) {
      this.lastSeen = t;
      this.downstream.accept(t);
    }
  }
}

class _DistinctSinkNotSorted<T> extends _ChainedSink<T, T> {
  constructor(downstream: _Sink<T>) {
    super(downstream);
  }

  seen: Set<T> | null = null;

  begin(size: number): void {
    this.seen = new Set();
    this.downstream.begin(-1);
  }

  end(): void {
    this.seen = null;
    this.downstream.end();
  }

  accept(t: T): void {
    if (!this.seen!.has(t)) {
      this.seen!.add(t);
      this.downstream.accept(t);
    }
  }
}

class _FindOp<T> extends _TerminalOp<T, T | null> {
  getOpFlag(): number {
    return _OpFlag.IS_SHORT_CIRCUIT;
  }

  makeSink(): _TerminalSink<T, T | null> {
    return new _FindSink();
  }
}

class _FindSink<T> extends _TerminalSink<T, T | null> {
  hasValue: boolean = false;
  value: T | null = null;

  accept(value: T): void {
    if (!this.hasValue) {
      this.hasValue = true;
      this.value = value;
    }
  }

  cancellationRequested(): boolean {
    return this.hasValue;
  }

  get(): T | null {
    return this.hasValue ? this.value : null;
  }
}

class _ForEachOp<T> extends _TerminalOp<T, void> {
  action: JConsumer<T>;

  constructor(action: JConsumer<T>) {
    super();
    this.action = action;
  }

  makeSink(): _TerminalSink<T, void> {
    return new _ForEachSink(this.action);
  }
}

class _ForEachSink<T> extends _TerminalSink<T, void> {
  action: JConsumer<T>;

  constructor(action: JConsumer<T>) {
    super();
    this.action = action;
  }

  accept(t: T): void {
    this.action(t);
  }

  get(): void {
    return;
  }
}

class _MatchOp<T> extends _TerminalOp<T, boolean> {
  matchKind: 'ANY' | 'ALL' | 'NONE';
  predicate: JPredicate<T>;

  constructor(matchKind: 'ANY' | 'ALL' | 'NONE', predicate: JPredicate<T>) {
    super();
    this.matchKind = matchKind;
    this.predicate = predicate;
  }

  getOpFlag(): number {
    return _OpFlag.IS_SHORT_CIRCUIT;
  }

  makeSink(): _TerminalSink<T, boolean> {
    return new _MatchOpSink(this.matchKind, this.predicate);
  }
}

class _MatchOpSink<T> extends _TerminalSink<T, boolean> {
  matchKind: 'ANY' | 'ALL' | 'NONE';
  predicate: JPredicate<T>;

  constructor(matchKind: 'ANY' | 'ALL' | 'NONE', predicate: JPredicate<T>) {
    super();
    this.matchKind = matchKind;
    this.predicate = predicate;
    this.value = !_MatchOpSink.shortCircuitResult[matchKind];
  }

  stop: boolean = false;
  value: boolean = false;

  static shortCircuitResult = { ANY: true, ALL: false, NONE: false };
  static stopOnPredicateMatches = { ANY: true, ALL: false, NONE: true };

  cancellationRequested(): boolean {
    return this.stop;
  }

  get(): boolean {
    return this.value;
  }

  accept(t: T): void {
    if (
      !this.stop &&
      this.predicate(t) === _MatchOpSink.stopOnPredicateMatches[this.matchKind]
    ) {
      this.stop = true;
      this.value = _MatchOpSink.shortCircuitResult[this.matchKind];
    }
  }
}

class _ReduceOp<T, R, S extends _TerminalSink<T, R>> extends _TerminalOp<T, R> {
  seed: R | undefined;
  reducer: JBiFunction<R, T, R>;

  constructor(seed: R | undefined, reducer: JBiFunction<R, T, R>) {
    super();
    this.seed = seed;
    this.reducer = reducer;
  }

  makeSink(): _TerminalSink<T, R> {
    if (this.seed !== undefined)
      return new _HasSeedReducingSink<T, R>(this.seed, this.reducer);
    else
      return new _NoSeedReducingSink<R>(
        this.reducer as unknown as JBinaryOperator<R>,
      ) as unknown as _TerminalSink<T, R>;
  }
}

class _HasSeedReducingSink<T, R> extends _TerminalSink<T, R> {
  state: R;
  seed: R;
  reducer: JBiFunction<R, T, R>;

  constructor(seed: R, reducer: JBiFunction<R, T, R>) {
    super();
    this.seed = seed;
    this.reducer = reducer;
    this.state = seed;
  }

  get(): R {
    return this.state;
  }

  begin(size: number): void {
    this.state = this.seed;
  }

  accept(t: T): void {
    this.state = this.reducer(this.state, t);
  }
}

class _NoSeedReducingSink<T> extends _TerminalSink<T, T | null> {
  state: T | null = null;
  empty: boolean = true;
  operator: JBinaryOperator<T>;

  constructor(operator: JBinaryOperator<T>) {
    super();
    this.operator = operator;
  }

  get(): T | null {
    return this.state;
  }

  begin(size: number): void {
    this.state = null;
    this.empty = true;
  }

  accept(t: T): void {
    if (this.empty) {
      this.empty = false;
      this.state = t;
    } else {
      this.state = this.operator(this.state!, t);
    }
  }
}

class _SliceOp<T> extends _DsPipeline<T, T> {
  _skip: number;
  _limit: number;

  static flags(limit: number): number {
    return _OpFlag.NOT_SIZED | (limit !== -1 ? _OpFlag.IS_SHORT_CIRCUIT : 0);
  }

  constructor(
    previousStage: _AbstractPipeline<any, any> | null,
    skip: number,
    limit: number,
  ) {
    super(previousStage, _SliceOp.flags(limit), undefined);
    this._skip = skip;
    this._limit = limit;
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    return new _SliceSink<T>(sink, this._skip, this._limit);
  }
}

class _SliceSink<T> extends _ChainedSink<T, T> {
  constructor(downstream: _Sink<T>, skip: number, limit: number) {
    super(downstream);
    this.skip = skip;
    this.limit = limit;
    this.n = skip;
    this.m = limit >= 0 ? limit : 0x7fffffffffffffff;
  }

  skip: number;
  limit: number;
  n: number;
  m: number;

  static calcSize(size: number, skip: number, limit: number): number {
    return size >= 0 ? Math.max(-1, Math.min(size - skip, limit)) : -1;
  }

  begin(size: number): void {
    this.downstream.begin(_SliceSink.calcSize(size, this.skip, this.m));
  }

  accept(t: T): void {
    if (this.n === 0) {
      if (this.m > 0) {
        this.m--;
        this.downstream.accept(t);
      }
    } else {
      this.n--;
    }
  }

  cancellationRequested(): boolean {
    return this.m === 0 || this.downstream.cancellationRequested();
  }
}

class _SortedOp<T> extends _DsPipeline<T, T> {
  static natureComparator: JComparator<any> = (o1: any, o2: any) => {
    return o1 === o2 ? 0 : o1 > o2 ? 1 : -1;
  };

  comparator: JComparator<T>;
  isNaturalSort: boolean;

  constructor(
    previousStage: _AbstractPipeline<any, any> | null,
    comparator: JComparator<T>,
    isNaturalSort: boolean,
  ) {
    super(previousStage, isNaturalSort ? _OpFlag.IS_SORTED : 0);
    this.comparator = comparator;
    this.isNaturalSort = isNaturalSort;
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    if (_OpFlag.SORTED.isKnown(flags) && this.isNaturalSort) return sink;
    else if (_OpFlag.SIZED.isKnown(flags))
      return new _SortedSink<T>(sink, this.comparator, true);
    else return new _SortedSink<T>(sink, this.comparator, false);
  }
}

class _SortedSink<T> extends _ChainedSink<T, T> {
  comparator: JComparator<T>;
  sized: boolean;
  cancellationRequestedCalled: boolean = false;
  list: Array<T> = [];
  offset: number = 0;

  constructor(
    downstream: _Sink<T>,
    comparator: JComparator<T>,
    sized: boolean,
  ) {
    super(downstream);
    this.comparator = comparator;
    this.sized = sized;
  }

  cancellationRequested(): boolean {
    this.cancellationRequestedCalled = true;
    return false;
  }

  begin(size: number): void {
    if (this.sized) this.list = new Array<T>(size);
    else this.list = [];
  }

  onEndSort(): void {
    this.list.sort(this.comparator);
  }

  end(): void {
    this.onEndSort();
    this.downstream.begin(this.list.length);
    if (!this.cancellationRequestedCalled) {
      this.list.forEach((e) => this.downstream.accept(e));
    } else {
      for (let t of this.list) {
        if (this.downstream.cancellationRequested()) break;
        this.downstream.accept(t);
      }
    }
    this.downstream.end();
    this.list = [];
  }

  accept(t: T): void {
    if (this.sized) this.list[this.offset++] = t;
    else this.list.push(t);
  }
}

class _ReverseOp<T> extends _DsPipeline<T, T> {
  constructor(previousStage: _AbstractPipeline<any, any>) {
    super(previousStage, _OpFlag.NOT_SORTED);
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    if (_OpFlag.SIZED.isKnown(flags)) return new _ReverseSink<T>(sink, true);
    else return new _ReverseSink<T>(sink, false);
  }
}

class _ReverseSink<T> extends _SortedSink<T> {
  constructor(downstream: _Sink<T>, sized: boolean) {
    super(downstream, _SortedOp.natureComparator, sized);
  }

  onEndSort(): void {
    this.list = this.list.reverse();
  }
}

class _ShuffleOp<T> extends _DsPipeline<T, T> {
  constructor(previousStage: _AbstractPipeline<any, any>) {
    super(previousStage, _OpFlag.NOT_SORTED);
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    if (_OpFlag.SIZED.isKnown(flags)) return new _ShuffleSink<T>(sink, true);
    else return new _ShuffleSink<T>(sink, false);
  }
}

class _ShuffleSink<T> extends _SortedSink<T> {
  constructor(downstream: _Sink<T>, sized: boolean) {
    super(downstream, _SortedOp.natureComparator, sized);
  }

  shuffle(a: Array<T>) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  onEndSort(): void {
    this.shuffle(this.list);
  }
}

class _TakeWhileOp<T> extends _DsPipeline<T, T> {
  predicate: JPredicate<T>;

  constructor(
    previousStage: _AbstractPipeline<any, any>,
    predicate: JPredicate<T>,
  ) {
    super(previousStage, _OpFlag.NOT_SIZED);
    this.predicate = predicate;
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    return new _TakeWhileSink<T>(sink, this.predicate);
  }
}

class _TakeWhileSink<T> extends _ChainedSink<T, T> {
  predicate: JPredicate<T>;
  stop: boolean = false;

  constructor(downstream: _Sink<T>, predicate: JPredicate<T>) {
    super(downstream);
    this.predicate = predicate;
  }

  begin(size: number): void {
    this.downstream.begin(-1);
  }

  accept(t: T): void {
    if (!this.stop) {
      this.stop = !this.predicate(t);
      if (!this.stop) this.downstream.accept(t);
    }
  }

  cancellationRequested(): boolean {
    return this.stop || this.downstream.cancellationRequested();
  }
}

class _DropWhileOp<T> extends _DsPipeline<T, T> {
  predicate: JPredicate<T>;

  constructor(
    previousStage: _AbstractPipeline<any, any>,
    predicate: JPredicate<T>,
  ) {
    super(previousStage, _OpFlag.NOT_SIZED);
    this.predicate = predicate;
  }

  opWrapSink(flags: number, sink: _Sink<T>): _Sink<T> {
    return new _DropWhileSink<T>(sink, this.predicate);
  }
}

class _DropWhileSink<T> extends _ChainedSink<T, T> {
  predicate: JPredicate<T>;
  start: boolean = false;

  constructor(downstream: _Sink<T>, predicate: JPredicate<T>) {
    super(downstream);
    this.predicate = predicate;
  }

  begin(size: number): void {
    this.downstream.begin(-1);
  }

  accept(t: T): void {
    if (!this.start) {
      this.start = !this.predicate(t);
    }
    if (this.start) this.downstream.accept(t);
  }

  cancellationRequested(): boolean {
    return this.downstream.cancellationRequested();
  }
}
