import { lerpColor } from './math.js';
import { lerp, findArrayAverage} from './math.js';
import { retrieveWPMOverTime, retrieveCMDS } from './tick.js';

//initalizes canvas and resolution
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const X = canvas.getBoundingClientRect().width;
const Y = canvas.getBoundingClientRect().height;
canvas.width = Math.round(X);
canvas.height = Math.round(Y);

//set later but accessed everywhere
let WPMs = [];

function highestWPM() { return Math.max(...WPMs); }

//returns the exact WPM if known at a given time and lerps otherwise.
function returnWPM(t)
{
    //checks to see if already exists
    if (WPMs[t] !== undefined) return WPMs[t];

    //finds its neighbors
    const floored = Math.floor(t);
    const ceiled = Math.ceil(t);

    //lerps with distance
    const alpha = t - floored;

    //the question becomes, should we be LINEAR, quadratically, or cubicly interpolating?
    //idk try each one, see which one you like the best.
    const interpolationDegree = 1;
    return lerp(WPMs[floored], WPMs[ceiled], (Math.pow(alpha, interpolationDegree)));
}


const padding = 5;

//sets the max Y of the graph to either 150 or the highest WPM scored.
const range = Math.max(120, highestWPM() + padding);
function RenderGraph(totalTime)
{
    const xPadding = X / padding;
    const yPadding = Y / range;
    
    for (let x = 0; x < xPadding; x++)
    {
        //current time relative to the x-axis
        let time = (x / xPadding) * totalTime;
        let columnY = returnWPM(time);

        //build the dots column by column until reaching the defined y value
        for (let y = 0; y < columnY; y++)
        {
            ctx.fillStyle = lerpColor(245, 162, 100, 170, 255, 100, (y / range));
            ctx.fillRect(x * padding, Y - (y * yPadding), 2, 2);
        }
    }
}

function renderAxisss()
{
    const axisCount = 4;
    let spacing = Y / axisCount;

    for (let y = 1; y < axisCount; y++)
    {
        //line
        ctx.beginPath();
        ctx.strokeStyle = "rgb(64, 64, 64)"; 
        ctx.lineWidth = 1;
        ctx.moveTo(0, (y * spacing));
        ctx.lineTo(X, (y * spacing));
        ctx.stroke();
        //line

        //text
        ctx.font = "16px monospace";
        ctx.fillStyle = "rgb(128, 128, 128)";

        const textTranslation = 12;
        ctx.fillText(`${Math.abs((range / axisCount) * (y - axisCount))}wpm`, textTranslation, (y * spacing) - textTranslation);
        //text
    }
}


//lame basic line graph
function renderLine()
{
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 235, 56, 0.75)"; 
    ctx.lineWidth = 2;
    for (let x = 0; x < X; x++)
    {
        ctx.lineTo(x * xPadding, Y - (WPMs[x] * yPadding));
    }
    ctx.stroke();
}


export function buildEndgame(totalTime)
{
    //retrieves from tick
    WPMs = retrieveWPMOverTime();
    RenderGraph(totalTime);
    renderAxisss();

    //avg ofc
    const wpmText = document.getElementById("finalWPM");
    let avgWPM = Math.round(findArrayAverage(WPMs));
    wpmText.innerHTML = `WPM=${avgWPM}`

    const cpmText = document.getElementById("finalCPM");
    cpmText.innerHTML = `CPM=${avgWPM * 5}` //yup.

    const finalCmds = retrieveCMDS();
    const cmdsText = document.getElementById("finalCMD");
    cmdsText.innerHTML = `CMDs=${finalCmds}`;

    const cur = document.getElementById("selectedDistro")
    const par = cur.parentElement;
    const currentDistro = par.textContent;
    const distroText = document.getElementById("distroMode");
    distroText.innerHTML = `Distro-Mode=${currentDistro}`;
}