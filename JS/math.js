//tf you mean js doesnt have a lerp function by default
export function lerp(A, B, alpha)
{
    //clamps alpha to (0, 1);


    return A * (1 - alpha) + B * alpha;
}