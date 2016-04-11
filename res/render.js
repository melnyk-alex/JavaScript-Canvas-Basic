var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;

var options = {
    flow: {
        bg: "#334"
    },
    fps: {
        count: 0,
        total: 60
    },
    debug: {
        bg: "rgba(0,0,0,.15)",
        color: "#efefef",
        pt: new Point(10, 10),
        width: 200,
        enabled: true,
        messages: {}
    },
    cursor: {
        enabled: true,
        radius: 8,
        color1: "#aa2211",
        color2: "#ee3322",
        pt: new Point(),
        animate: true
    },
    start: new Date().getTime()
};

function init() {
    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        options.debug.messages["Canvas"] = canvas.width + "x" + canvas.height;
    };
    window.onresize();

    document.onmousemove = function (e) {
        options.cursor.pt = new Point(e.pageX, e.pageY);
        options.debug.messages["Cursor"] = options.cursor.pt.x + "x" + options.cursor.pt.y;
    };

    canvas.style.backgroundColor = options.flow.bg;

    if (options.cursor.enabled) {
        document.body.style.cursor = "none";
    }

    draw();
}

function draw() {
    clearFlow();

    // TODO: Draw here...

    if (options.cursor.enabled) {
        drawCursor();
    }

    if (options.debug.enabled) {
        drawDebug();
    }

    fpsCounter();

    requestAnimFrame(draw, canvas);
}

function clearFlow() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

var delta = .0, alpha = .0;

function drawCursor() {
    context.strokeStyle = options.cursor.color1;
    context.beginPath();
    context.arc(options.cursor.pt.x, options.cursor.pt.y, options.cursor.radius,
            (delta - (options.cursor.animate ? 0.4 : 0.5)) * Math.PI,
            (delta + (options.cursor.animate ? 1.4 : 1.5)) * Math.PI);
    context.stroke();
    
    context.strokeStyle = options.cursor.color2;
    context.beginPath();
    context.arc(options.cursor.pt.x, options.cursor.pt.y, options.cursor.radius / 2,
            (alpha - (options.cursor.animate ? 0.4 : 0.5)) * Math.PI,
            (alpha + (options.cursor.animate ? 1.4 : 1.5)) * Math.PI);
    context.stroke();

    if (options.cursor.animate) {
        delta += 0.015;
        alpha -= 0.033;
    }
}

function drawDebug() {
    var row = 0;

    context.fillStyle = options.debug.bg;
    context.fillRect(options.debug.pt.x, options.debug.pt.y,
            options.debug.width, (Object.keys(options.debug.messages).length * 20) + 10);

    for (var key in options.debug.messages) {
        var val = options.debug.messages[key];

        row += 20;

        context.fillStyle = options.debug.color;

        context.font = "normal bold 10pt sans-serif";
        context.textAlign = "left";
        context.fillText(key + ":", options.debug.pt.x + 10, row + options.debug.pt.y);

        context.font = "italic normal 10pt sans-serif";
        context.textAlign = "right";
        context.fillText(val, options.debug.width, row + options.debug.pt.y);
    }
}

function fpsCounter() {
    var now = new Date().getTime();

    if (options.fps.ts === undefined) {
        options.fps.ts = now;
    }

    options.fps.count++;

    if (now - options.fps.ts >= 1000) {
        options.fps.ts = now;
        options.fps.total = options.fps.count;
        options.fps.count = 0;

        options.debug.messages["FPS"] = options.fps.total;
    }

    options.debug.messages["Time"] = ((new Date().getTime() - options.start) / 1000).toFixed(1);
}

function Point(x, y) {
    this.x = (x || 0);
    this.y = (y || 0);
    this.abs = {
        x: Math.abs(x),
        y: Math.abs(y)
    };
}

init();