let coordinate = [];
let recording = false;
let saveData = false;
let timerInterval;
let particles = [];
let startTime;
let duration = 50000;
let timeInterval;
let centerX, centerY, radius;
let currentTrail = 1;
let csvData = [];
let maxTrail = 30;

class Particle {
    constructor(x, y, col) {
        this.pos = createVector(x, y);
        this.originalPos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 5;
        this.maxForce = 0.5;
        this.drag = 0.97; // 摩擦力
        this.color = col;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyMouseForce(mx, my) {
        // 計算位置向量
        let mousePos = createVector(mx, my);
        let dirFromMouse = p5.Vector.sub(this.pos, mousePos); 
        let distFromMouse = dirFromMouse.mag(); 

        let dirToOrig = p5.Vector.sub(this.originalPos, this.pos);
        let distFromOrig = dirToOrig.mag();

        // 斥力
        if (distFromMouse < 100) {
            dirFromMouse.normalize();
            let forceMagnitude = this.maxForce * (1 - distFromMouse / 180);
            let force = dirFromMouse.mult(forceMagnitude);
            this.applyForce(force);
        }

        // 吸引力
        dirToOrig.normalize();
        let attractionForce = dirToOrig.mult(0.0008 * distFromOrig);
        this.applyForce(attractionForce);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        
        this.vel.mult(this.drag);

        // 歸位
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
        ellipse(this.pos.x, this.pos.y, 2.5, 2.5);
    }
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	document.getElementById('recordButton').addEventListener('click', startRecording);
    document.getElementById('saveButton').addEventListener('click', saveToCSV);

    //生成點粒子
    // for (let i = 0; i < 6000; i++) {
    //     let r = int(43);
    //     let g = int(119);
    //     let b = int(random(60) + 160);
    //     let col = color(r, g, b);
    //     particles.push(new Particle(random(width), random(height), col));
    // }

    centerX = width / 2;
    centerY = height / 2;
    radius = 300;

    for (let i = 0; i < 1000; i++) {
        let angle = random(TWO_PI);
        let r = radius * sqrt(random());
        let x = centerX + r * cos(angle);
        let y = centerY + r * sin(angle);
        let col = color(43, 119, random(60) + 160);
        particles.push(new Particle(x, y, col));
    }
}

function draw() {
	background(0, 40);

    if (frameCount %15 == 0){
        background(0, 70);
    }
	
    for (let particle of particles) {
        particle.applyMouseForce(mouseX, mouseY);
        particle.update();
        particle.display();
    }

    if (recording = true){

        // Calculate elapsed time
        let elapsedTime = millis() - startTime;

        // Calculate normalized time (0 to 1)
        let t = elapsedTime / duration;

        // Calculate spiral position
        let radius = lerp(250, 90, t);
        let angle = TWO_PI * 10 * t; // 10 full rotations in 10 seconds

        // Calculate x and y based on radius and angle
        let guideX = radius * sin(angle) + width / 2;
        let guideY = radius * cos(angle) + height / 2;

        // Draw the rehibitation circle
        fill(100, 220, 62);
        circle(guideX, guideY, 15);

        coordinate.push([guideX, guideY, mouseX, mouseY]);

        if (elapsedTime > duration) {
            recording = false;
            document.getElementById('saveButton').style.display = 'block';
            noLoop();
        }
    }

    fill(226, 61, 61);
    circle(mouseX, mouseY, 15);
}

function startRecording() {
	recording = true;
    startTime = millis();
    loop(); 

    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    recordButton.style.display = 'none';
    saveButton.style.display = 'none';
    

    //  增加計時器
    let countdown = 50;
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
            document.getElementById('recordButton').style.display = 'block';

            if (!csvData[currentTrail]) {
                csvData[currentTrail] = [];
            }
            
            csvData[currentTrail].push("Trail " + currentTrail + "\n");
            csvData[currentTrail].push("GuideX, GuideY, MouseX, MouseY\n");
            
            coordinate.forEach(coord => {
                csvData[currentTrail].push(coord.join(",") + "\n");
            });


            // 重置變數
            coordinate = [];
            currentTrail++;
            if (currentTrail > maxTrail) currentTrail = 1;
        }
    }, 1000);
}

function saveToCSV(){ 
    let csvString = "data:text/csv;charset=utf-8,";
    for (let trail = 1; trail <= maxTrail; trail++) {
        if (csvData[trail]) {
            csvData[trail].forEach(line => {
                csvString += line;
            });
            csvString += "\n"; // 換行
        }
    }

	// 觸發下載
    let encodedUri = encodeURI(csvString);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();   
    document.body.removeChild(link);

    currentTrail = 1;
    saveData = false;
    csvData = [];
}
