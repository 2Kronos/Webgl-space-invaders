const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const image = document.querySelector('img');
image.style.display = '';

if (!gl) {
    throw new Error('WebGL not supported');
}

// Function to create a square
function createSquare(gl, x, y) {
    // Vertices for the square
    const vertexData = [
        x + 0.5, y + 0.5,
        x - 0.5, y + 0.5,
        x - 0.5, y - 0.5,
        x - 0.5, y - 0.5,
        x + 0.5, y - 0.5,
        x + 0.5, y + 0.5,
    ];

    // Texture coordinates for the square
    const textureCoordinate = new Float32Array([
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
    ]);

    // Create a buffer for the vertices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    // Create a buffer for the texture coordinates
    const textureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinate, gl.STATIC_DRAW);

    return { vertexBuffer, textureCoordinateBuffer };
}

// Now you can create squares by calling the function
const squares = [
    createSquare(gl, -0.5, 0.5),
    createSquare(gl, -0.5, -0.5),
    createSquare(gl, 0.8, -0.8),
   


    // Add more squares here...
];

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

// Vertex shader
const vsSource = `
    attribute vec2 position;
    attribute vec2 texCoord;
    varying vec2 vTexCoord;

    void main() {
        vTexCoord = texCoord;
        gl_Position = vec4((position + vec2(-1.5, 1.5))*0.4, 0, 1.0) ;
        gl_PointSize = 50.0;
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

// Error checking for vertex shader
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(`Vertex shader compilation error: ${gl.getShaderInfoLog(vertexShader)}`);
}

// Fragment shader
const fsSource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D texture;

    void main() {
        gl_FragColor = texture2D(texture, vTexCoord);
        gl_FragColor = vec4(1, 0, 0, 0);
    }
`;

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

// Error checking for fragment shader
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(`Fragment shader compilation error: ${gl.getShaderInfoLog(fragmentShader)}`);
}

// Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Linking error
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Shader program linking error: ${gl.getProgramInfoLog(program)}`);
}


const positionLocation = gl.getAttribLocation(program, "position");
const texCoordLocation = gl.getAttribLocation(program, "texCoord");

gl.clearColor(0, 0, 0, 0); // Set clear color
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);

// Then in your rendering code, you can loop over the squares and draw each one
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

// checks if its to power of two
function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0;
}
