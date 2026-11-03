import { caretTick } from './caret.js';
import { returnCorrectWordCount } from './characters.js';
import { returnArchivedWordCount } from './characters.js';

//tick ticks
let lastFrameTime;
let deltaTime;
let now;
function tick()
{
    now = new Date();
    //deltatime is in ms (integer)
    deltaTime = now - lastFrameTime;
    lastFrameTime = now;

    caretTick();
    requestAnimationFrame(tick);
}
tick();



let startTime = 0;
export function beginTrackingWPM() {startTime = new Date(); updateWPM()}

const wpmText = document.getElementById("wpm");
const cmdsTxt = document.getElementById("words");
const wpmTime = 0.5;
//updates every 0.5s
function updateWPM()
{
    let words = returnCorrectWordCount() + (returnArchivedWordCount() - 0);
    let elapsedTime = Math.max(1000, now - startTime);
    //this gives words per second
    let wps = words / (elapsedTime / 1000);
    let wpm = 60 * wps;

    wpmText.innerHTML = `wpm: ${Math.round(wpm)}`;
    cmdsTxt.innerHTML = `cmds: ${Math.round(words)} |`;

    //loops
    setTimeout(() => {updateWPM();}, wpmTime * 1000.0);
}
