import { vsSource } from "./shaders.js";
import { fsSource } from "./shaders.js";


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');


if (!gl) {
    throw new Error("WebGL not supported");
}

// Vertices
const vertexData = [
    0.3, 0.9, 0,

    0.3, 0.6, 0,
    
    0.3, 0.3, 0,

    0.3, 0.0, 0,

    0.3, -0.3, 0,

    0.3, -0.6, 0,

    0.3, -0.9, 0, 
];

const colorData = [
    0.3, 0.4, 0,

    0.3, 0.7, 0,
    
    0.4, -0.2, 0,

    -0.3, 0.1, 0,

    0.3, 1, 0,

    0.9, -0.4, 0,

    1, 0.4, 0, 
];

// Buffer data
const buffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

// Buffer color
const colorbuffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
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

//position attib location
const positionLocation = gl.getAttribLocation(program, "pos");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

//color atbb location
const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
draw();
function draw(){ 
    gl.clearColor(0, 0, 0, 0); // Set clear color
    

    window.requestAnimationFrame(draw);
}
let prim = 0;
// let add = 1;





window.spawnDot = function(){

   // Increment prim value
   prim++;

   // Draw points based on the value of prim
   for (let i = 1; i <= prim; i++) {
       gl.drawArrays(gl.POINTS, i, 1);
   }

   // Check if prim value is 7
   if (prim === 7) {
       prim = 0; // Reset prim value
   } else {
       window.requestAnimationFrame(draw); // Continue animation if prim is not 7
   }  


   
  
}








