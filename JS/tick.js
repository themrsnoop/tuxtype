import { caretTick } from './caret.js';
import { lerpColor } from './math.js';
import { getTimer } from './characters.js';

const wpmText = document.getElementById("wpm");
const cmdText = document.getElementById("cmds")
const cpmText = document.getElementById("cpm")



let char_log = 0;
export function logCharacter() {char_log++;}
export function unLogCharacter() {char_log--;}

let cmds = 0;
export function logCMDS() {cmds++;}

//used for the final graph! is updated on tick
let wpmLOG = [];

export function retrieveWPMOverTime() { return wpmLOG; }
export function retrieveCMDS() { return cmds; }

//tick ticks
let lastFrameTime;
let now;
let deltaTime;
let startTime

//important inialization, called by character.js
export function start()
{
  startTime = performance.now();
}

function tick()
{
    now = performance.now();

    //deltatime is in ms (integer)
    deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    if (getTimer!=true) {
        updateWPM(now);
        updateCPM(now);
        updateCMDS();
    }

    caretTick();
    requestAnimationFrame(tick);
}
tick();


function getCPM(cur)
{
    let elapsedTime = Math.max(1000, cur - startTime);
    let cpm = char_log / (elapsedTime / 60000);
    return cpm
}

//used below also
function getWPM(cur)
{
    let wpm = getCPM(cur)/5 //no need for allat bro..... this is how u do it. source: https://en.wikipedia.org/wiki/Words_per_minute |shhhhhhhhhhh
    return wpm
}


function updateWPM(cur){
    let wpm = getWPM(cur)
    wpmText.innerHTML = `wpm: ${Math.round(wpm)}`;

    //updates color
    if (wpm < 40) { wpmText.style.color = "rgb(255, 100, 100)"; }
    else if (wpm > 80) { wpmText.style.color = "rgb(100, 255, 113)"; }
    else wpmText.style.color = lerpColor(255, 162, 100, 170, 255, 100, ((wpm - 40) / 40));
}

function updateCPM(cur){
    let cpm = getCPM(cur)
    cpmText.innerHTML = `cpm: ${Math.round(cpm)}`;

    //updates color
    if (cpm < 40*5.36) { cpmText.style.color = "rgb(255, 100, 100)"; }
    else if (cpm > 80*5.36) { cpmText.style.color = "rgb(100, 255, 113)"; }
    else cpmText.style.color = lerpColor(255, 162, 100, 170, 255, 100, ((cpm - 40*5.36) / 40*5.36));
}

function updateCMDS(){
    cmdText.innerHTML = `cmds: ${cmds}`; //pulled from newline in characters
}

export function updateWPMLog(stopTimer)
{
    if (stopTimer) return;
    wpmLOG.push(getWPM(now));

    //runs every second
    setTimeout(() => {updateWPMLog(false)}, 1000);
}
