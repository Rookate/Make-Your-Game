export function throttle(func, wait) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            func(...args);
            lastTime = now;
        }
    };
}

let lastTime = performance.now();
let frameCount = 0;
let fpsDisplay = document.createElement("div");
fpsDisplay.style.position = "absolute";
fpsDisplay.style.top = "20px";
fpsDisplay.style.left = "20px";
fpsDisplay.style.color = "white";
document.body.appendChild(fpsDisplay);

function updateFPS() {
    let now = performance.now();
    frameCount++;

    if (now - lastTime >= 1000) {
        fpsDisplay.textContent = `FPS: ${frameCount}`;
        frameCount = 0;
        lastTime = now;
    }

    requestAnimationFrame(updateFPS);
}

requestAnimationFrame(updateFPS);