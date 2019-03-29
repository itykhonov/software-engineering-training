// run this command $ node --expose-gc test.js

const os = require('os');

const bytesToSize = (bytes) => {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

console.log('free memory : ', bytesToSize(os.freemem())); // free memory :  104 MB
console.log('total memory : ', bytesToSize(os.totalmem())); // total memory :  8 GB

function forceGC() {
   if (global.gc) {
      global.gc();
   } else {
      console.warn('No GC hook! Start your program as `node --expose-gc test.js`.');
   }
}

process.memoryUsage();

console.log('///*** -------- ***///');
console.log('///*** Initial usage ***///');
console.log('///*** -------- ***///');

const initialUsage = process.memoryUsage();  // Initial usage

console.log(`memoryUsage rss ${initialUsage.rss / 1024 / 1024 } MB`); // memoryUsage rss 22.4609375 MB
console.log(`memoryUsage heapTotal ${initialUsage.heapTotal / 1024 / 1024 } MB`); // memoryUsage heapTotal 5.703125 MB
console.log(`memoryUsage heapUsed ${initialUsage.heapUsed / 1024 / 1024 } MB`); // memoryUsage heapUsed 3.032470703125 MB



console.log('///*** -------- ***///');
console.log('///*** Memory after allocating so many items (1e7) ***///');
console.log('///*** -------- ***///');

let newArray = new Array(1e7).fill("some string"); // Allocate memory for 10m items in an array
let usage = process.memoryUsage();  // Memory after allocating so many items

console.log(`memoryUsage rss ${usage.rss / 1024 / 1024 } MB`); // memoryUsage rss 99.0546875 MB
console.log(`memoryUsage heapTotal ${usage.heapTotal / 1024 / 1024 } MB`); // memoryUsage heapTotal 82.5078125 MB
console.log(`memoryUsage heapUsed ${usage.heapUsed / 1024 / 1024 } MB`); // memoryUsage heapUsed 79.58684539794922 MB


console.log('///*** -------- ***///');
console.log('///*** Memory usage after GC ***///');
console.log('///*** -------- ***///');

newArray = null; // Allow the array to be garbage-collected

forceGC();

usage = process.memoryUsage();  // Memory usage after GC

console.log(`memoryUsage rss ${usage.rss / 1024 / 1024 } MB`); // memoryUsage rss 22.796875 MB
console.log(`memoryUsage heapTotal ${usage.heapTotal / 1024 / 1024 } MB`); // memoryUsage heapTotal 7.203125 MB
console.log(`memoryUsage heapUsed ${usage.heapUsed / 1024 / 1024 } MB`); // memoryUsage heapUsed 2.6322174072265625 MB


console.log('///*** -------- ***///');
console.log('///*** Memory after allocating so many items (1e8) ***///');
console.log('///*** -------- ***///');

newArray = new Array(); // Array(1e8) creates an empty array with a length property of 100 millions.

for (let index = 0; index < 1e8; index++) {
    newArray.push("some string");
    if (!(index%1000000)) {     // console Heap every 1m
        console.log(`Added elem index - ${index}`) // Added elem index - 83000000

        usage = process.memoryUsage();
        console.log(`memoryUsage rss ${usage.rss / 1024 / 1024 } MB`); // memoryUsage rss 747.33984375 MB
        console.log(`memoryUsage heapTotal ${usage.heapTotal / 1024 / 1024 } MB`); // memoryUsage heapTotal 647.13671875 MB
        console.log(`memoryUsage heapUsed ${usage.heapUsed / 1024 / 1024 } MB`); // memoryUsage heapUsed 642.9291000366211 MB
    }
}

// <--- Last few GCs --->

// [47515:0x104800000]     6200 ms: Mark-sweep 642.9 (648.1) -> 642.9 (647.1) MB, 1538.7 / 0.0 ms  (average mu = 0.093, current mu = 0.000) last resort GC in old space requested
// [47515:0x104800000]     7739 ms: Mark-sweep 642.9 (647.1) -> 642.9 (647.1) MB, 1538.8 / 0.0 ms  (average mu = 0.038, current mu = 0.000) last resort GC in old space requested

