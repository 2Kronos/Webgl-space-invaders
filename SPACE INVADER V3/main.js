// main.js

import { vsSource, fsSource,  aVscource, aFscource } from "./shaders.js";

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

//Buffer for aliens
const alienBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, alienBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);

// Vertex shader for bullest and shapes
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

// Vertex shader  for aliens
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

// aleinProgam
const aleinProgam = gl.createProgram();
gl.attachShader(aleinProgam, alienVshader);
gl.attachShader(aleinProgam, alienFshader);
gl.linkProgram(aleinProgam);



// Get the pos attribute for bullets and shapes 
const positionLocation = gl.getAttribLocation(program, "pos");

//Get aPos for aliens
const alienLocation = gl.getAttribLocation(aleinProgam, "aPos");


// // Getting location of the matrices uniforms
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



// Define initial aleinVelocity (e.g., moving rightwards with a speed of 0.01 units per frame)
let aleinVelocity = [0, 0.0, 0.0];

function updateAlein(){

    if (alienData[0] + aleinVelocity[0] > 5.2 || alienData[0] + aleinVelocity[0] < -4.2) {
        // Reverse the direction of the aleinVelocity in the x-axis
        aleinVelocity[0] = -aleinVelocity[0];
       
        // Move down by a unit in the y-axis
        alienData[1] -= 0.5;
        alienData[4] -= 0.5;
        alienData[7] -= 0.5;
        alienData[10] -= 0.5;
        alienData[13] -= 0.5;
        alienData[16] -= 0.5;
    }

    // Update the point's position
    alienData[0] += aleinVelocity[0];
    alienData[3] += aleinVelocity[0];
    alienData[6] += aleinVelocity[0];
    alienData[9] += aleinVelocity[0];
    alienData[12] += aleinVelocity[0];
    alienData[15] += aleinVelocity[0];


    for (let j = 0; j < alienData.length; j += 18) {
        for (let i = 0; i < bulletData.length; i += 3) {
            if (Math.abs(bulletData[i] - alienData[j]) <= bulletSize + alienSize && 
                Math.abs(bulletData[i + 1] - alienData[j + 1]) <= bulletSize + alienSize) {
                console.log('Collision detected between bullet at position (' + bulletData[i] + ', ' + bulletData[i + 1] + ') and alien at position (' + alienData[j] + ', ' + alienData[j + 1] + ')');
                alienData.splice(j, 18);
                bulletData.splice(i, 3);
                break;
            }
        }
    }
}

function updateBullets() {
    for (let i = 0; i < bulletData.length; i += 3) {
        bulletData[i + 1] += velocity[1];

        for (let j = 0; j < alienData.length; j += 18) {
            if (Math.abs(bulletData[i] - alienData[j]) <= bulletSize + alienSize && 
                Math.abs(bulletData[i + 1] - alienData[j + 1]) <= bulletSize + alienSize) {
                console.log('Collision detected between bullet at position (' + bulletData[i] + ', ' + bulletData[i + 1] + ') and alien at position (' + alienData[j] + ', ' + alienData[j + 1] + ')');
                alienData.splice(j, 18);
                bulletData.splice(i, 3);
                break;
            }
        }
    }
}


// Update the bullet buffer data
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


function drawAlien() {
    // Update the buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);
   gl.enableVertexAttribArray(alienLocation);
   gl.vertexAttribPointer(alienLocation, 3, gl.FLOAT, false, 0, 0);
    // Draw the dot
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}



// Define sizes for bullets and aliens
let bulletSize = 0.2; // adjust this value based on the size of your bullets
let alienSize = 0.2; // adjust this value based on the size of your aliens

// ... (rest of your code)

function checkCollisions() {
    let bulletsToRemove = [];
    let aliensToRemove = [];

    for (let i = 0; i < bulletData.length; i += 3) {
        for (let j = 0; j < alienData.length; j += 18) {
            // Define the boundaries of the alien
            let alienTop = alienData[j + 1] + 0.5;
            let alienBottom = alienData[j + 1] - 0.5;
            let alienLeft = alienData[j];
            let alienRight = alienData[j] + 1;

            // Check if the bullet is within the boundaries of the alien
            if (bulletData[i] >= alienLeft && bulletData[i] <= alienRight && bulletData[i + 1] >= alienBottom && bulletData[i + 1] <= alienTop) {
                // Mark the bullet and alien for removal
                bulletsToRemove.push(i);
                aliensToRemove.push(j);
            }
        }
    }

    // Remove marked bullets and aliens
    for (let i = bulletsToRemove.length - 1; i >= 0; i--) {
        bulletData.splice(bulletsToRemove[i], 3);
    }
    for (let i = aliensToRemove.length - 1; i >= 0; i--) {
        alienData.splice(aliensToRemove[i], 18);
    }
}


// ... (rest of your code)



// Start animation loop
function animate() {
    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Update positions
    updateBullets();
    updateAlein();

    // Draw shapes
    gl.useProgram(aleinProgam);
    drawAlien();

    gl.useProgram(program);
    drawShapes();
    drawBullets();

    // Check for collisions
    checkCollisions();

    // Request next frame
    window.requestAnimationFrame(animate);
}

// Start animation loop
animate();



document.addEventListener('keydown', function(event) {
    if (event.key === " ") {
        bulletData.push(0, 0.1, 0);
          
    }
});



document.addEventListener('keydown', function(event) {
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
