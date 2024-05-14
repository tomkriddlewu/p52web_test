function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
}

function draw() {
	// noFill(); 
	noStroke();
	fill(mouseX/4, mouseY/4, random(255));
	print(frameCount);
	// strokeWeight(3);
	// stroke("white");
	if (mouseIsPressed){
		ellipse(mouseX, mouseY, frameCount, frameCount);
	}else{
		stroke(255);
		noFill();
		rectMode(CENTER);
		rect(mouseX, mouseY, 20, 20);
	}
}