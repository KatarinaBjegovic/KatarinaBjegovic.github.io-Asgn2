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
let g_headAngle = 0;
let g_strummingHandAnlge = 0;
let g_handNoteAnlge = 0;
let g_footAngle = 0
let g_stringVibration = 0;
let g_Animation = false;

function addActionsForHTMLUI(){
    document.getElementById('on').onclick = function() {g_Animation = true; };
    document.getElementById('off').onclick = function() {g_Animation = false; };

}




function main() {
    console.log("main function is running");
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHTMLUI();

    gl.clearColor(1.0, 0.75, 0.8, 1.0);

    renderAllShapes();

    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){
    console.log("tick running")
    g_seconds = performance.now()/1000.0-g_startTime;
    console.log(g_seconds );

    updateAnimationAngles();

    renderAllShapes();

    requestAnimationFrame(tick);
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; 
    var y = ev.clientY; 
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2); 
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

function updateAnimationAngles() {
    if (g_Animation) {
        // Head rocking back and forth (z-axis)
        g_headAngle = 45 * Math.sin(3 * g_seconds);

        // Left foot tapping (y-axis rotation, ±35 degrees)
        g_footAngle = 35 * Math.sin(2 * g_seconds);

        // Strumming hand moving up and down
        g_strummingHandAngle = 30 * Math.sin(5 * g_seconds);

        // Hand on guitar neck moving slightly to simulate playing
        g_handNoteAngle = 10 * Math.sin(4 * g_seconds);

        // Guitar strings vibrating slightly
        g_stringVibration = 5 * Math.sin(20 * g_seconds);
    } else {
        console.log("got here"); 
    }
}

function renderAllShapes(){

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT); 



// head should rock back and forth in the z direction... in beat 
    
    var head = new Cube();
    head.color = [0.35,0.35,0.35,1.0];
    head.matrix.translate(-.2, 0.2, 0);
    
    head.matrix.rotate(g_headAngle, 0,0,1);

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

// end of rocking head.... 



    
    var neck = new Cube();
    neck.color = [0.35,0.35,0.35,1.0];
    neck.matrix.translate(-.125, 0.14, 0);
    //body.matrix.rotate(-5,1,0,0);
    neck.matrix.scale(0.25,0.05,0.2);
    neck.render();

    var body = new Cube();
    body.color = [0.35,0.35,0.35,1.0];
    body.matrix.translate(-0.25, -0.55, 0);
    //body.matrix.rotate(-5,1,0,0);
    body.matrix.scale(0.5,0.68,0.2);
    body.render();

    var shirt = new Cube();
    shirt.color = [0,0,0,1.0];
    shirt.matrix.translate(-0.28, -0.1, -0.01);
    //body.matrix.rotate(-5,1,0,0);
    shirt.matrix.scale(0.55,0.2,0.22);
    shirt.render();
    
    var shirt2 = new Cube();
    shirt2.color = [0,0,0,1.0];
    shirt2.matrix.translate(-0.3, -0.15, -0.01);
    //body.matrix.rotate(-5,1,0,0);
    shirt2.matrix.scale(0.59,0.2,0.22);
    shirt2.render();

    var shirt3 = new Cube();
    shirt3.color = [0,0,0,1.0];
    shirt3.matrix.translate(-0.32, -0.38, -0.01);
    //body.matrix.rotate(-5,1,0,0);
    shirt3.matrix.scale(0.63,0.4,0.22);
    shirt3.render();

    var shirt4 = new Cube();
    shirt4.color = [0,0,0,1.0];
    shirt4.matrix.translate(-0.3, -0.4, -0.01);
    //body.matrix.rotate(-5,1,0,0);
    shirt4.matrix.scale(0.59,0.25,0.22);
    shirt4.render();

    var shirt5 = new Cube();
    shirt5.color = [0,0,0,1.0];
    shirt5.matrix.translate(-0.28, -0.43, -0.01);
    //body.matrix.rotate(-5,1,0,0);
    shirt5.matrix.scale(0.55,0.2,0.22);
    shirt5.render();

    var leftLeg = new Cube();
    leftLeg.color = [0.35,0.35,0.35,1.0];
    leftLeg.matrix.translate(-0.25, -0.85, -0.048);
    //body.matrix.rotate(-5,1,0,0);
    leftLeg.matrix.scale(0.24,0.38,0.25);
    leftLeg.render();

    var blendLeftLeg = new Cube();
    blendLeftLeg.color = [0.35,0.35,0.35,1.0];
    blendLeftLeg.matrix.translate(-0.25, -0.48, -0.03);
    //body.matrix.rotate(-5,1,0,0);
    blendLeftLeg.matrix.scale(0.24,0.05,0.2);
    blendLeftLeg.render();


    var rightLeg = new Cube();
    rightLeg.color = [0.35,0.35,0.35,1.0];
    rightLeg.matrix.translate(0.01, -0.85, -0.048);
    //body.matrix.rotate(-5,1,0,0);
    rightLeg.matrix.scale(0.24,0.38,0.25);
    rightLeg.render();

    var blendRightLeg = new Cube();
    blendRightLeg.color = [0.35,0.35,0.35,1.0];
    blendRightLeg.matrix.translate(0.01, -0.48, -0.03);
    //body.matrix.rotate(-5,1,0,0);
    blendRightLeg.matrix.scale(0.24,0.05,0.2);
    blendRightLeg.render();


