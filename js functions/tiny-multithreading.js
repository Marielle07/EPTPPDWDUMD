var Worker = require("tiny-worker");

var worker = new Worker(function () {
    self.onmessage = function (ev) {
        postMessage(ev.data);
    };
});
 
worker.onmessage = function (ev) {
    console.log(ev.data);
    secondtimer();
    worker.terminate();
};
 
worker.postMessage("Start 2 second timer.");
loopwithTimer();


async function loopwithTimer() {
    for (let i = 0; i < 99; i++) {
        console.log("infinite loop");
        await sleep(500);
    }
  }

async function secondtimer() {
    for (let i = 0; i < 99; i++) {
        await sleep(2000);
        
    }
  }

function sleep(ms) {
return new Promise((resolve) => {
    setTimeout(resolve, ms);
});
}