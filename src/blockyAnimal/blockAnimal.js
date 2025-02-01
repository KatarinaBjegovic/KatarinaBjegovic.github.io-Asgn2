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
let g_purpleAnlge = 0;
g_yellowAngleAnimation = false;

function addActionsForHTMLUI(){

    document.getElementById('on').onclick = function() {g_yellowAngleAnimation = true; };
    document.getElementById('off').onclick = function() {g_yellowAngleAnimation = false; };

    document.getElementById("yellow_slider").addEventListener('mousemove', function(){g_yellowAngle = this.value; renderAllShapes();}); 
    document.getElementById("angle_slider").addEventListener('mousemove', function(){g_globalAngle = this.value; renderAllShapes();}); 
    document.getElementById("purple_slider").addEventListener('mousemove', function(){g_purpleAnlge= this.value; renderAllShapes();}); 

}




function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHTMLUI();

    // canvas.onmousedown = click;
    // canvas.onmousemove = function(ev){ if (ev.buttons == 1) { click(ev) } };

    gl.clearColor(1.0, 0.75, 0.8, 1.0);

    //gl.clear(gl.COLOR_BUFFER_BIT);
    renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){
    g_seconds = performance.now()/1000.0-g_startTime;
    //console.log(g_seconds );

    updateAnimationAngles();

    renderAllShapes();

    requestAnimationFrame(tick);
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer 
    var y = ev.clientY; // y coordinate of a mouse pointer 
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2); 
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

function updateAnimationAngles(){
    if (g_yellowAngleAnimation) {
        g_yellowAngle = (45*Math.sin(g_seconds));
        g_purpleAnlge = (45*Math.sin(3*g_seconds));
    }
}