// tap left foot in beat +- 35 degrees
    
    var leftFoot = new Cube();
    leftFoot.color = [0.3,0.3,0.3, 1.0];
    leftFoot.matrix.translate(-0.25, -0.75, 0.01);
    leftFoot.matrix.rotate(180,90,0,0); // rotate from 180 to 
    leftFoot.matrix.scale(0.24,0.1,0.15);
    leftFoot.render(); 

// end of parts for the foot tap animation

    var rightFoot = new Cube();
    rightFoot.color = [0.3,0.3,0.3,1.0];
    rightFoot.matrix.translate(0.01, -0.75, 0.01);
    rightFoot.matrix.rotate(180,90,0,0); // rotate from 180 to 
    rightFoot.matrix.scale(0.24,0.1,0.15);
    rightFoot.render(); 




    var guitarArm = new Cube(); 
    guitarArm.color = [0.82,0.67,0.49,1.0];
    guitarArm.matrix.translate(0.2, -0.1, -0.1);
    guitarArm.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarArm.matrix.scale(0.5,0.1,0.05);
    guitarArm.render(); 

    var guitarTop = new Cube(); 
    guitarTop.color = [0.82,0.67,0.49,1.0];
    guitarTop.matrix.translate(0.57, 0.24, -0.1);
    guitarTop.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarTop.matrix.scale(0.19,0.14,0.05);
    guitarTop.render();

    var guitarTop2 = new Cube(); 
    guitarTop2.color = [0.82,0.67,0.49,1.0];
    guitarTop2.matrix.translate(0.6, 0.29, -0.1);
    //guitarTop2.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarTop2.matrix.scale(0.1,0.1,0.05);
    guitarTop2.render();
    
    var guitarTop3 = new Cube(); 
    guitarTop3.color = [0.82,0.67,0.49,1.0];
    guitarTop3.matrix.translate(0.6, 0.37, -0.1);
    //guitarTop2.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarTop3.matrix.scale(0.1,0.1,0.05);
    guitarTop3.render();

    var guitarNotch = new Cube(); 
    guitarNotch.color = [0,0,0,1.0];
    guitarNotch.matrix.translate(0.5, 0.35, -0.1);
    guitarNotch.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarNotch.matrix.scale(0.02,0.05,0.01);
    guitarNotch.render();

    var guitarNotch2 = new Cube(); 
    guitarNotch2.color = [0,0,0,1.0];
    guitarNotch2.matrix.translate(0.53, 0.39, -0.1);
    guitarNotch2.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarNotch2.matrix.scale(0.02,0.05,0.01);
    guitarNotch2.render();

    var guitarNotch3 = new Cube(); 
    guitarNotch3.color = [0,0,0,1.0];
    guitarNotch3.matrix.translate(0.57, 0.43, -0.1);
    guitarNotch3.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarNotch3.matrix.scale(0.02,0.05,0.01);
    guitarNotch3.render();
    

    var guitarStrapShoulder = new Cube();
    guitarStrapShoulder.color = [0.3,0.1,0.1,1.0];
    guitarStrapShoulder.matrix.translate(0.25, 0.05, -0.05);
    guitarStrapShoulder.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarStrapShoulder.matrix.scale(0.05,0.05,0.3);
    guitarStrapShoulder.render(); 

    var guitarStrapBack = new Cube(); 
    guitarStrapBack.color = [0.3,0.1,0.1,1.0];
    guitarStrapBack.matrix.translate(-0.32, -0.42, 0.2);
    guitarStrapBack.matrix.rotate(40,0,0,1); // rotate from 180 to 
    guitarStrapBack.matrix.scale(0.75,0.05,0.05);
    guitarStrapBack.render(); 

    var guitarStrapFront = new Cube(); 
    guitarStrapFront.color = [0.3,0.1,0.1,1.0];
    guitarStrapFront.matrix.translate(-0.19, -0.27, -0.1);
    guitarStrapFront.matrix.rotate(220,0,0,1); // rotate from 180 to 
    guitarStrapFront.matrix.scale(0.2,0.05,0.05);
    guitarStrapFront.render(); 

    var guitarStrapSide = new Cube(); 
    guitarStrapSide.color = [0.3,0.1,0.1,1.0];
    guitarStrapSide.matrix.translate(-0.32, -0.43, -0.05);
    guitarStrapSide.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarStrapSide.matrix.scale(0.05,0.05,0.3);
    guitarStrapSide.render(); 
    
    var guitarBase = new Cube(); 
    guitarBase.color = [0.31,0.21,0.23,1.0];
    guitarBase.matrix.translate(0, -0.4, -0.1);
    guitarBase.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarBase.matrix.scale(0.27,0.27,0.05);
    guitarBase.render(); 

    var guitarPart1 = new Cube(); 
    guitarPart1.color = [0.31,0.21,0.23,1.0];
    guitarPart1.matrix.translate(0.2, -0.17, -0.1);
    guitarPart1.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarPart1.matrix.scale(0.05,0.2,0.05);
    guitarPart1.render(); 

    var guitarPart2 = new Cube(); 
    guitarPart2.color = [0.31,0.21,0.23,1.0];
    guitarPart2.matrix.translate(0.18, -0.2, -0.1);
    guitarPart2.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarPart2.matrix.scale(0.05,0.23,0.05);
    guitarPart2.render(); 

    var guitarCorner = new Cube(); 
    guitarCorner.color = [0.31,0.21,0.23,1.0];
    guitarCorner.matrix.translate(0.05, -0.1, -0.1);
    guitarCorner.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarCorner.matrix.scale(0.15,0.15,0.05);
    guitarCorner.render(); 

    var guitarCornerExtra = new Cube(); 
    guitarCornerExtra.color = [0.31,0.21,0.23,1.0];
    guitarCornerExtra.matrix.translate(-0.05, -0.13, -0.1);
    //guitarCornerExtra.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarCornerExtra.matrix.scale(0.15,0.15,0.05);
    guitarCornerExtra.render(); 

    var guitarCornerOther = new Cube(); 
    guitarCornerOther.color = [0.31,0.21,0.23,1.0];
    guitarCornerOther.matrix.translate(0.18, -0.22, -0.1);
    guitarCornerOther.matrix.rotate(25,0,0,1); // rotate from 180 to 
    guitarCornerOther.matrix.scale(0.15,0.08,0.05);
    guitarCornerOther.render(); 

    var guitarLowerPart1 = new Cube(); 
    guitarLowerPart1.color = [0.31,0.21,0.23,1.0];
    guitarLowerPart1.matrix.translate(-0.05, -0.41, -0.1);
    guitarLowerPart1.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarLowerPart1.matrix.scale(0.09,0.22,0.05);
    guitarLowerPart1.render(); 

    var guitarLowerPart2 = new Cube(); 
    guitarLowerPart2.color = [0.31,0.21,0.23,1.0];
    guitarLowerPart2.matrix.translate(-0.09, -0.41, -0.1);
    guitarLowerPart2.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarLowerPart2.matrix.scale(0.05,0.17,0.05);
    guitarLowerPart2.render(); 

    var guitarHole = new Cube(); 
    guitarHole.color = [0.2,0.1,0.1,1.0];
    guitarHole.matrix.translate(-0.02, -0.32, -0.11);
    guitarHole.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarHole.matrix.scale(0.2,0.13,0.01);
    guitarHole.render(); 

    var guitarBand = new Cube(); 
    guitarBand.color = [0.82,0.67,0.49,1.0];
    guitarBand.matrix.translate(-0.03, -0.33, -0.115);
    guitarBand.matrix.rotate(45,0,0,1); // rotate from 180 to 
    guitarBand.matrix.scale(0.03,0.13,0.02);
    guitarBand.render(); 

