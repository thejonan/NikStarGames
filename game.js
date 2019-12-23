var tochki = 0,
    sarceDavam = 0,
    sarceVzimam = 0,
    stenaPoqvqvane = 0,
	sarce = {
		X: 10,
		Y: 10,
		RazmerX: 100,
		RazmerY: 10
	},
	my = {
		X: 0,
		Y: 0,
		Razmer: 120,
		Skorost: 3
	},
	lastPatronTime = 0,
	lastJellyTime = 0,
	patronArr = [],
	jelly0Arr = [];
		
my.X = ((800 - my.Razmer) / 2);
my.Y = ((600 - my.Razmer) / 2);

function steni(obekt) {
	if (obekt.X <= 0) {
		obekt.X = 0;
		return false;
	}
	else {
		if (obekt.X >= 800 - obekt.Razmer) {
			obekt.X = 800 - obekt.Razmer;
			return false;
		}
	}
	
	if (obekt.Y >= 600 - obekt.Razmer) {
		obekt.Y = 600 - obekt.Razmer;
		return false;
	}
	else if (obekt.Y <= 0) {
		obekt.Y = 0;
		return false;
	}
	
	return true;
}

function dvijenieTarget(obekt, target) {
	var stepX = target.X - obekt.X,
		stepY = target.Y - obekt.Y,
		stepSize = Math.sqrt(stepX * stepX + stepY * stepY);
	
	obekt.X += stepX * obekt.Skorost / stepSize;
	obekt.Y += stepY * obekt.Skorost / stepSize;
}

function dvijenie(obekt, target) {
	if (obekt.Posoka & 1) {
		obekt.X -= obekt.Skorost;
	}
	else if (obekt.Posoka & 4) {
		obekt.X += obekt.Skorost;
	}

	if (obekt.Posoka & 2) {
		obekt.Y -= obekt.Skorost;
	}
	else if (obekt.Posoka & 8) {
		obekt.Y += obekt.Skorost;
	}
}

function strelqne() {
	var now = Date.now();
	
	if (now - lastPatronTime < 200)
		return;

	//Strelqne my.
	var patron = {
		Razmer: 20,
		Skorost: 10,
		Posoka: 0
	};

	if (isKeyPressed[65]){
		patron.X = my.X ;
		patron.Y = my.Y + ((my.Razmer - patron.Razmer) / 2) ;
		patron.Posoka += 1 ;
	}
	else if (isKeyPressed[87]){
		patron.X = my.X + ((my.Razmer - patron.Razmer) / 2) ;
		patron.Y = my.Y ;
		patron.Posoka += 2 ;
	}
	else if (isKeyPressed[68]){
		patron.X = my.X + my.Razmer ;
		patron.Y = my.Y + ((my.Razmer - patron.Razmer) / 2) ;
		patron.Posoka += 4 ;
	}
	else if (isKeyPressed[83]){
		patron.X = my.X + ((my.Razmer - patron.Razmer) / 2);
		patron.Y = my.Y + my.Razmer ;
		patron.Posoka += 8 ;
	}
	else
		return;

	lastPatronTime = now;
	patronArr.push(patron);
}

function novoJelly0() {
	var now = Date.now();
	
	if (now - lastJellyTime < 20 * 1000)
		return;
	if (jelly0Arr.length < 3) {
		var jelly0 = {
			level: 3,
			X: 800,
			Y: 600,
			Razmer: 100,
			Skorost: 1
		};

		jelly0Arr.push(jelly0);
		postavianeJelly(jelly0);
	}
	else if(jelly0Arr[0].Skorost < 3) {
		for (var i = 0;i < jelly0Arr.length; i++)
			jelly0Arr[i].Skorost += 2;
	}
	
	lastJellyTime = now;
}

