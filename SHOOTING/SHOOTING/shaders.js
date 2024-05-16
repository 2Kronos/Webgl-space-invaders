// shaders.js

const vsSource = `
    precision mediump float;
    attribute vec3 pos;
    uniform float shift;
    void main() {
        // Add shift only to the line
        gl_Position = vec4(pos,1.0);
        if (gl_Position.y > -0.9) {
            gl_Position += vec4(0, shift, 0, 0);
        }
        gl_PointSize = 30.0;
    }
`;


const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.8, 0, 0, 1);
    }
`;

export { vsSource, fsSource }
