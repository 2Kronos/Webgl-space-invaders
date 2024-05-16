
import { vsSource, fsSource,  aVscource, aFscource } from "./shaders.js";

const canvas = document.querySelector('canvas');
window.gl = canvas.getContext('webgl');
const alienImage = document.getElementById('alienImage');
const shipImage = document.getElementById('shipImage');


alienImage.style.display = 'none';
shipImage.style.display = 'none';


if (!gl) {
    throw new Error("WebGL not supported");
}

// Vertices for bullets
let bulletData = [];

// Vertices for static shapes
let shapeData = [

    0.5, 0.5, 0,
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
   
];

// Vertices for a single alien (square)
let singleAlienData = [
    0.5, 0.5, 0,
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
];

// Texture coordinates for a single alien
const textureCoordinate = new Float32Array([
    1.0, 1.0, // Bottom right
    0.0, 1.0, // Bottom left
    0.0, 0.0, // Top left
    0.0, 0.0, // Top left
    1.0, 0.0, // Top right
    1.0, 1.0, // Bottom right
]);

const shipTextureCoordinate = new Float32Array([
    1.0, 1.0, // Bottom left
    0.0, 1.0, // Top left
    0.0, 0.0, // Bottom right
    0.0, 0.0, // Bottom right
    1.0, 0.0, // Top right
    1.0, 1.0, // Bottom left
]);

// Array of all aliens
let aliens = [];
function addAlien() {
    // Define the initial position of the new alien
    let newAlienPosition = [0.5, 0.5, 0];

    // Check if the new alien's position overlaps with any existing bullets
    for (let i = 0; i < bulletData.length; i += 3) {
        if (bulletData[i] === newAlienPosition[0] && bulletData[i + 1] === newAlienPosition[1]) {
            // If there's an overlap, return without adding the new alien
            return;
        }
    }

    // If there's no overlap, add the new alien to the aliens array
    aliens.push({
        data: [...singleAlienData],
        velocity: [0.1, 0.0, 0.0],
        textureCoordinate: [...textureCoordinate] // Assign texture coordinates
    });
}


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
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(singleAlienData), gl.STATIC_DRAW);

// Create a buffer for the alien texture coordinates
const textureCoordinateBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textureCoordinate, gl.STATIC_DRAW);

// Create a buffer for the ship texture coordinates
const shipTextureCoordinateBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, shipTextureCoordinateBuffer);
gl.bufferData(gl.ARRAY_BUFFER, shipTextureCoordinate, gl.STATIC_DRAW);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // This flips the image orientation to be upright.

function initTexture(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // This flips the image orientation to be upright.

    if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    return texture;
}


const alienTexture = initTexture(gl, alienImage);
const shipTexture = initTexture(gl, shipImage);


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

// aleinProgam
const aleinProgam = gl.createProgram();
gl.attachShader(aleinProgam, alienVshader);
gl.attachShader(aleinProgam, alienFshader);
gl.linkProgram(aleinProgam);

// Get the pos attribute for bullets and shapes 
const positionLocation = gl.getAttribLocation(program, "pos");

//Get aPos for aliens
const alienLocation = gl.getAttribLocation(aleinProgam, "aPos");

const texCoordLocation = gl.getAttribLocation(aleinProgam, "texCoord");

const shipTexCoordLocation = gl.getAttribLocation(program, "stexCoord");

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
    0, -0.7, 0, 1,
];

// Define initial velocity (e.g., moving upwards with a speed of 0.01 units per frame)
let velocity = [0.0, 0.5, 0.0];
function updateAlein() {
    for (let alien of aliens) {
        if (alien.data[1] < -8) {
            // If alien goes past the bottom of the canvas, stop the animation
            // document.getElementById(".game-over").style.display = "flex";
            let gamestats = document.getElementById("gamestats");
            gamestats.style.display = 'flex';
            console.log(gamestats);
            console.log('hello');
            return;
        }

        if (alien.data[0] + alien.velocity[0] > 5.2 || alien.data[0] + alien.velocity[0] < -4.2) {
            // Reverse the direction of the alien's velocity in the x-axis
            alien.velocity[0] = -alien.velocity[0];
           
            // Move down by a unit in the y-axis
            for (let j = 1; j < 18; j += 3) {
                alien.data[j] -= 0.5;
            }
        }
        // Update the point's position
        for (let j = 0; j < 18; j += 3) {
            alien.data[j] += alien.velocity[0];
        }
    }
}


// Update the bullet's position and remove bullets that are off screen
function updateBullets() {
    let bulletsToRemove = [];
    for (let i = 0; i < bulletData.length; i += 3) {
        bulletData[i + 1] += velocity[1];
        if (bulletData[i + 1] > 8) { 
            bulletsToRemove.push(i);
        }
    }
    // Remove the marked bullets
    for (let i of bulletsToRemove) {
        bulletData.splice(i, 3);
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


    gl.bindBuffer(gl.ARRAY_BUFFER, shipTextureCoordinateBuffer);
    gl.bindTexture(gl.TEXTURE_2D, shipTexture);

    gl.enableVertexAttribArray(shipTexCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, shipTextureCoordinateBuffer); 
    gl.vertexAttribPointer(shipTexCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, shapeData.length / 3);
}

// Modify the drawAlien function to draw all aliens
function drawAlien() {
    for (let alien of aliens) {
        // Update the buffer data for alien vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, alienBuffer);
        gl.bindTexture(gl.TEXTURE_2D, alienTexture);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alien.data), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(alienLocation);
        gl.vertexAttribPointer(alienLocation, 3, gl.FLOAT, false, 0, 0);
        
        // Update the buffer data for texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alien.textureCoordinate), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Draw the alien
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}



// Check collisions and remove bullets that hit aliens
function checkCollisions() {
    let bulletsToRemove = [];
    let aliensToRemove = [];

    for (let i = 0; i < bulletData.length; i += 3) {
        for (let j = 0; j < aliens.length; j++) {
            let alienLeft = aliens[j].data[0] - 0.5;
            let alienRight = aliens[j].data[0] + 0.5;

            if (bulletData[i] >= alienLeft && bulletData[i] <= alienRight) {
                bulletsToRemove.push(i);
                aliensToRemove.push(j);
                break;
            }
        }
    }
    // Sort the indices in descending order
    bulletsToRemove.sort((a, b) => b - a);
    aliensToRemove.sort((a, b) => b - a);
    // Remove the marked bullets and aliens
    for (let i of bulletsToRemove) {
        bulletData.splice(i, 3);
    }
    for (let j of aliensToRemove) {
        aliens.splice(j, 1);
    }
}



// Start animation loop
function animate() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update the positions of the aliens and bullets
    updateAlein();
    updateBullets();

    // Check for collisions
    checkCollisions();

    // Draw the aliens, bullets, and shapes
    gl.useProgram(aleinProgam);
    drawAlien();
    gl.useProgram(program);
    drawShapes();
    drawBullets();

    window.requestAnimationFrame(animate);
}

// Start animation loop
animate();

// Add a new alien every second
setInterval(addAlien, 1000);

document.addEventListener('keydown', function(event) {
    if (event.key === " ") {
        bulletData.push(0, 0.01, 0);
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
     
    }
});

// checks if its to power of two
function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0;
}