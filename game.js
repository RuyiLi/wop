var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var upbtn = document.getElementById("up");



var mouseDown = false;
var oldx = null;
var oldy = null;
var pixels = null;
var shapePixels = null;
var damage = 2;
var mouse = {x: 0, y: 0};
var lastMouse = {x: 0, y: 0};
var c = document.getElementById('visual');
var cx = c.getContext("2d");
var textx, texty;
var hp, max, dd, bar;
var g;
var cleaveReady;
var xReady;

var h = document.body.offsetHeight;
var w = document.body.offsetWidth;

function setup(){
	//width and height
	canvas.height = h / 3 * 4;
	canvas.width = w;
    
    
	c.width = w;
	c.height = h / 3;
	cx.font = '20px dtm';
    
    g = 0;
    
    cleaveReady = true;
    document.getElementById("error").innerHTML = "Cleave is ready to use.";
    
    xReady = true;
    document.getElementById("error2").innerHTML = "eXecute is ready to use.";
    
    
    
    document.getElementById("gold").innerHTML = "Gold: " + g;
    document.getElementById("dmg").innerHTML = "Damage: " + damage;
    
	//color of stroke
	ctx.strokeStyle = 'rgb(219, 36, 26)';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
	//line width
	ctx.lineWidth = damage;
    
	//make stroke circular
	ctx.lineCap = "round";
    
	//color of fill
	ctx.fillStyle = 'rgb(219,36,26)';
    
	ctx.textBaseLine = 'middle';
    
	ctx.strokeStyle = 'rgb(219, 36, 26)';
    
	pixels = ctx.getImageData(5, 5, canvas.width - 10, canvas.height - 10);	
	shapePixels = getPixelAmount(219, 36, 26);
    createEnemy();
}

function getPixelAmount(r, g, b) {
	pixels = ctx.getImageData(5, 5, canvas.width - 10, canvas.height - 10);
	var all = pixels.data.length;
	var amount = 0;
	for (i = 0; i < all; i += 4) {
		if (pixels.data[i] === r && pixels.data[i + 1] === g && pixels.data[i + 2] === b) {
			amount++;
		}
	}
	return amount + 1;
};

function upgrade(){
    if (g >= damage){
        g -= damage;
	   if(damage < 20){
            damage += 1;	
            ctx.lineWidth = damage;
        }
        document.getElementById("gold").innerHTML = "Gold: " + g;
        document.getElementById("dmg").innerHTML = "Damage: " + damage;
    }
}

function execute(){
    if(xReady){
        ctx.lineWidth = damage + 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = damage;
        damageEnemy();
        
        usedX();
    }else{
        document.getElementById("error2").innerHTML = "eXecute is charging...";
    }
}

function usedX(){
    xReady = false;
    document.getElementById("error2").innerHTML = "eXecute is charging...";
    setTimeout(readyX, 8000);
}

function readyX(){
    xReady = true;
    document.getElementById("error2").innerHTML = "eXecute is ready to use.";
}

function cleave(){
    if(cleaveReady){
        updateHealth(damage * 2000);
        var tx = randInt(0, c.width), ty = randInt(0, c.height);

        cx.font = '40px dtm';
        cx.fillStyle = 'rgb(219, 36, 26)';
        cx.fillText("" + damage * 2000, tx, ty);
        dd = shapePixels;
        console.log("Cleaved for " + dd + " damage");
        cx.font = '20px dtm';

        usedCleave();
    }else{
        document.getElementById("error").innerHTML = "Cleave is charging...";
    }
}

function usedCleave(){
    cleaveReady = false;
    document.getElementById("error").innerHTML = "Cleave is charging...";
    setTimeout(readyCleave, 4000);
}

function readyCleave(){
    cleaveReady = true;
    document.getElementById("error").innerHTML = "Cleave is ready to use.";
}

canvas.addEventListener('mousemove', function(e) {
	lastMouse.x = mouse.x;
	lastMouse.y = mouse.y;
	shapePixels = getPixelAmount(219, 36, 26);
	mouse.x = e.pageX - this.offsetLeft;
	mouse.y = e.pageY - this.offsetTop;
	
}, false);

canvas.addEventListener('mousedown', function(e) {
	canvas.addEventListener('mousemove', onPaint, false);
}, false);
	
canvas.addEventListener('mouseup', function() {
	canvas.removeEventListener('mousemove', onPaint, false);   
    ctx.clearRect(5, 5, canvas.width - 10, canvas.height - 10);
    damageEnemy();
}, false);
	
var onPaint = function() {
    ctx.beginPath();
    ctx.moveTo(lastMouse.x, lastMouse.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
};


function damageEnemy() {
    textx = randInt(0, c.width), texty = randInt(0, c.height);
    cx.fillStyle = "#000000";
	cx.fillText("" + shapePixels, textx, texty);
    dd = shapePixels;
    console.log("Dealt " + dd + " damage");
    updateHealth(dd);
}

function createEnemy(){
	clearDamage();
    cx.fillStyle = '#FFF';
    cx.fillRect((canvas.width - 70) / 2, 50, 70, 70);
    max = randInt(canvas.width / 5, canvas.width - 100);
    hp = max;
    
    bar = canvas.width - max;
    
	cx.fillStyle = '#FF0000';
    cx.fillRect(bar / 2, 30, max, 10);
    
    cx.fillStyle = '#00FF00';
    cx.fillRect(bar / 2, 30, max, 10);
}

function updateHealth(dmg){
    cx.clearRect((canvas.width - max) / 2, 30, hp, 10);
    if(hp > 0){
        if(parseInt(document.getElementById("points").innerHTML) >= 100000){
            hp -= dmg / 500;
            cx.fillStyle = '#FF0000';
            cx.fillRect((canvas.width - max) / 2, 30, max, 10);
            cx.fillStyle = '#00FF00';
            cx.fillRect((canvas.width - max) / 2, 30, Math.max(0, hp), 10);
        }else if(parseInt(document.getElementById("points").innerHTML) >= 50000 ){
            hp -= dmg / 300;
            cx.fillStyle = '#FF0000';
            cx.fillRect((canvas.width - max) / 2, 30, max, 10);
            cx.fillStyle = '#00FF00';
            cx.fillRect((canvas.width - max) / 2, 30, Math.max(0, hp), 10);
        }else if(parseInt(document.getElementById("points").innerHTML) > 10000){
            hp -= dmg / 200;
            cx.fillStyle = '#FF0000';
            cx.fillRect((canvas.width - max) / 2, 30, max, 10);
            cx.fillStyle = '#00FF00';
            cx.fillRect((canvas.width - max) / 2, 30, Math.max(0, hp), 10);
        }else if (parseInt(document.getElementById("points").innerHTML) <= 10000){
            hp -= dmg / 100;
            cx.fillStyle = '#FF0000';
            cx.fillRect((canvas.width - max) / 2, 30, max, 10);
            cx.fillStyle = '#00FF00';
            cx.fillRect((canvas.width - max) / 2, 30, Math.max(0, hp), 10);
        }
    }else{
        document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML) + max;
        createEnemy();
        g += 5;
        document.getElementById("gold").innerHTML = "Gold: " + g;
    }
}

function clearDamage(){
	cx.clearRect(0, 0, c.width, c.height);
}


function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

setup();
