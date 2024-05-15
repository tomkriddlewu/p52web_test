let coordinate = [];
let recording = false;
let timerInterval;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	document.getElementById('recordButton').addEventListener('click', startRecording);
}

function draw() {
	background(0, 10);
	
	if(frameCount %5 == 0){
		background(0, 15);
	};
	
	noStroke();
	fill(mouseX/4, mouseY/4, random(255), 150);

	if (mouseIsPressed) {
        ellipse(mouseX, mouseY, 150, 150);
        if (recording) {
            coordinate.push([mouseX, mouseY]);
        }
    }
}


function startRecording() {
	recording = true;
            const recordButton = document.getElementById('recordButton');
            recordButton.style.display = 'none';

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
                    saveToCSV();
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

	// 重製變數
	coordinates = [];
    recording = false;
    document.getElementById('recordButton').style.display = 'block';
}