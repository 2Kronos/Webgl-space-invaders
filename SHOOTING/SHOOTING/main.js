import { vsSource } from "./shaders.js";
import { fsSource } from "./shaders.js";

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error("WebGL not supported");
}

// Vertices
const vertexData = [
    0, -0.9, 0, //0
    0, -0.89, 0, //1
    0, -0.65, 0, //2
    0, -0.4, 0, //3
    0, -0.15, 0, //4
    0, 0.1, 0, //5
    0, 0.35, 0, //6
    0, 0.6, 0, //7
    0, 0.85, 0, //8
    0, 0.95, 0, //9
];

// Buffer
const buffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

// Vertex shader
const vertexShaderSourceCode = vsSource;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

// Error checking for vertex shader
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(`Vertex shader compilation error:
     ${gl.getShaderInfoLog(vertexShader)}
     `);
}

// Fragment shader
const fragmentShaderSourceCode = fsSource;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

// Error checking for fragment shader
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(`Fragment shader compilation error:
     ${gl.getShaderInfoLog(fragmentShader)}
     `);
}

// Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Linking error
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Shader program linking error:
     ${gl.getProgramInfoLog(program)}
     `);
}

const positionLocation = gl.getAttribLocation(program, "pos");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const uniformLocation = gl.getUniformLocation(program, `shift`);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
let myshift = 0;
let shift = 0.00001;


// ... (rest of your code)

let shots = []; // Array to hold all shots
let shotSpeed = 0.24;
function draw() {
    myshift += shift; 
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    
    // Use the shader program
    gl.uniform1f(uniformLocation, myshift);

    // Always draw the spaceship
    gl.drawArrays(gl.POINTS, 0, 1);

    // Draw all shots
    for (let i = 0; i < shots.length; i++) {
        let shot = shots[i];
        if (shot[0] > 0) { // Only move vertices above -0.9
            shot[0] += shotSpeed; // Move shot up
            shot[1] += shotSpeed;
        }
        gl.drawArrays(gl.POINTS, shot[0], 1); // Draw lines instead of points
        if (shot[0] > 9) { // If shot has moved off screen
            shots.splice(i, 1); // Remove shot from array
            i--; // Decrement i to account for removed shot
        }
    }

    // Request the next frame
    window.requestAnimationFrame(draw);
}

window.shoot = function() {
    // Add new shot at position 1
    shots.push([1, 2]);
}

draw();
