# Node Buffer Deprecation
This repository is an attempt to answer some questions regarding node's buffer creation deprecation, what considerations should be made and as a result how to implement it going forward.

## The issue
The node team decided to deprecate both the first way of buffer creation `Buffer(size)` and the second `new Buffer(size)`. Now there's a third for node > v6, namely `Buffer.from` / `Buffer.alloc` / `Buffer.allocUnsafe`. 

A lot node v7 users might have started to notice the following warning: 
`(node:8628) DeprecationWarning: Using Buffer without `new` will soon stop working. Use `new Buffer()`, or preferably `Buffer.from()`, `Buffer.allocUnsafe()` or `Buffer.alloc()` instead.`. I haven't looked up the reason the first method was deprecated. However moving forward one might notice the second, suggested method has also been deprecated for security reasons ([Issue #4660](https://github.com/nodejs/node/issues/4660)). Read more about it in [the node docs](https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe). While its clear all modules should eventually move to the third implementation this leaves the questions about what effect your choice might have on supported node versions and in some cases the performance impact of allocating your buffers differently.

## The Preferred Way Forward
I have not looked up why the node team thinks its high time you stop using the first but their message is clear so let's look at the second.

### new Buffer()
Supports node versions: > ???
Still has the same security issue as the first.

### Buffer.from() / Buffer.alloc() / Buffer.allocUnsafe()
Supports node versions: > v6
To understand why this method is the preferred one you can read the node docs linked earlier.

### Going forward
Since most modules will want to support node versions older than v6 let's look at a solution. [safe-buffer](https://github.com/feross/safe-buffer). safe-buffer is a simple shim that uses the third version of creating buffers whenever it can and falls back to the first if it can't.

## Performance
In most cases you'll simply want to use the safe 'alloc'. For the rare cases where performance matters here are the benchmark results. I should immediately add I have no understanding of node's actual buffer creation, v8's optimizations or the benchmarkjs library for that matter. The below results might be completely wrong.
Using node v7, with the shim using the third method, the results are:
```
First Method: Buffer() x 9,094,347 ops/sec ±0.89% (88 runs sampled)
Second Method: new Buffer() x 8,182,048 ops/sec ±0.88% (86 runs sampled)
Third Method: Buffer.alloc() x 1,524,799 ops/sec ±1.19% (78 runs sampled)
Third Method: Buffer.allocUnsafe() x 10,160,974 ops/sec ±1.36% (86 runs sampled)
Shim Safe x 1,502,023 ops/sec ±2.42% (72 runs sampled)
Shim Unsafe x 9,829,470 ops/sec ±0.91% (84 runs sampled)
```

