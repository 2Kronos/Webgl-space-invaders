import { aVscource } from "./shaders.js";
import { aFscource } from "./shaders.js";

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error("WebGL not supported");
}

// Vertices
let alienData = [
    0.5,0.5, 0,
    -0.5,0.5, 0,
    -0.5,-0.5, 0,

    -0.5,-0.5, 0,
    0.5,-0.5, 0,
    0.5,0.5, 0,
];


// Buffer
const alienBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, alienBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);

// Vertex shader
const alienVshader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(alienVshader, aVscource);
gl.compileShader(alienVshader);

// Fragment shader for aliens
const alienFshader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(alienFshader, aFscource);
gl.compileShader(alienFshader);

// aleinProgam
const aleinProgam = gl.createProgram();
gl.attachShader(aleinProgam, alienVshader);
gl.attachShader(aleinProgam, alienFshader);
gl.linkProgram(aleinProgam);

const alienLocation = gl.getAttribLocation(aleinProgam, "aPos");
gl.enableVertexAttribArray(alienLocation);
gl.vertexAttribPointer(alienLocation, 3, gl.FLOAT, false, 0, 0);

// Define initial aleinVelocity (e.g., moving rightwards with a speed of 0.01 units per frame)
let aleinVelocity = [0.009, 0.0, 0.0];

function updateAlein(){

    if (alienData[0] + aleinVelocity[0] > 2.2 || alienData[0] + aleinVelocity[0] < -1.2) {
        // Reverse the direction of the aleinVelocity in the x-axis
        aleinVelocity[0] = -aleinVelocity[0];
       
        // Move down by a unit in the y-axis
        alienData[1] -= 0.1;
        alienData[4] -= 0.1;
        alienData[7] -= 0.1;
        alienData[10] -= 0.1;
        alienData[13] -= 0.1;
        alienData[16] -= 0.1;
    }

    // Update the point's position
    alienData[0] += aleinVelocity[0];
    alienData[3] += aleinVelocity[0];
    alienData[6] += aleinVelocity[0];
    alienData[9] += aleinVelocity[0];
    alienData[12] += aleinVelocity[0];
    alienData[15] += aleinVelocity[0];
}

function drawAlien() {
    // Update the buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alienData), gl.STATIC_DRAW);

    // Draw the dot
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Start animation loop
function animate() {
    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(aleinProgam);
    updateAlein();
    drawAlien();
    window.requestAnimationFrame(animate);
}

// Start animation loop
animate();
