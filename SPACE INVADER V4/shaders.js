// shape and bullets vertex shader
const vsSource = `
    precision mediump float;
    attribute vec3 pos;

    uniform mat4 u_ScaleMatrix;
    uniform mat4 u_TranslateMatrix;

    void main() {
        gl_Position = u_TranslateMatrix * u_ScaleMatrix * vec4(pos, 1.0);
        gl_PointSize = 25.0;
    }
`;

// shape and bullets fragment shader
const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.2, 0.3, 0.8, 1);
    }
`;

// aliens vertex shader
const aVscource = `
    precision mediump float;
    attribute vec3 aPos;
    void main() {
        gl_Position = vec4((aPos + vec3(0, 4.5, 0)) * 0.2, 1.0);
        gl_PointSize = 50.0;
    }
`;

// aliens fragment shader
const aFscource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0, 1, 0, 1);
    }
`;

export { vsSource, fsSource, aVscource, aFscource };
