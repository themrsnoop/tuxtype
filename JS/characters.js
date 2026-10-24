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

const char_array = {
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
    index: 0,
    press_down: null,
    let_up: null
}

function state_create(manuscript) {
    return {
        charray: [...manuscript].map(ch => ({ char: ch, real: null, state: char_state.Pending })),
        index: 0,
        press_down: null,
        let_up: null
    };
}


//CONTAINER RENDERING
function renderContainer()
{
    keyContainer = document.getElementById("letterContainer");
    char_array.charray.forEach(character => {
        let newLetter = document.createElement('span');
        newLetter.innerHTML = character.char;
        console.log(`adding: ${newLetter.innerHTML}`);
        keyContainer.appendChild(newLetter);
    });
}




//INPUT
let currentKey = "";
let currentCharacterIndex = 0;

let currentCharacter;
let keyContainer;

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

    if (keyname == "ArrowLeft" || keyname == "Backspace")
    {
        updateCharacterIndex(-1);
    }
    else updateCharacterIndex(1);

    console.log(`${currentCharacterIndex}`);
    currentCharacter = Array.from(keyContainer.children)[currentCharacterIndex];
}

function load()
{
    window.addEventListener("keydown", keyInput);

    renderContainer();
}

document.addEventListener("DOMContentLoaded", function() {
    load();
});