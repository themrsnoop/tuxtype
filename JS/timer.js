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

    requestAnimationFrame(Timer);
}



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

let currentItem = 2; //[0, 4]
const increment = 21.5; //fine tuned.

function setWheel(index)
{
  if (index < 0 || index > 4) return; //clamps
  currentItem = index;

  const y = -50 + (currentItem - 2) * increment;
  timerWheel.style.transform = `translate(0, ${y}%)`;
  timerWheel.style.maskImage = returnWheelMaskStyle(5 - currentItem);
}

function shiftWheel(dir) {
  setWheel(currentItem + dir);
}

//called by characters.js for initialization.
export function BeginTimer()
{
  maxTime = returnTime(4 - currentItem);
  currentMiliseconds = maxTime * 1000;
  Timer(performance.now());

  //plays fadeOut animation
  timerWheel.classList.add("fadeOutTimeWheel");

  const statContents = document.getElementById("ExtrasContainer").children;

  //fades in all the elements asside from the timer wheel AND the regular timer.
  clock.classList.add("fadeInClock"); //bc its set manually here
  for (const stat of statContents) {
    if (stat.id == "timeOptionsContainer" || stat.id == "Clock") continue;
    stat.classList.add("fadeInClock");
  }
}

//wheel input
const timerWheel = document.getElementById("timeOptionsContainer");
timerWheel.addEventListener('wheel', (event) => {
  event.preventDefault();
  let scrollDirection = Math.sign(event.deltaY);
  shiftWheel(scrollDirection * -1)
});

//allows for indivudual button clicking
const buttons = timerWheel.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
     setWheel(Number(button.dataset.btnItem));
  });
});

//initalizes style on load
shiftWheel(0)
