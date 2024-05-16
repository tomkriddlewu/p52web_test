let coordinate = [];
let recording = false;
let saveData = false;
let timerInterval;
let particles = [];

class Particle {
    constructor(x, y, col) {
        this.pos = createVector(x, y);
        this.originalPos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 5;
        this.maxForce = 0.5;
        this.drag = 0.97;
        this.color = col;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyMouseForce(mx, my) {
        let mousePos = createVector(mx, my);
        let dirFromMouse = p5.Vector.sub(this.pos, mousePos); 
        let distFromMouse = dirFromMouse.mag(); 

        let dirToOrig = p5.Vector.sub(this.originalPos, this.pos);
        let distFromOrig = dirToOrig.mag();

        if (distFromMouse < 100) {
            dirFromMouse.normalize();
            let forceMagnitude = this.maxForce * (1 - distFromMouse / 100);
            let force = dirFromMouse.mult(forceMagnitude);
            this.applyForce(force);
        }

        // 吸引力
        if (distFromOrig > 120) {
            dirToOrig.normalize();
            let attractionForce = dirToOrig.mult(0.03 * distFromOrig);
            this.applyForce(attractionForce);
        }
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        
        this.vel.mult(this.drag);

        let distanceToOriginal = p5.Vector.dist(this.pos, this.originalPos);
        if (distanceToOriginal < 0.15) {
            this.pos = this.originalPos.copy();
            this.vel.mult(0);
            this.acc.mult(0);
        }else{
            this.acc.mult(0);
        }   
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 1, 1);
    }
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	document.getElementById('recordButton').addEventListener('click', startRecording);
    document.getElementById('saveButton').addEventListener('click', saveToCSV);

    //生成點粒子
    for (let i = 0; i < 6000; i++) {
        let r = int(43);
        let g = int(119);
        let b = int(random(60) + 120);
        let col = color(r, g, b);
        particles.push(new Particle(random(width), random(height), col));
    }
}

function draw() {
	background(0, 15);

    if (frameCount %15 == 0){
        background(0, 50);
    }
	
    for (let particle of particles) {
        particle.applyMouseForce(mouseX, mouseY);
        particle.update();
        particle.display();
    }
}



function startRecording() {
	recording = true;
            const recordButton = document.getElementById('recordButton');
            const saveButton = document.getElementById('saveButton');
            recordButton.style.display = 'none';
            saveButton.style.display = 'none';
            

            //  增加計時器
            let countdown = 10;
            const timer = document.getElementById('timer');
            timer.textContent = countdown;

            timerInterval = setInterval(() => {
                countdown--;
                timer.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(timerInterval);
                    recording = false;
                    timer.textContent = '';
                    saveButton.style.display = 'block';
                }
            }, 1000);
}

function saveToCSV(){
	// 生成CSV內容
	let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "X,Y\n";
    coordinate.forEach(coord => {
        csvContent += coord.join(",") + "\n";
    });
    
	// 觸發下載
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "coordinates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

	// 重置變數
	coordinates = [];
    recording = false;
    saveData = false;
    document.getElementById('recordButton').style.display = 'block';
}