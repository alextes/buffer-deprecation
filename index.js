const Benchmark = require('benchmark');
const BufferShim = require('safe-buffer').Buffer;

const suite = new Benchmark.Suite;

function createBufferFirst() {
  Buffer(8);
}

function createBufferSecond() {
  new Buffer(8);
}

function createBufferThirdSafe() {
  Buffer.alloc(8);
}

function createBufferThirdUnsafe() {
  Buffer.allocUnsafe(8);
}

function createBufferShimSafe() {
  BufferShim.alloc(8);
}

function createBufferShimUnsafe() {
  BufferShim.allocUnsafe(8);
}

suite
  .add('First Method: Buffer()', createBufferFirst)
  .add('Second Method: new Buffer()', createBufferSecond)
  .add('Third Method: Buffer.alloc()', createBufferThirdSafe)
  .add('Third Method: Buffer.allocUnsafe()', createBufferThirdUnsafe)
  .add('Shim Safe', createBufferShimSafe)
  .add('Shim Unsafe', createBufferShimUnsafe)
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true });

