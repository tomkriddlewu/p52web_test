let coordinate = [];
let recording = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	document.getElementById('recordButton').addEventListener('click', toggleRecording);
    document.getElementById('saveButton').addEventListener('click', saveToCSV);
}

function draw() {
	// background(0, 10);
	
	// if(frameCount %5 == 0){
	// 	background(0, 15);
	// };
	
	noStroke();
	fill(mouseX/4, mouseY/4, random(255), 150);

	if (mouseIsPressed) {
        ellipse(mouseX, mouseY, 150, 150);
        if (recording) {
            coordinate.push([mouseX, mouseY]);
        }
    }
}

// function keyPressed() {
//     if (key === 'k' || key === 'K') {
//         recording = !recording;
//         if (recording) {
//             console.log("開始記錄");
//         } else {
//             console.log("停止紀錄");
//         }
//     }
//     if (key === 's' || key === 'S') {
//         saveToCSV();
//     }
// }

function toggleRecording() {
	recording = !recording;
	const recordButton = document.getElementById('recordButton');
	if (recording) {
		recordButton.textContent = 'Stop Recording';
		console.log("開始記錄");
	} else {
		recordButton.textContent = 'Start Recording';
		console.log("開始記錄");
	}
}

function saveToCSV(){
	let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "X,Y\n";
    coordinate.forEach(coord => {
        csvContent += coord.join(",") + "\n";
    });
    

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "coordinates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}