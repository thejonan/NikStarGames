var MapArr = [[], [], []],
	turn = 0 ,
	row,
	col;
function update() {

}
function draw() {
	drawGrid(200);
}
function keydown(key) {
	// if (key == 32){

	// }
}
function mouseup() {
	row = Math.floor( mouseY / 200 );
	col = Math.floor( mouseX / 200 );
}
