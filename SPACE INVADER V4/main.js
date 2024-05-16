// main.js

import { vsSource, fsSource, aVscource, aFscource } from "./shaders.js";

const canvas = document.querySelector('canvas');
window.gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error("WebGL not supported");
}

// Vertices for bullets
let bulletData = [0, -0.9, 0];

// Vertices for static shapes
let shapeData = [
    0, -0.1, 0,
    -0.3, -2, 0,
    0.3, -2, 0,
]; // Add your static shapes here

// Vertices for aliens (square)
let alienData = [
    0.5, 0.5, 0,
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
];

// Buffer for bullets
const bulletBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bulletBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bulletData), gl.DYNAMIC_DRAW);

// Buffer for static shapes
const shapeBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeData), gl.STATIC_DRAW);

// Buffer for aliens
const alienBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, alienBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);

// Vertex shader for bullets and shapes
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

// Vertex shader for aliens
const alienVshader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(alienVshader, aVscource);
gl.compileShader(alienVshader);

// Fragment shader for bullets and shapes
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

// Fragment shader for aliens
const alienFshader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(alienFshader, aFscource);
gl.compileShader(alienFshader);

// Program for bullets and shapes
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Program for aliens
const alienProgram = gl.createProgram();
gl.attachShader(alienProgram, alienVshader);
gl.attachShader(alienProgram, alienFshader);
gl.linkProgram(alienProgram);

// Get the pos attribute for bullets and shapes 
const positionLocation = gl.getAttribLocation(program, "pos");

// Get aPos for aliens
const alienLocation = gl.getAttribLocation(alienProgram, "aPos");

// Getting location of the matrices uniforms
const uScaleMatrix = gl.getUniformLocation(program, `u_ScaleMatrix`);
const uTranslateMatrix = gl.getUniformLocation(program, `u_TranslateMatrix`);

// Scaling matrix 
const scaledMatrix = [
    0.2, 0, 0, 0,
    0, 0.2, 0, 0,
    0, 0, 0.2, 0,
    0, 0, 0, 1,
];

let translatedMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, -0.6, 0, 1,
];

// Define initial velocity (e.g., moving upwards with a speed of 0.01 units per frame)
let velocity = [0.0, 0.1, 0.0];

// Define initial alien velocity (e.g., moving rightwards with a speed of 0.01 units per frame)
let alienVelocity = [0.09, 0.0, 0.0];

function updateAlien() {
    if (alienData[0] + alienVelocity[0] > 5.2 || alienData[0] + alienVelocity[0] < -4.2) {
        // Reverse the direction of the alienVelocity in the x-axis
        alienVelocity[0] = -alienVelocity[0];

        // Move down by a unit in the y-axis
        alienData[1] -= 0.5;
        alienData[4] -= 0.5;
        alienData[7] -= 0.5;
        alienData[10] -= 0.5;
        alienData[13] -= 0.5;
        alienData[16] -= 0.5;
    }

    // Update the point's position
    alienData[0] += alienVelocity[0];
    alienData[3] += alienVelocity[0];
    alienData[6] += alienVelocity[0];
    alienData[9] += alienVelocity[0];
    alienData[12] += alienVelocity[0];
    alienData[15] += alienVelocity[0];
}

// Update the bullet's position
function updateBullets() {
    for (let i = 0; i < bulletData.length; i += 3) {
        bulletData[i + 1] += velocity[1];
    }
}

// Draw the bullet buffer data
function drawBullets() {
    gl.bindBuffer(gl.ARRAY_BUFFER, bulletBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bulletData), gl.DYNAMIC_DRAW);

    // Apply the transformation matrices
    gl.uniformMatrix4fv(uScaleMatrix, false, scaledMatrix);
    gl.uniformMatrix4fv(uTranslateMatrix, false, translatedMatrix);

    // Draw the bullets
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, bulletData.length / 3);
}

// Draw the static shapes
function drawShapes() {
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, shapeData.length / 3);
}

// Draw the alien
function drawAlien() {
    gl.bindBuffer(gl.ARRAY_BUFFER, alienBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(alienLocation);
    gl.vertexAttribPointer(alienLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Check for collisions between bullets and aliens
function checkCollisions() {
    for (let i = bulletData.length - 3; i >= 0; i -= 3) {
        for (let j = alienData.length - 18; j >= 0; j -= 18) {
            // Define the boundaries of the alien
            let alienLeft = Math.min(alienData[j], alienData[j + 3], alienData[j + 6], alienData[j + 9], alienData[j + 12], alienData[j + 15]);
            let alienRight = Math.max(alienData[j], alienData[j + 3], alienData[j + 6], alienData[j + 9], alienData[j + 12], alienData[j + 15]);
            let alienBottom = Math.min(alienData[j + 1], alienData[j + 4], alienData[j + 7], alienData[j + 10], alienData[j + 13], alienData[j + 16]);
            let alienTop = Math.max(alienData[j + 1], alienData[j + 4], alienData[j + 7], alienData[j + 10], alienData[j + 13], alienData[j + 16]);

            // Check if the bullet is within the boundaries of the alien
            if (bulletData[i] >= alienLeft && bulletData[i] <= alienRight && bulletData[i + 1] >= alienBottom && bulletData[i + 1] <= alienTop) {
                // Collision detected, remove the alien and the bullet
                alienData.splice(j, 18);
                bulletData.splice(i, 3);
                break;
            }
        }
    }
}

// Start animation loop
function animate() {
    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update positions
    updateAlien();
    updateBullets();

    // Check for collisions
    checkCollisions();

    // Draw
    gl.useProgram(alienProgram);
    drawAlien();

    gl.useProgram(program);
    drawShapes();
    drawBullets();

    // Request next frame
    window.requestAnimationFrame(animate);
}

// Start animation loop
animate();

document.addEventListener('keydown', function (event) {
    if (event.key === " ") {
        bulletData.push(0, -0.9, 0);
    }
});

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "ArrowLeft":
            translatedMatrix[12] -= 0.1;
            break;
        case "ArrowRight":
            translatedMatrix[12] += 0.1;
            break;
        case "ArrowUp":
            translatedMatrix[13] += 0.1;
            break;
        case "ArrowDown":
            translatedMatrix[13] -= 0.1;
            break;
    }
});