// move these 3 strings up and down slightly in the y direction 
    
    var guitarStringOneBottom = new Cube(); 
    guitarStringOneBottom.color = [0,0,0,1.0];
    guitarStringOneBottom.matrix.translate(-0.07, -0.27, -0.13); // shift y up and down +- .03
    guitarStringOneBottom.matrix.rotate(45,0,0,1); 
    guitarStringOneBottom.matrix.scale(0.9,0.01,0.05);
    guitarStringOneBottom.render(); 

    var guitarStringTwoBottom = new Cube(); 
    guitarStringTwoBottom.color = [0,0,0,1.0];
    guitarStringTwoBottom.matrix.translate(-0.06, -0.29, -0.13);
    guitarStringTwoBottom.matrix.rotate(45,0,0,1); 
    guitarStringTwoBottom.matrix.scale(0.9,0.01,0.05);
    guitarStringTwoBottom.render(); 

    var guitarStringThreeBottom = new Cube(); 
    guitarStringThreeBottom.color = [0,0,0,1.0];
    guitarStringThreeBottom.matrix.translate(-0.04, -0.3, -0.13);
    guitarStringThreeBottom.matrix.rotate(45,0,0,1); 
    guitarStringThreeBottom.matrix.scale(0.9,0.01,0.05);
    guitarStringThreeBottom.render(); 

