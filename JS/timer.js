import { resetTimer } from './characters.js';
import { updateWPMLog } from './tick.js';
import { buildEndgame } from './endgame.js';
const completionContainer = document.getElementById("completionContainer");

//defined later in FinalizeTime();
let maxTime; //in seconds
let currentMiliseconds;
let startTime = -1;

//uses actual seconds now instead of "trying" to use actual seconds.
const clock = document.getElementById("Clock");
function Timer(iTime)
{
    //basic initalizer
    if (startTime == -1) startTime = iTime;

    const now = performance.now(); //ms elapsed since start.
    const elapsedMS = now - startTime;

    if (currentMiliseconds <= 0)
    {
        resetTimer();
        //stops logging WPM
        updateWPMLog(true);
        buildEndgame(maxTime);
        completionContainer.style.visibility = "visible";
        return;
    }

    currentMiliseconds = (maxTime * 1000) - elapsedMS;
    let currentSeconds = Math.floor(currentMiliseconds / 1000);

    //ensures all numbers have at least 2 digits | (2 = "02")
    let userFriendlySeconds = String(Math.round(currentSeconds)).padStart(2, '0');

    //cant use raw miliseconds because its always in the thousands
    let simplifiedMiliseconds = (currentMiliseconds % 1000) / 10;

    //ensures all numbers have at least 2 digits | (2 = "02")
    let userFriendlyMS = String(Math.round(simplifiedMiliseconds)).padStart(2, '0');


    clock.innerHTML = `${userFriendlySeconds}:${userFriendlyMS}`;
    console.log(elapsedMS);

    requestAnimationFrame(Timer);
}


//wheel input
const timerWheel = document.getElementById("timeOptionsContainer");
timerWheel.addEventListener('wheel', (event) => {
  event.preventDefault();
  let scrollDirection = Math.sign(event.deltaY);
  shiftWheel(scrollDirection * -1)
});

//touchpad scroll
timerWheel.addEventListener('touchmove', (event) => {
  event.preventDefault();
  let scrollDirection = Math.sign(event.deltaY);
  shiftWheel(scrollDirection * -1)
});

//time options are all defined here. make sure to manually sync up the html as well.
function returnTime(i)
{
  switch (i)
  {
    case 0:
      return 5;
    case 1:
      return 15;
    case 2:
      return 30;
    case 3:
      return 45;
    case 4:
      return 60;
  }
}

//all manually defined btw, too lazy to create a function that calcs the gradient automatically.
function returnWheelMaskStyle(i)
{
  switch (i)
  {
    case 1:
      return "linear-gradient(to bottom, black 10%, transparent 50%)"
    case 2:
      return "linear-gradient(to bottom, transparent, black 25%, transparent 75%)";
    case 3:
      return "linear-gradient(to bottom, transparent 0%, black 50%, transparent 75%)";
    case 4:
      return "linear-gradient(to bottom, transparent 5%, black 75%, transparent)";
    case 5:
      return "linear-gradient(to bottom, transparent 10%, black)";
  }
}



const wheelContainer = document.getElementById("ExtrasContainer");
let containerY = wheelContainer.getBoundingClientRect().y; //in px
let buttonY = timerWheel.children[0].getBoundingClientRect().y; //specific element doesnt matter, just need the size of the button. | ALSO is in px.

let currentItem = 2; //[0, 4]
//needs to be -50%!
let currentY = containerY / 2; //finds it in px.


console.log(`stepSize calculated as: ${currentY}`);

function shiftWheel(dir)
{
  //transformation
  if ((currentItem + dir) < 0 || (currentItem + dir) > 4) return; //clamps
  currentItem += dir;

  currentY += (dir * buttonY);
  timerWheel.style.transform = `translate(0, ${currentY}%)`;
  timerWheel.style.maskImage = returnWheelMaskStyle(5 - (currentItem ));
}

//called by characters.js for initialization.
export function BeginTimer()
{
  maxTime = returnTime(4 - currentItem);
  currentMiliseconds = maxTime * 1000;
  Timer(performance.now());

  //plays fadeOut animation
  timerWheel.classList.add("fadeOutTimeWheel");

  //fades in old clock
  clock.classList.add("fadeInClock");
}

//initalizes style on load
shiftWheel(0)
