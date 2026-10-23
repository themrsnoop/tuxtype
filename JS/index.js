
//temporary function that randomly fills the "target" words on page reload.
function generateText()
{
    const targetText = document.getElementById("targetText");

    //im too lazy to manually make an array
    const linuxWordsStr = "ls sudo cat grep mkdir cp mv rm find cd nano update & disown pacman apt fastfetch | git pwd echo pip curl";
    const linuxWords = linuxWordsStr.split(" ");

    const words = 100;

    //ensures reset
    targetText.innerHTML = "";

    for (let i = 0; i < words; i++)
    {
        //returns random number [0 - (arraylen)]
        let randomIndex = Math.floor(Math.random() * linuxWords.length);

        //appends a random word to the text
        targetText.innerHTML += ` ${linuxWords[randomIndex]}`;
    }
}


//basic timer
let currentMiliseconds = 30000;
let runningTimer = false;
function Timer()
{
    if (currentMiliseconds <= 0)
    {
        runningTimer = false;
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
    clock.innerHTML = `//${userFriendlySeconds}:${userFriendlyMS}`;

    setTimeout(() => {
        Timer();
    }, 10);
}

function load()
{
    generateText();

    const textBox = document.getElementById("TextBox");

    textBox.addEventListener("input", function() {
        if (!runningTimer)
        {
            Timer();
            runningTimer = true;
        }
    });

}


document.addEventListener("DOMContentLoaded", function() {
    load();
});