function renderAllShapes(){

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT); 
    //drawTriangle3D([-1.0,0.0,0.0,  -0.5,-1.0,0.0,  0.0,0.0,0.0])



    
    var head = new Cube();
    head.color = [0.35,0.35,0.35,1.0];
    head.matrix.translate(-.2, 0.2, 0);
    //body.matrix.rotate(-5,1,0,0);
    head.matrix.scale(0.4,0.4,0.2);
    head.render();

    var stripeOne = new Cube();
    stripeOne.color = [1,1,1,1.0];
    stripeOne.matrix.translate(-.15, 0.51, -0.001);
    //body.matrix.rotate(-5,1,0,0);
    stripeOne.matrix.scale(0.04,0.1,0.21);
    stripeOne.render();
    
    var stripeTwo = new Cube();
    stripeTwo.color = [1,1,1,1.0];
    stripeTwo.matrix.translate(.10, 0.51, -0.001);
    //body.matrix.rotate(-5,1,0,0);
    stripeTwo.matrix.scale(0.04,0.1,0.21);
    stripeTwo.render();

    var stripeThree = new Cube();
    stripeThree.color = [1,1,1,1.0];
    stripeThree.matrix.translate(-.02, 0.46, -0.001);
    //body.matrix.rotate(-5,1,0,0);
    stripeThree.matrix.scale(0.04,0.15,0.21);
    stripeThree.render();

    var eyeOne = new Cube();
    eyeOne.color = [0.3,0,0,1.0];
    eyeOne.matrix.translate(-.17, 0.25, -0.001);
    //eyeOne.matrix.rotate(-0.5,0.5,1,0);
    eyeOne.matrix.scale(0.1,0.2,0.2);
    eyeOne.render();

    var eyeTwo = new Cube();
    eyeTwo.color = [0.3,0,0,1.0];
    eyeTwo.matrix.translate(0.05, 0.3, -0.001);
    //body.matrix.rotate(-5,1,0,0);
    eyeTwo.matrix.scale(0.11,0.12,0.2);
    eyeTwo.render();

    var nose = new Cube();
    nose.color = [1,0.6,0.6,1];
    nose.matrix.translate(-0.03, 0.26, -0.01);
    nose.matrix.scale(0.05,0.02,0.1);
    nose.render();

    var noseMid = new Cube();
    noseMid.color = [1,0.6,0.6,1];
    noseMid.matrix.translate(-0.023, 0.25, -0.01);
    noseMid.matrix.scale(0.035,0.015,0.1);
    noseMid.render();

    var noseBottom = new Cube();
    noseBottom.color = [1,0.6,0.6,1];
    noseBottom.matrix.translate(-0.015, 0.24, -0.01);
    noseBottom.matrix.scale(0.02,0.015,0.1);
    noseBottom.render();

    var earLeft = new Cube();
    earLeft.color = [0.35,0.35,0.35,1.0];
    earLeft.matrix.translate(-.25, 0.55, 0);
    //body.matrix.rotate(-5,1,0,0);
    earLeft.matrix.scale(0.1,0.1,0.2);
    earLeft.render();

    var earLeft2 = new Cube();
    earLeft2.color = [0.35,0.35,0.35,1.0];
    earLeft2.matrix.translate(-.25, 0.53, 0);
    //body.matrix.rotate(-5,1,0,0);
    earLeft2.matrix.scale(0.1,0.1,0.2);
    earLeft2.render();

    var earRight = new Cube();
    earRight.color = [0.35,0.35,0.35,1.0];
    earRight.matrix.translate(.15, 0.55, 0);
    //body.matrix.rotate(-5,1,0,0);
    earRight.matrix.scale(0.1,0.1,0.2);
    earRight.render();

    var earRight2 = new Cube();
    earRight2.color = [0.35,0.35,0.35,1.0];
    earRight2.matrix.translate(.15, 0.53, 0);
    //body.matrix.rotate(-5,1,0,0);
    earRight2.matrix.scale(0.1,0.1,0.2);
    earRight2.render();

    var earring = new Cube();
    earring.color = [0.69,0.69,0.69,1.0];
    earring.matrix.translate(.27, 0.5, -0.001);
    earring.matrix.rotate(45, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    earring.matrix.scale(0.01,0.07,0.21);
      // Rotate 45 degrees around the Z-axis
    earring.render();
    
    var earring2 = new Cube();
    earring2.color = [0.69,0.69,0.69,1.0];
    earring2.matrix.translate(.27, 0.55, -0.001);
    earring2.matrix.rotate(45, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    earring2.matrix.scale(0.01,0.07,0.21);
      // Rotate 45 degrees around the Z-axis
    earring2.render();

    var septum = new Cube();
    septum.color = [0,0,0,1.0];
    septum.matrix.translate(0.025, 0.235, -0.01);
    septum.matrix.rotate(40, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    septum.matrix.scale(0.01,0.02,0.0005);
      // Rotate 45 degrees around the Z-axis
    septum.render();
    
    var septum2 = new Cube();
    septum2.color = [0,0,0,1.0];
    septum2.matrix.translate(0.03, 0.235, -0.01);
    septum2.matrix.rotate(150, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    septum2.matrix.scale(0.01,0.02,0.005);
      // Rotate 45 degrees around the Z-axis
    septum2.render();

    var septumLeft = new Cube();
    septumLeft.color = [0,0,0,1.0];
    septumLeft.matrix.translate(-0.04, 0.24, -0.01);
    septumLeft.matrix.rotate(-40, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    septumLeft.matrix.scale(0.01,0.02,0.005);
      // Rotate 45 degrees around the Z-axis
    septumLeft.render();
    
    var septumLeft2 = new Cube();
    septumLeft2.color = [0,0,0,1.0];
    septumLeft2.matrix.translate(-0.03, 0.24, -0.01);
    septumLeft2.matrix.rotate(-150, 0, 0, 1);
    //earring.matrix.rotate(45, 1, 0, 0);  // Rotate 45 degrees around the X-axis
    septumLeft2.matrix.scale(0.01,0.02,0.05);
      // Rotate 45 degrees around the Z-axis
    septumLeft2.render();

    var neck = new Cube();
    neck.color = [0.35,0.35,0.35,1.0];
    neck.matrix.translate(-.125, 0.14, 0);
    //body.matrix.rotate(-5,1,0,0);
    neck.matrix.scale(0.25,0.05,0.4);
    neck.render();

    var body = new Cube();
    body.color = [0.35,0.35,0.35,1.0];
    body.matrix.translate(-.3, -0.37, 0);
    //body.matrix.rotate(-5,1,0,0);
    body.matrix.scale(0.6,0.5,0.4);
    body.render();

    

    // var body = new Cube();
    // body.color = [1.0,0.0,0.0,1.0];
    // body.matrix.translate(-0.25, -0.75, 0.0);
    // body.matrix.rotate(-5,1,0,0);
    // body.matrix.scale(0.5,0.3,0.5);
    // body.render();

    // var leftArm = new Cube();
    // leftArm.color = [1,1,0,1];
    // leftArm.matrix.setTranslate(0,-0.5,0.0);
    // leftArm.matrix.rotate(-5,1,0,0);

    // leftArm.matrix.rotate(-g_yellowAngle,0,0,1);

    // // if (g_yellowAngleAnimation){
    // //     leftArm.matrix.rotate(4*Math.sin(g_seconds), 0,0,1);
    // // } else {
    // //     
    // // }
    // var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
    // leftArm.matrix.scale(0.25,0.7,0.5);
    // leftArm.matrix.translate(-0.5,0,0);
    // leftArm.render();


    // var box = new Cube();
    // box.color = [1,0,1,1];
    // box.matrix = yellowCoordinatesMat;
    // box.matrix.translate(0,0.65,0);
    // box.matrix.rotate(g_purpleAnlge,0,0,1);
    // box.matrix.scale(0.3,0.3,0.3);
    // box.matrix.translate(-0.5,0,-0.001);
    // // box.matrix.rotate(-30,1,0,0);
    // // box.matrix.scale( 0.2,0.4,0.2);
    // box.render(); 

    var K=10.0;
    for (var i=1;i<K; i++) {
        var c = new Cube();
        c.matrix.translate(-0.8,9*i/K-1.0,0);
        c.matrix.rotate(g_seconds*100, 1,1,1);
        c.matrix.scale(0.1,0.5/K, 1.0/K);
        c.render();
    }

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration));
}

function sendTextToHTML(text, html_ID){
    var htmlElm = document.getElementById(html_ID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlElm + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
 