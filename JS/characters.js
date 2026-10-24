//CHARACTER DEFINITIONS

const char_state = {
    Incorrect: 'incorrect',
    Correct: 'correct',
    Pending: 'pending'
}

const character = {
    char: 'a',
    real: null,
    state: char_state.Pending
}

const current_char_array = {
    charray: 
    [
        {char:'p', real: null, state: char_state.Pending},
        {char:'l', real: null, state: char_state.Pending},
        {char:'a', real: null, state: char_state.Pending},
        {char:'c', real: null, state: char_state.Pending},
        {char:'e', real: null, state: char_state.Pending},
        {char:'h', real: null, state: char_state.Pending},
        {char:'o', real: null, state: char_state.Pending},
        {char:'l', real: null, state: char_state.Pending},
        {char:'d', real: null, state: char_state.Pending},
        {char:'e', real: null, state: char_state.Pending},
        {char:'r', real: null, state: char_state.Pending}
    ],
    press_down: null,
    let_up: null
}

const characters = current_char_array.charray;


//CONTAINER RENDERING /---------------------------------------------------------------------------------------------------------------------------------------------------------------------------/

//random helpers
function updateCharacterArray(c) {  
    const newCharacterObject = { char: c, real: null, state: char_state.Pending };
    characters.push(newCharacterObject);
    console.log(`adding ${c}`); 
}

function updateSpanClass(span, classString)
{
    //resets array
    span.className = "";
    span.classList.add(classString);
}

function isValidIndex(array, i) { return (i >= 0 && i < array.length); }

//temporary function that randomly fills the character array on page reload.
function generateText()
{
    //im too lazy to manually make an array
    const linuxWordsStr = "ls sudo cat grep mkdir cp mv rm find cd nano update & disown pacman apt fastfetch | git pwd echo pip curl";
    const linuxWords = linuxWordsStr.split(" ");

    const words = 100;

    //clears the array and ensures reset
    characters.length = 0;

    for (let i = 0; i < words; i++)
    {
        //returns random number [0 - (arraylen)]
        let randomIndex = Math.floor(Math.random() * linuxWords.length);

        //appends a random word to the text
        let randomWord = linuxWords[randomIndex];

        if (!isValidIndex(linuxWords, randomIndex)) continue;


        //goes letter by letter
        for (let i = 0; i < randomWord.length; i++) {
            let letter = randomWord[i]
            updateCharacterArray(letter);
        }
        //adds a space per word
        updateCharacterArray(" ");
    }
    renderContainer();
}


function renderContainer()
{
    keyContainer = document.getElementById("letterContainer");
    characters.forEach(character => {
        let newLetter = document.createElement('span');
        newLetter.innerHTML = character.char;
        updateSpanClass(newLetter, "pending")
        console.log(`rendering: ${newLetter.innerHTML}`);
        keyContainer.appendChild(newLetter);
    });
}




//INPUT
let currentKey = "";
let currentCharacterIndex = -1;

let currentCharacter;

function updateCharacterIndex(modifier)
{
    //sets index no less than 0;
    currentCharacterIndex = Math.max((currentCharacterIndex + modifier), 0);
}

function keyInput(event)
{
    const keyname = event.key;
    console.log(`${keyname} was pressed!`);
    currentKey = keyname;

    if (keyname == "Shift") return;

    if (keyname == "ArrowLeft" || keyname == "Backspace") updateCharacterIndex(-1);
    else updateCharacterIndex(1);


    currentCharacter = Array.from(keyContainer.children)[currentCharacterIndex];

    updateCaretPosition();

    //lowercase to ensure campatiability 
    let correctCharacter = characters[currentCharacterIndex].char.toLowerCase();
    
    if (keyname == "Backspace")
    {
        updateSpanClass(Array.from(keyContainer.children)[currentCharacterIndex + 1], "pending");
    } 
    else if (correctCharacter == keyname.toLowerCase())
    {
        updateSpanClass(currentCharacter, "correct");
    }
    else updateSpanClass(currentCharacter, "incorrect");

    console.log(`${currentCharacterIndex}`);
    currentCharacter = Array.from(keyContainer.children)[currentCharacterIndex];
}

function updateCaretPosition()
{
    const caret = document.getElementById("caret");

    const currentCharacterRect = currentCharacter.getBoundingClientRect();
    caret.style.top = `${currentCharacterRect.top}px`;
    caret.style.left = `${currentCharacterRect.left}px`;
}





function load()
{
    generateText();

    window.addEventListener("keydown", keyInput);
}

document.addEventListener("DOMContentLoaded", function() {
    load();
});

//updates caret position on window resize
window.addEventListener('resize', updateCaretPosition);
