const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const image = document.querySelector('img');
image.style.display = '';

if (!gl) {
    throw new Error('WebGL not supported');
}

let currentRow = 1;
let currentCol = 0;
let maxRows = 5; // Change this to the number of rows you want
let maxCols = 5; // Change this to the number of columns you want

function createSquare(gl, x, y) {
    const vertexData = [
        x + 0.5, y + 0.5,
        x - 0.5, y + 0.5,
        x - 0.5, y - 0.5,
        x - 0.5, y - 0.5,
        x + 0.5, y - 0.5,
        x + 0.5, y + 0.5,
    ];

    const textureCoordinate = new Float32Array([
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const textureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinate, gl.STATIC_DRAW);

    return { vertexBuffer, textureCoordinateBuffer };
}

window.create = function() {
    if (currentRow < maxRows && currentCol < maxCols) {
        squares.push(createSquare(gl, currentCol - maxCols / 2, maxRows / 2 - currentRow)); // Adjust the position
        currentCol++;
        if (currentCol >= maxCols) {
            currentCol = 0;
            currentRow++;
        }
        render(); // Call the render function after a new square is added
    }
}

const squares = [
    
    createSquare(gl, 0, 2),
    createSquare(gl, 1, 2),
];

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
} else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

const vsSource = `
    attribute vec2 position;
    attribute vec2 texCoord;
    varying vec2 vTexCoord;

    void main() {
        vTexCoord = texCoord;
        gl_Position = vec4((position+vec2(1,2.5))*0.1, 0, 1.0) ;
        gl_PointSize = 50.0;
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(`Vertex shader compilation error: ${gl.getShaderInfoLog(vertexShader)}`);
}

const fsSource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D texture;

    void main() {
        gl_FragColor = texture2D(texture, vTexCoord);
    }
`;

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(`Fragment shader compilation error: ${gl.getShaderInfoLog(fragmentShader)}`);
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Shader program linking error: ${gl.getProgramInfoLog(program)}`);
}

const positionLocation = gl.getAttribLocation(program, "position");
const texCoordLocation = gl.getAttribLocation(program, "texCoord");

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);

// Define a render function
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    squares.forEach(({ vertexBuffer, textureCoordinateBuffer }) => {
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
        gl.drawArrays(gl.TRIANGLE_FAN, 3, 3);
    });
}

window.create = function() {
    if (currentRow < maxRows && currentCol < maxCols) {
        squares.push(createSquare(gl, currentCol, currentRow));
        currentCol++;
        if (currentCol >= maxCols) {
            currentCol = 0;
            currentRow++;
        }
        render(); // Call the render function after a new square is added
    }
}

// Call the render function initially to draw the initial squares
render();


function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0;
}
