


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
