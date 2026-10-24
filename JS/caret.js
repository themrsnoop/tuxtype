const caret = document.getElementById("caret");
const caret_ghost = document.getElementById("caret_ghost");

//issue: its currently linear so trying to make it more noticeable at high typing speeds equally makes it apparent on low typing speeds
const caret_ghost_length = 4;

//the only function touched externally
let currentIndex;
export function updateCaretPosition(currentCharacterIndex) {
    currentIndex = currentCharacterIndex;
    setCaretPos();
}

function returnTargetCaretPosition(container)
{
    //moves the caret to the character that is about to be typed.
    //if the whole text has been typed, it sits at the right edge of the last character.
    const lastIndex = container.children.length - 1;
    const atEnd = currentIndex > lastIndex;
    const target = container.children[atEnd ? lastIndex : currentIndex];
    const rect = target.getBoundingClientRect();

    let X = atEnd ? rect.right : rect.left;
    let Y = rect.top;

    //basically just a vector2D
    return { x: X, y: Y };
}

//actually updates/sets the caret position. 
//depends entirely on "currentIndex" instead
function setCaretPos()
{
    const keyContainer = document.getElementById("letterContainer");
    if (!caret || !keyContainer || keyContainer.children.length === 0) return;

    const position = returnTargetCaretPosition(keyContainer);

    //simply updates the raw position of the caret 
    caret.style.left = `${position.x}px`;
    caret.style.top = `${position.y}px`;

    //inertia code
    let caret_inertia = inertia * caret_ghost_length;
    caret_ghost.style.width = `${caret_inertia}px`;

    //again, updates the raw position
    caret_ghost.style.left = `${position.x - (caret_inertia) + 4}px`;
    caret_ghost.style.top = `${position.y}px`;
}

let inertia;
let lastPosition;
function calculateInertia()
{
    let currentPosition = parseFloat(window.getComputedStyle(caret_ghost).left); //returns in px

    //inertia is literally just deltaX of the carets current position - the position it had last frame
    //typing faster means bigger gap between frames, which means more "inertia"
    inertia = currentPosition - lastPosition;

    lastPosition = currentPosition;
    setCaretPos();
}

//import { lerp } from './math.js';

let lastFrameTime;
let deltaTime;
function caretTick()
{
    const now = new Date();
    //deltatime is in ms (integer)
    deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    calculateInertia();
    requestAnimationFrame(caretTick);
}
caretTick();