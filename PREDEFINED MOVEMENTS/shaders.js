// shaders.js

const aVscource = `
    precision mediump float;
    attribute vec3 aPos;
    void main() {
        gl_Position = vec4(aPos*0.5, 1.0);
        gl_PointSize = 50.0;
    }
`;

const aFscource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.8, 0, 0, 1);
    }
`;

export { aVscource, aFscource }
