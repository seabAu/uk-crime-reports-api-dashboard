export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export function sumIndefinite(...theArgs) {
    let total = 0;
    for (const arg of theArgs) {
        total += arg;
    }
    return total;
}
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export function length(numA, numB) {
    return Math.abs(numA - numB);
}

export function distanceTo(pointA, pointB) {
    const xDiff = (pointB.x - pointA.x) ** 2;
    const yDiff = (pointB.y - pointA.y) ** 2;

    return Math.sqrt(xDiff + yDiff);
}
