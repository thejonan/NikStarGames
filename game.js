var MapArr = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	turn = 0,
	gameActive = true,
	sizeGrid = 200,
	padGrid = 10,
	winLine = null
	scores = {
		x: 0,
		o: 0
	};

function makeTurn (move){
	var row = move.row,
		col = move.col;
	if (gameActive && MapArr[row][col] == 0){
		MapArr[row][col] = (turn++) % 2 == 0 ? "o" : "x" ;
	}
}

function testTurn(who, turn) {
	var winLine = checkWin(),
		max = {
			row: null,
			col: null,
			score: -Infinity
		};

	if (!!winLine)
		max.score = (MapArr[winLine.row][winLine.col] == who ? 1 : -1) * (10 - turn);
	else {
		for (var row = 0; row < 3; ++row) 
			for (var col = 0; col < 3; ++col) {
				if (!!MapArr[row][col])
					continue;
				
				// Make the turn.
				MapArr[row][col] = who;
				// Check the score. Recursively.
				var score = -testTurn(who == 'x' ? 'o' : 'x', turn + 1).score;
				// Undo the turn.
				MapArr[row][col] = 0;

				// Verify if this is a better score.
				if (score > max.score) {
					max.score = score;
					max.row = row;
					max.col = col;
				}
			}
	}

	// Align the score, if that was a draw.
	if (max.score < -20)
		max.score = 0;
	return max;
};

function checkLine(info) {
	var val = MapArr[info.row][info.col], v2, v3;

	if (info.dir == 2) {
		v2 = MapArr[info.row + 1][info.col];
		v3 = MapArr[info.row + 2][info.col];
	} else {
		v2 = MapArr[info.row + info.dir][info.col + 1];
		v3 = MapArr[info.row + info.dir * 2][info.col + 2];
	}
	return val && val == v2 && val == v3 ? info : null;
}

function newGame() {
	MapArr = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	turn = 0;
	gameActive = true;
	document.getElementById("button-new-game").style.display = "none";
}

function endGame() {
	if (winLine != null){
		var winner = MapArr[winLine.row][winLine.col];
		
		scores[winner]++ ;
		document.getElementById("scores-el-" + winner).innerHTML = scores[winner] ;
	}

	gameActive = false;
	document.getElementById("button-new-game").style.display = "block";
}

function checkWin(){
	return checkLine({row: 0, col: 0, dir: 0}) ||
		checkLine({row: 1, col: 0, dir: 0}) ||
		checkLine({row: 2, col: 0, dir: 0}) ||

		checkLine({row: 0, col: 0, dir: 2}) ||
		checkLine({row: 0, col: 1, dir: 2}) ||
		checkLine({row: 0, col: 2, dir: 2}) ||

		checkLine({row: 0, col: 0, dir: 1}) ||
		checkLine({row: 2, col: 0, dir: -1});
}

function update() {
	if (!gameActive)
		return;

	winLine = checkWin();
	if (turn == 9 || winLine != null)
		endGame();
	else if (turn % 2 == 1)
		makeTurn(testTurn('x', 1));
}

function draw() {
	drawGrid(sizeGrid);
	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < 3; col++) {
			var val = MapArr[row][col];
			if (val) {
				drawImage(val == "x" ? laserBlue[2] : ballOrTree,
					col * sizeGrid + padGrid,
					row * sizeGrid + padGrid,
					sizeGrid - 2 * padGrid,
					sizeGrid - 2 * padGrid);
			}
		}
	}

	if (winLine != null){
		if (winLine.dir == 2) {
			drawLine(padGrid, winLine.col * sizeGrid + sizeGrid / 2,
					winLine.row * sizeGrid + sizeGrid / 2,
					winLine.col * sizeGrid + sizeGrid / 2,
					(winLine.row + 2) * sizeGrid + sizeGrid / 2);
		} else {
			drawLine(padGrid, winLine.col * sizeGrid + sizeGrid / 2,
				winLine.row * sizeGrid + sizeGrid / 2,
				(winLine.col + 2) * sizeGrid + sizeGrid / 2,
				(winLine.row + winLine.dir * 2) * sizeGrid + sizeGrid / 2);
		}
	}
}

function keydown(key) {
	// if (key == 32){

	// }
}

function mouseup () {
	makeTurn({ row: Math.floor( mouseY / sizeGrid ), col: Math.floor( mouseX / sizeGrid ) });
}
