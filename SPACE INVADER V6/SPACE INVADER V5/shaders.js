// shaders.js

// shape and bullets vertex shader
const vsSource = `
    precision mediump float;
    attribute vec3 pos;

    attribute vec3 aPos;
    attribute vec2 stexCoord;
    varying vec2 vTexCoord;

    uniform mat4 u_ScaleMatrix;
    uniform mat4 u_TranslateMatrix;

    void main() {
        vTexCoord = stexCoord;
        gl_Position = u_TranslateMatrix * u_ScaleMatrix * vec4(pos, 1.0);
        gl_PointSize = 25.0;
    }
`;

// shape and bullets fragment shader
const fsSource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D texture;

    void main() {
        //gl_FragColor = vec4(0.2, 0.3, 0.8, 1);
        gl_FragColor = texture2D(texture, vTexCoord);
    }
`;

// aliens vertex shader
const aVscource = `
    precision mediump float;
    attribute vec3 aPos;
    attribute vec2 texCoord;
    varying vec2 vTexCoord;

    void main() {
        vTexCoord = texCoord;
        gl_Position = vec4((aPos+vec3(0, 4.5, 0)) * 0.2, 1.0); // Modify the scaling here if needed
        gl_PointSize = 50.0;
    }
`;

// aliens fragment shader
const aFscource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D texture;

    void main() {
        gl_FragColor = texture2D(texture, vTexCoord);
    }
`;

export { vsSource, fsSource, aVscource, aFscource };
