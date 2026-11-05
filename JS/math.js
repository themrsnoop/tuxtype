//tf you mean js doesnt have a lerp function by default
export function lerp(A, B, alpha) { return A * (1 - alpha) + B * alpha; }

export function lerpColor(aR, aG, aB, bR, bG, bB, A)
{
    let r = lerp(aR, bR, A);
    let g = lerp(aG, bG, A);
    let b = lerp(aB, bB, A);

    return `rgb(${r}, ${g}, ${b})`;
}

//returns average of all numbers in an array
export function findArrayAverage(arr)
{
    let sum = 0;
    arr.forEach(num => {
        sum += num;
    });

    return (sum / arr.length);
}