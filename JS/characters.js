import { randMand } from './linux_gacha.js';
import { update_meaning } from './linux_meaning.js';
import { updateCaretPosition } from './caret.js';
import { BeginTimer } from './timer.js';
import { logCharacter, logCMDS, unLogCharacter, updateWPMLog, start } from './tick.js';
import { get_current_data, update_data } from "./distro_selector.js";

let keyContainer;

const char_state = {
    Incorrect: 'incorrect',
    Correct: 'correct',
    Pending: 'pending'
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

export const characters = current_char_array.charray;

// random helpers
function updateCharacterArray(c) {
    const newCharacterObject = { char: c, real: null, state: char_state.Pending };
    characters.push(newCharacterObject);
}

// ALSO updates the charArray bc the enum was never actually being updated from .Pending!
function updateSpanClass(span, classString)
{
    // spanStuff
    span.className = "";
    span.classList.add(classString);
}

function updateCharacterState(index, enumString)
{
    if (!isValidIndex(characters, index)) return;

    switch (enumString.toLowerCase()) {
        case "pending":
            characters[index].state = char_state.Pending;
            break;
        case "correct":
            characters[index].state = char_state.Correct;
            break;
        case "incorrect":
            characters[index].state = char_state.Incorrect;
            break;
        default:
            break;
    }
}

function isValidIndex(array, i) { return (i >= 0 && i < array.length); }

// permanent function that randomly fills the character array on page reload.
function generateText()
{
    let string_text = randMand(get_current_data()); // returns string
    characters.length = 0;
    for (const letter of string_text) {
        updateCharacterArray(letter);
    }
    // adds a space per word
    update_meaning(string_text)
    updateCharacterArray(" ");
    renderContainer();
}


function renderContainer()
{
    keyContainer = document.getElementById("letterContainer");
    keyContainer.innerHTML = ""; // thomas you naughty dog why did you not do this | whoops
    characters.forEach(character => {
        let newLetter = document.createElement('span');
        newLetter.innerHTML = character.char;
        updateSpanClass(newLetter, "pending")
        keyContainer.appendChild(newLetter);
    });
}

// INPUT
let currentCharacterIndex = 0;

let currentCharacter;

function updateCharacterIndex(modifier)
{
    // sets index no less than 0;
    currentCharacterIndex = Math.max((currentCharacterIndex + modifier), 0);
}

function new_line(){
    generateText();
    updateCharacterIndex(-Number.MAX_SAFE_INTEGER);
    updateCaretPosition(currentCharacterIndex);
    logCMDS();
}

// there is only one bool and its stored here. therefore, it must also be set here by timer.js
let runningTimer = false;
export function resetTimer() { runningTimer = false };
export function getTimer() { return runningTimer; };

function initialize()
{
    BeginTimer();
    runningTimer = true;

    // removes blinking on typing start
    const caret = document.getElementById("caret");
    const caret_ghost = document.getElementById("caret_ghost");
    caret.className = "";
    caret_ghost.className = "";

    start(); //tick start.
    //begins logging WPM
    updateWPMLog(false);
}

let currentKey = "";

function keyInput(event)
{
    // basically a general do once check now
    if (!runningTimer) initialize();

    const keyname = event.key;
    currentKey = keyname;

    if (keyname == "ArrowLeft" || keyname == "Backspace")
    {
        updateCharacterIndex(-1);
        if (characters[currentCharacterIndex].state === 'correct') {
            unLogCharacter();
        }
        currentCharacter = keyContainer.children[currentCharacterIndex];
        updateSpanClass(currentCharacter, "pending");
        updateCharacterState(currentCharacterIndex, "pending");
        updateCaretPosition(currentCharacterIndex);
        return;
    }
    else if (keyname == "Enter"){
        //if (characters[currentCharacterIndex]!=characters.length-1) return;
        new_line()
        return
    }

    //terry davis move
    if (keyname.length !== 1) return;
    if (!isValidIndex(characters, currentCharacterIndex)) return;

    currentCharacter = keyContainer.children[currentCharacterIndex];

    let correctCharacter = characters[currentCharacterIndex].char;

    if (correctCharacter == keyname)
    {
        updateSpanClass(currentCharacter, "correct");
        updateCharacterState(currentCharacterIndex, "correct");
        logCharacter()
    }
    else
    {
        updateSpanClass(currentCharacter, "incorrect");
        updateCharacterState(currentCharacterIndex, "incorrect");
    }

    updateCharacterIndex(1);
    updateCaretPosition(currentCharacterIndex);
}


export function load()
{
    generateText();
    updateCaretPosition(currentCharacterIndex); // place caret on the first character
    update_data();

    window.addEventListener("keydown", keyInput);
    window.addEventListener("keyup", function(){
        //updateCaretPosition(currentCharacterIndex);
    });
}

load();

// updates caret position on window resize
window.addEventListener('resize', updateCaretPosition);
