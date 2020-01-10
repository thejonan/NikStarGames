var MapArr = [[], [], []]
	turn = 0 ,
	I,
	i;
function update() {

}
function draw() {
	if (I = 0 || i = 0){
		drawImage()
	}
}
function keydown(key) {
	// if (key == 32){

	// }
}
function mouseup() {

	if (mouseX >= 0 || mouseX < 200 ){
		I = 0;
	}
	if (mouseX >= 200 || mouseX < 400){
		I = 1;
	}
	if (mouseX >= 400 || mouseX < 600){
		I = 2;
	}

	if (mouseY >= 0 || mouseY < 200){
		i = 0;
	}
	if (mouseY >= 200 || mouseY < 400){
		i = 1;
	}
	if (mouseY >= 400 || mouseY < 600){
		i = 2;
	}
}