// end of the parts for this animation..

    var leftArm = new Cube();
    leftArm.color = [0.16,0.19,0.33,1.0];
    leftArm.matrix.translate(-0.4, -0.18, -0.18);
    leftArm.matrix.rotate(45,90,0,0); // rotate from 180 to 
    leftArm.matrix.scale(0.1,0.28,0.1);
    leftArm.render(); 

    var leftShoulder= new Cube();
    leftShoulder.color = [0,0,0,1.0];
    leftShoulder.matrix.translate(-0.32, -0.08, 0);
    leftShoulder.matrix.rotate(40,0,0,1); // rotate from 180 to 
    leftShoulder.matrix.scale(0.14,0.12,0.15);
    leftShoulder.render(); 

// strum the arm and hand togehter about +- 35 degreese in the x direction 

    var leftArm2= new Cube();
    leftArm2.color = [0.16,0.19,0.33,1.0];
    leftArm2.matrix.translate(-0.3, -0.25, -0.16);
    //leftArm.matrix.rotate(180,90,0,0); // rotate from 180 to 
    leftArm2.matrix.scale(0.22,0.1,0.1);
    leftArm2.render(); 

    var leftHand= new Cube();
    leftHand.color = [0.35,0.35,0.35, 1.0];
    leftHand.matrix.translate(-0.1, -0.25, -0.16);
    //leftArm.matrix.rotate(180,90,0,0); // rotate from 180 to 
    leftHand.matrix.scale(0.15,0.1,0.1);
    leftHand.render(); 
// end of parts for this animation....

    
    var rightArm = new Cube();
    rightArm.color = [0.16,0.19,0.33,1.0];
    rightArm.matrix.translate(0.45, -0.15, -.14);
    rightArm.matrix.rotate(60,1,0,0);
    rightArm.matrix.rotate(50,0,0,1); // rotate from 180 to
    rightArm.matrix.rotate(30,0,1,0);
    //rightArm.matrix.rotate(90,0,1,0);
    rightArm.matrix.scale(0.12,0.3,0.1);
    rightArm.render(); 

//  strum the arm and hand togehter about + 35 degreese in the x direction 
    var rightArm2 = new Cube();
    rightArm2.color = [0.16,0.19,0.33,1.0];
    rightArm2.matrix.translate(0.45, -0.15, -.22);
    rightArm2.matrix.rotate(45,0,0,1);
    rightArm2.matrix.scale(0.12,0.21,0.1);
    rightArm2.render(); 

    var rightHand = new Cube();
    rightHand.color = [0.35,0.35,0.35,1.0];
    rightHand.matrix.translate(0.3, -0.01, -.22);
    rightHand.matrix.rotate(45,0,0,1);
    rightHand.matrix.scale(0.12,0.1,0.1);
    rightHand.render(); 
    
// end of parts for animation 

    
    var rightElbow = new Cube();
    rightElbow.color = [0.16,0.19,0.33,1.0];
    rightElbow.matrix.translate(0.48, -0.2, -.22);
    rightElbow.matrix.rotate(45,0,0,1);
    rightElbow.matrix.scale(0.13,0.09,0.17);
    rightElbow.render(); 


    var rightShoulder = new Cube();
    rightShoulder.color = [0,0,0,1.0];
    rightShoulder.matrix.translate(0.25, -0.08, 0);
    rightShoulder.matrix.rotate(45,0,0,1); // rotate from 180 to 
    rightShoulder.matrix.scale(0.14,0.12,0.15);
    rightShoulder.render(); 
   

    var duration = performance.now() - startTime;
    //sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration));
}

function sendTextToHTML(text, html_ID){
    var htmlElm = document.getElementById(html_ID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlElm + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
 