function postavianeJelly(jelly0) {
	stenaPoqvqvane = randomInteger(4) + 1 ;
	if (stenaPoqvqvane == 1){
		jelly0.X = 800 - jelly0.Razmer ;
		jelly0.Y = randomInteger(600 - jelly0.Razmer) ;
	}
	if (stenaPoqvqvane == 2){
		jelly0.X = randomInteger(800 - jelly0.Razmer) ;
		jelly0.Y = 600 - jelly0.Razmer ;
	}
	if (stenaPoqvqvane == 3){
		jelly0.X = 0 ;
		jelly0.Y = randomInteger(600 - jelly0.Razmer) ;
	}
	if (stenaPoqvqvane == 4){
		jelly0.X = randomInteger(800 - jelly0.Razmer) ;
		jelly0.Y = 0 ;
	}
}

function udarPatron(patron, jelly0) {
	if (areColliding(patron.X,patron.Y,patron.Razmer,patron.Razmer,jelly0.X,jelly0.Y,jelly0.Razmer,jelly0.Razmer)){
		patron.X = 10000;
		patron.Y = 10000;
		
		jelly0.level--;
		if (jelly0.level < 0) {
			tochki++ ;

			postavianeJelly(jelly0);

			sarceDavam = randomInteger(25) + 1;
			console.log("Tochki: ",tochki) ;
		}
	}
}

function update() {
    
    sarce.RazmerX -= sarceVzimam ;
    
    //Poluchavam sarce
    if (sarceDavam == 1){
        sarce.RazmerX += 20 ;
        sarceDavam = 0 ;
    }
    
    //Ogranichenie na sarce
    if (sarce.RazmerX >= 200){
        sarce.RazmerX = 200 ;
    }
    else if (sarce.RazmerX <= 0){
        sarce.RazmerX = 0 ;
        my.X = -10000 ;
        my.Y = -10000 ;
		jelly0Arr = [];
    }
    
	for (var i = 0;i < patronArr.length; i++) {
		dvijenie(patronArr[i]);
	}
	
	patronArr = patronArr.filter(steni);
	
	novoJelly0();
	
	sarceVzimam = 0;
	for (var i = 0;i < jelly0Arr.length; i++) {
		var jelly0 = jelly0Arr[i];
		
		dvijenieTarget(jelly0, my);
		
		steni(jelly0);
		
		if (areColliding(jelly0.X,jelly0.Y,jelly0.Razmer,jelly0.Razmer,my.X,my.Y,my.Razmer,my.Razmer)) {
			sarceVzimam += 0.75 ;
		}
		
		for (var j = 0;j < patronArr.length; j++) {
			udarPatron(patronArr[j], jelly0);
		}
	}

	if (sarce.RazmerX > 0) {
		my.Posoka = 0;
		if (isKeyPressed[37]) { // Left
			my.Posoka += 1;
		}
		if(isKeyPressed[38]) { // Up
			my.Posoka += 2;
		}
		if(isKeyPressed[39]) { // Right
			my.Posoka += 4;
		}
		if(isKeyPressed[40]) { // Down
			my.Posoka += 8;
		} 
		
		strelqne();
    
		dvijenie(my);

		steni(my);
    }
}

function draw() {
    drawImage(backCake,0, 0, 800, 600);
    drawImage(star,
              my.X,
              my.Y,
              my.Razmer,
              my.Razmer);
	
    drawImage(paddle,
              sarce.X,
              sarce.Y,
              sarce.RazmerX,
              sarce.RazmerY);
	
	for(var i = 0; i < jelly0Arr.length; i++) {
		var jelly0 = jelly0Arr[i];
		drawImage(jelly[jelly0.level],
				  jelly0.X,
				  jelly0.Y,
				  jelly0.Razmer,
				  jelly0.Razmer);
	}
	for (var i = 0;i < patronArr.length; i++) {
		var patron = patronArr[i];
		drawImage(starGold,
				  patron.X,
				  patron.Y,
				  patron.Razmer,
				  patron.Razmer);
	}
}

function keydown(key) {
}

function mouseup() {
    
    console.log("Mouse clicked at", mouseX, mouseY);
}
