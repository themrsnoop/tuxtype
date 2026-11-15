const caret = document.getElementById("caret");
const caret_ghost = document.getElementById("caret_ghost");
const keyContainer = document.getElementById("letterContainer");
//issue: its currently linear so trying to make it more noticeable at high typing speeds equally makes it apparent on low typing speeds
const caret_ghost_length = 4;
const GHOST_OFFSET = 4;

let inertia = 0;
let lastPosition = null;

//the only function touched externally
let currentIndex = 0;
export function updateCaretPosition(currentCharacterIndex) {
    currentIndex = currentCharacterIndex;
    setCaretPos();
}

function returnTargetCaretPosition()
{
    if (keyContainer.children.length === 0 || !Number.isInteger(currentIndex)) return null;
    //moves the caret to the character that is about to be typed.
    //if the whole text has been typed, it sits at the right edge of the last character.
    const lastIndex = keyContainer.children.length - 1;
    const atEnd = currentIndex > lastIndex;
    const target = keyContainer.children[atEnd ? lastIndex : currentIndex];
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
    if (!caret || !keyContainer || keyContainer.children.length === 0) return;

    const raw_position = returnTargetCaretPosition();
    if (!raw_position) return;

    const position = right_space(raw_position);

    //simply updates the raw position of the caret 
    caret.style.left = `${position.x}px`;
    caret.style.top = `${position.y}px`;

    //inertia code
    let caret_inertia = Math.abs(inertia) * caret_ghost_length; // you cant pass a negative width brodie
    caret_ghost.style.width = `${caret_inertia}px`;

    //again, updates the raw position
    caret_ghost.style.left = `${position.x - (caret_inertia) + GHOST_OFFSET}px`;
    caret_ghost.style.top = `${position.y}px`;
}

function calculateInertia()
{
    let pos = returnTargetCaretPosition();
    if (!pos) return;
    //inertia is literally just deltaX of the carets current position - the position it had last frame
    //typing faster means bigger gap between frames, which means more "inertia"
    //
    // idk watafuck that means, but your inertia calc using computed style is a feedback loop.
    // refactored using the caret's x pos instead
    //
    if (lastPosition !== null) inertia = pos.x - lastPosition;

    lastPosition = pos.x;
    //calculateInertia() runs on tick which means this runs on tick()
    setCaretPos();
}


/// we're setting pos in viewport using rel coords, so anything but 100% zoom cooks the pos. this bad boy will fix that
function right_space(pos) {
    if (getComputedStyle(caret).position === "fixed")return pos;

    const parent = caret.offsetParent;
    if (!parent || parent === document.body || parent === document.documentElement){
        return { x: pos.x + window.scrollX, y: pos.y +window.scrollY};
    }

    const xxx = parent.getBoundingClientRect();
    return { x: pos.x - xxx.left - parent.clientLeft, y: pos.y - xxx.top -parent.clientTop};
}

function onViewportChange(){
    lastPosition = null;
    inertia = 0;
    requestAnimationFrame(() => setCaretPos());
}
window.addEventListener("resize", onViewportChange);
window.visualViewport?.addEventListener("resize", onViewportChange);

//called by the master tick function in tick.js now.
export function caretTick() { calculateInertia(); }
