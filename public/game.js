const KEY_CR = 13;
const KEY_SPACE = 32;
const KEY_ONE = 49;

var pScore = 0;
var allBalls = 3;

$(document).on( "pinScored", function( event, arg1, arg2 ) {
    
    pScore += 10;
    $('#divScore p').html(pScore);
});

$(document).on( "ballLaunched", function( event, arg1, arg2 ) {
    
    allBalls--;
    $('#divBalls p').html(allBalls);
});

$(document).on( "restart", {
    foo: "bar"
}, function( event, arg1, arg2 ) {
    allBalls = 3;
    $('#divBalls p').html(allBalls);
});

$(document).keypress(function(e) {

    if (e.which == KEY_ONE) {
        allBalls = 3;
        $(document).trigger("restart");
        return;
    }

    if (allBalls == 0) {
        return;        
    }    

    if (e.which == KEY_SPACE) {
        ball = Bodies.circle(760, 500, 10, 10);
        ball.restitution = 0.7;
        ball.frictionAir = 0.001;
        World.add(engine.world, [ball]);
        return;
    }
    
    if (e.which == KEY_CR) {
        $(document).trigger( "ballLaunched", [ "bim", "baz" ] );
        let force = (Math.random() * (0.03 - 0.04) + 0.04);
        Body.applyForce(ball, ball.position, { x: 0, y: force });
        return;
    }
});

// Matter modules aliases
var Body = Matter.Body,
    Engine = Matter.Engine,
    Render = Matter.Render,
    Common = Matter.Common,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Composites = Matter.Composites;

// Create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,        
    options: {
        showAngleIndicator: false,
        isStatic: true,
        wireframes: false,
        width: 800,
        height: 600,     
        background: 'cust.pnga',
        visible: false
    }});

// table walls
var leftWall = Bodies.rectangle(10, 10, 10, 1300, { isStatic: true });
var rightWall = Bodies.rectangle(780, 10, 10, 1300, { isStatic: true });
var rightTube = Bodies.rectangle(740, 400, 10, 400, { isStatic: true });
var angledWall = Bodies.rectangle(740, 230, 10, 70, { isStatic: true });
var ground = Bodies.rectangle(400, 600, 800, 60, { isStatic: true });
var roofTop = Bodies.rectangle(400, 10, 800, 20, { isStatic: true });
Body.rotate(angledWall, -Math.PI/5, {x: 630, y: 160});

// table pins
var pings = [];
var x, xStart = 50;
var y = 160;
var step = 20;
var firstRow = true;

for (var k=0;k<5;k++) {

    x = xStart;
    
    for (var i=0;i<10;i++){
        pings.push(Bodies.circle(x+=step+40,y,10, { isStatic: true, id: "p" + x + y }))
    }

    y += 60;

    if (xStart == 18) {
        xStart = 50;
    } else {
        xStart = 18;
    }
}

// matter.js events

Events.on(engine, 'collisionStart collisionActive collisionEnd', function (event) {
    var pairs = event.pairs;
    if (pairs.length == 0)
        return;

    if (pairs[0].bodyA.id.toString().indexOf("p") >= 0) {
        console.log('you scored ' + pairs[0].bodyA.id);
        $(document).trigger( "pinScored", [ "bim", "baz" ] );
    }
});

var ball = Bodies.circle(760, 500, 10, 10);

ball.restitution = 0.7;
ball.frictionAir = 0.001;

// add all of the bodies to the world
rightTube.restitution = (Math.random() * (0.3 - 0.7) + 0.7);
World.add(engine.world, [ball, angledWall, leftWall, rightWall, rightTube, ground, roofTop]);
World.add(engine.world, pings);
//engine.timing.timeScale = 1.2;
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);