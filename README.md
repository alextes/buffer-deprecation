# Node Buffer Deprecation
This repository is an attempt to answer some questions regarding node's buffer creation deprecation, what considerations should be made and as a result how to implement it going forward.

## The issue
The node team decided to deprecate both the first way of buffer creation `Buffer(size)` and the second `new Buffer(size)`. Now there's a third for node >= v4, namely `Buffer.from` / `Buffer.alloc` / `Buffer.allocUnsafe`. 

A lot node v7 users might have started to notice the following warning: 
```
(node:8628) DeprecationWarning: Using Buffer without `new` will soon stop working. 
Use `new Buffer()`, or preferably `Buffer.from()`, `Buffer.allocUnsafe()` or `Buffer.alloc()` instead.
```
I haven't looked up the reason the first method was deprecated. However moving forward one might notice the second, suggested method has also been deprecated for security reasons ([Issue #4660](https://github.com/nodejs/node/issues/4660)). Read more about it in [the node docs](https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe). While its clear all modules should eventually move to the third implementation this leaves the questions about what effect your choice might have on supported node versions and in some cases the performance impact of allocating your buffers differently.

## The Preferred Way Forward
I have not looked up why the node team deprecated the first method in favor of the second, but since the second works back to at least v0.10 and the first is being deprecated soon your only real choices are the second and third method.

### new Buffer()
Supports at least, but possibly even older than: >= v0.10
Still has the same issue as the first and is thus already marked deprecated.

### Buffer.from() / Buffer.alloc() / Buffer.allocUnsafe()
Supports node versions: >= v4
To understand why this method is the preferred one you can read the node docs linked earlier.

### Going forward
So if you're supporting node >=v4 you're good just using the third method. Keeping in mind v0.12 is no longer supported by the end of 2016 this makes sense for most. In case you still want to support older versions of node here are two good options. [safe-buffer](https://github.com/feross/safe-buffer) is a simple shim that uses the third method whenever possible and falls back to the first if it can't. (Since the vocal warnings started with node v7 you won't see any warnings from this). If you'd like a more concise solution instead take a look at these ponyfills: [buffer-from](https://github.com/LinusU/buffer-from), [buffer-alloc](https://github.com/LinusU/buffer-alloc) and [buffer-alloc-unsafe](https://github.com/LinusU/buffer-alloc-unsafe).

### Performance
In most cases you'll simply want to use the safe 'alloc'. For the rare cases where performance matters here are the benchmark results. I should immediately add I have no understanding of node's actual buffer creation, v8 engine's optimizations or the benchmarkjs library for that matter. The below results might be completely wrong.
Using node v7, with the shim using the third method, allocating an 8 byte buffer the results are:
```
First Method: Buffer() x 9,094,347 ops/sec ±0.89% (88 runs sampled)
Second Method: new Buffer() x 8,182,048 ops/sec ±0.88% (86 runs sampled)
Third Method: Buffer.alloc() x 1,524,799 ops/sec ±1.19% (78 runs sampled)
Third Method: Buffer.allocUnsafe() x 10,160,974 ops/sec ±1.36% (86 runs sampled)
Shim Safe x 1,502,023 ops/sec ±2.42% (72 runs sampled)
Shim Unsafe x 9,829,470 ops/sec ±0.91% (84 runs sampled)
```

## See Also
Original issue on deprecating `Buffer()` and `new Buffer()` [here](https://github.com/nodejs/node/issues/4660).

Issue on the future of Buffer [here](https://github.com/nodejs/node/issues/9531).
