export function updateCaretPosition()
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
