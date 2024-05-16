


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');


if (!gl) {
    throw new Error("WebGL not supported");
}

//Function to genertae random vertices
function randomV(numVertices){

    const vertices = [];
    const colors = [];
    for(let i = 0; i<numVertices; i++){

        // Generate random x, y, z coordinates between -1 and 1
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;
        vertices.push(x, y, z);
        //Generate random r, g, b, values
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        colors.push(r, g, b);

    }
    
    return {vertices: new Float32Array(vertices), colors: new Float32Array(colors)};
}

const numVertices = 15;//Here you choose the number of vertices

const vertices = randomV(numVertices);

const colorVertices = 15;

const colors = randomV(colorVertices);

// Buffer data
const buffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}


// Buffer color
const colorbuffer = gl.createBuffer();
if (!buffer) {
    console.error("Failed to create buffer");
} else {
    gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
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
// draw();



window.spawnDot= function(){


    draw();
    function draw(){
        const { vertices, colors } = randomV(numVertices, colorVertices);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices);
        //gl.drawArrays(gl.POINTS, 0, numVertices);
        //gl.drawArrays(gl.LINES, 0, numVertices);
        
    }
}







