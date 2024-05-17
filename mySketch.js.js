let coordinate = [];
let recording = false;
let saveData = false;
let timerInterval;
let particles = [];
let startTime;
let duration = 10000;
let timeInterval;
let centerX, centerY, radius;
let currentTrail = 1;
let particleTrail = []; 
let csvData;

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
        ellipse(this.pos.x, this.pos.y, 1.3, 1.3);
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
    radius = 450;

    for (let i = 0; i < 6000; i++) {
        let angle = random(TWO_PI);
        let r = radius * sqrt(random());
        let x = centerX + r * cos(angle);
        let y = centerY + r * sin(angle);
        let col = color(43, 119, random(60) + 160);
        particles.push(new Particle(x, y, col));
    }
}

function draw() {
	background(0, 25);

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
        let radius = lerp(400, 90, t);
        let angle = TWO_PI * 10 * t; // 10 full rotations in 10 seconds

        // Calculate x and y based on radius and angle
        let x = radius * sin(angle) + width / 2;
        let y = radius * cos(angle) + height / 2;

        // Draw the circle
        fill(100, 220, 62);
        circle(x, y, 10);

        coordinate.push([mouseX, mouseY]);

        if (elapsedTime > duration) {
            recording = false;
            document.getElementById('saveButton').style.display = 'block';
            noLoop();
        }
    }

    fill(226, 61, 61);
    circle(mouseX, mouseY, 10);
}

function startRecording() {
	recording = true;
    startTime = millis();
    coordinate = [];
    particleTrail[currentTrail] = [];
    loop(); 

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

            // // 生成CSV內容
            // let csvContent = "data:text/csv;charset=utf-8,";
            // csvContent += "MouseX,MouseY\n";
            // coordinate.forEach(coord => {
            //     csvContent += coord.join(",") + "\n";
            // });
            // csvContent += "\n";
            // csvContent += "Trail" + currentTrail + " ParticleX, ParticleY\n";
            // coordinate.forEach(coord => {
            // csvContent += trail.join(",") + "\n";
            
            csvData = "data:text/csv;charset=utf-8,";
            csvData += "MouseX,MouseY\n";
            coordinate.forEach(coord => {
                csvData += coord.join(",") + "\n";
            });
            csvData += "\n";
            csvData += "Trail " + currentTrail + " ParticleX,ParticleY\n"; // 添加轨迹号到标题中
            particleTrail[currentTrail].forEach(trail => {
                csvData += trail.join(",") + "\n";
            });
        }
    }, 1000);

    // 重置變數
    coordinates = [];
    currentTrail++;
    recording = false;
    document.getElementById('recordButton').style.display = 'block';
}

function saveToCSV(){ 
	// 觸發下載
    // let encodedUri = encodeURI(csvContent);

    let encodedUri = encodeURI(csvData);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    currentTrail = [];
    saveData = false;
}