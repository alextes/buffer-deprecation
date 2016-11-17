const Benchmark = require('benchmark');
const BufferShim = require('safe-buffer').Buffer;

const suite = new Benchmark.Suite;

function createBufferOld() {
  Buffer(8);
}

function createBufferNew() {
  new Buffer(8);
}

function createBufferShimSafe() {
  BufferShim.alloc(8);
}

function createBufferShimUnsafe() {
  BufferShim.allocUnsafe(8);
}

suite
  .add('Old Buffer Creation', createBufferOld)
  .add('New Buffer Creation', createBufferNew)
  .add('Shimmed Safe Buffer Creation', createBufferShimSafe)
  .add('Shimmed Unsafe Buffer Creation', createBufferShimUnsafe)
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true });
