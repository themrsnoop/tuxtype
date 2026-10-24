import { randMand } from "./linux_gacha.js";
const data = await (await fetch("linux_commands.json")).json();
let keyContainer;
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

//permanent function that randomly fills the character array on page reload.
function generateText()
{
    let string_text = randMand(data); //returns string
    characters.length = 0;
    for (const letter of string_text) {
        updateCharacterArray(letter);
    }
    //adds a space per word
    updateCharacterArray(" ");
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

//CARET
//moves the caret to the character that is about to be typed.
//if the whole text has been typed, it sits at the right edge of the last character.
function updateCaretPosition()
{
    const caret = document.getElementById("caret");
    if (!caret || !keyContainer || keyContainer.children.length === 0) return;

    const lastIndex = keyContainer.children.length - 1;
    const atEnd = currentCharacterIndex > lastIndex;
    const target = keyContainer.children[atEnd ? lastIndex : currentCharacterIndex];

    const rect = target.getBoundingClientRect();
    caret.style.top = `${rect.top}px`;
    caret.style.left = `${atEnd ? rect.right : rect.left}px`;
}

//INPUT
let currentKey = "";
let currentCharacterIndex = 0;

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

    if (keyname == "ArrowLeft" || keyname == "Backspace")
    {
        updateCharacterIndex(-1);
        currentCharacter = keyContainer.children[currentCharacterIndex];
        updateSpanClass(currentCharacter, "pending");
        updateCaretPosition();
        return;
    }

    //terry davis move
    if (keyname.length !== 1) return;
    if (currentCharacterIndex >= characters.length) return;

    currentCharacter = keyContainer.children[currentCharacterIndex];

    let correctCharacter = characters[currentCharacterIndex].char.toLowerCase();

    if (correctCharacter == keyname.toLowerCase())
    {
        updateSpanClass(currentCharacter, "correct");
    }
    else updateSpanClass(currentCharacter, "incorrect");

    updateCharacterIndex(1);
    updateCaretPosition();
}

function load()
{
    generateText();
    updateCaretPosition(); //place caret on the first character

    window.addEventListener("keydown", keyInput);
}

load();

//updates caret position on window resize
window.addEventListener('resize', updateCaretPosition);
