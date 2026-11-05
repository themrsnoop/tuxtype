import { resetTimer } from './characters.js';
import { updateWPMLog } from './tick.js';
import { buildEndgame } from './endgame.js';
const completionContainer = document.getElementById("completionContainer");


const maxTime = 5; //in sec
let currentMiliseconds = maxTime * 1000;
export function Timer()
{
    if (currentMiliseconds <= 0) 
    {
        resetTimer();
        //stops logging WPM
        updateWPMLog(true);
        buildEndgame(maxTime);
        completionContainer.style.visibility = "visible";
        return;
    }

    currentMiliseconds -= 10;
    let currentSeconds = Math.floor(currentMiliseconds / 1000);

    //ensures all numbers have at least 2 digits | (2 = "02")
    let userFriendlySeconds = String(currentSeconds).padStart(2, '0');

    //cant use raw miliseconds because its always in the thousands
    let simplifiedMiliseconds = (currentMiliseconds % 1000) / 10;

    //ensures all numbers have at least 2 digits | (2 = "02")
    let userFriendlyMS = String(simplifiedMiliseconds).padStart(2, '0');

    const clock = document.getElementById("Clock");
    clock.innerHTML = `${userFriendlySeconds}:${userFriendlyMS}`;

    setTimeout(() => {
        Timer();
    }, 10);
}
