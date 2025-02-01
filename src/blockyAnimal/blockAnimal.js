var VSHADER_SOURCE = `
    attribute vec4 a_position;
    uniform mat4 u_ModelMatrix; 
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_position;
    }`

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

let canvas;
let gl;
let a_position;
let u_FragColor;
let u_size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;



function setupWebGL(){
    canvas = document.getElementById('webgl');
    //gl = getWebGLContext(canvas); 
    gl = canvas.getContext( "webgl", { preserveDrawingBuffer: true} );
    if (!gl) {
        console.log('Failed to get the rendering context');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    if (!initShaders(gl,VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Failed to initialize shaders');
        return;
    }
    a_position = gl.getAttribLocation(gl.program, 'a_position')
    if (a_position < 0) {
        console.log('Failed to get the storage location of a_position');
        return;
    }
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


let g_globalAngle = 0;
let g_yellowAngle = 0;

function addActionsForHTMLUI(){

    document.getElementById("angle_slider").addEventListener('mousemove', function(){g_yellowAngle = this.value; renderAllShapes();}); 
    document.getElementById("yellow_slider").addEventListener('mousemove', function(){g_globalAngle = this.value; renderAllShapes();}); 

}




function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHTMLUI();

    // canvas.onmousedown = click;
    // canvas.onmousemove = function(ev){ if (ev.buttons == 1) { click(ev) } };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //gl.clear(gl.COLOR_BUFFER_BIT);
    renderAllShapes();
}


function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer 
    var y = ev.clientY; // y coordinate of a mouse pointer 
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2); 
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}


function renderAllShapes(){

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    //drawTriangle3D([-1.0,0.0,0.0,  -0.5,-1.0,0.0,  0.0,0.0,0.0])

    var body = new Cube();
    body.color = [1.0,0.0,0.0,1.0];
    body.matrix.translate(-0.25, -0.75, 0.0);
    body.matrix.rotate(-5,1,0,0);
    body.matrix.scale(0.5,1.0,5);
    body.render();

    var leftArm = new Cube();
    leftArm.color = [1,1,0,1];
    leftArm.matrix.setTranslate(0,-0.5,0.0);
    leftArm.matrix.rotate(-5,1,0,0);
    leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
    leftArm.matrix.scale(0.25,0.7,0.5);
    leftArm.matrix.translate(-0.5,0,0);
    leftArm.render();


    var box = new Cube();
    box.color = [1,0,1,1];
    box.matrix.translate(-0.1,0.1,0.0);
    box.matrix.rotate(-30,1,0,0);
    box.matrix.scale(0.2,0.4,0.2);
    box.render(); 

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration));
}

function sendTextToHTML(text, html_ID){
    return;
}
 