// Variables - storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

// This variables will be used to monitor if the user already won once in the value of 2048, 4096, or 8192
// If one of these variables value became true, it means the player already won once in specific values
let is2048Exist = false; // true
let is4096Exist = false;
let is8192Exist = false;

// function to set the gameboard to have tiles
function setGame(){

	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
       	[0, 0, 0, 0],
       	[0, 0, 0, 0]
    ]; // This board will be used as the backend board to design and modify the tiles of the frontend board

	// loop
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			// Creates a div element
			let tile = document.createElement("div");

			// Assign an id based on the position of the tile
			tile.id = r.toString() + "-" + c.toString();

			// Retrieves the number of the tile from the backend board
					// board[2][3]
			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();  
}

// This function is to update the color of the tile based on its num value
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	// <div class="tile"></div>
	tile.classList.add("tile");

	if(num > 0){

		// <div class="tile">2</div>
		tile.innerText = num.toString();

		// 2 < 8192
		if(num < 8192) {
			// <div class="tile x2">2</div>
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}


// event that triggers when the web page finishes loading. It's like saying "wait until everything on the page is ready."
// This code assures that all is ready, in our case our html and stylesheet (css) before running function setGame();
window.onload = function() {
    // `setGame()` is called to be executed
    setGame();
}


// Function that handles the user's keyboard input when they press certain arrow keys.
// "e" represents the event object, which contains information about the event occured.
function handleSlide(e){

	console.log(e.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}

		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}

		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}

		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}


	document.getElementById("score").innerText = score;

	setTimeout(()=>{
		checkWin();
	}, 100)
	

	if(hasLost() == true){

		setTimeout(() => {
			alert("Game Over. You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart")
		}, 100);
	}
}

// Function that handles the user's keyboard input when they press certain arrow keys.
// "e" represents the event object, which contains information about the event occured.
document.addEventListener("keydown", handleSlide);




function filterZero(row){
    // create new array removing the zeroes
    // removing empty tiles
    return row.filter(num => num != 0) ;
}


// Core function for sliding and merging tiles in a row.
function slide(tiles){

	//[ 2, 0, 2, 2] -> [2, 2, 2]
	tiles = filterZero(tiles);

	for(let i=0; i < tiles.length-1; i++){

		if(tiles[i] == tiles[i+1]){ // true 
			tiles[i] = tiles[i] * 2; //[4, 2, 2]
			tiles[i+1] = 0; // [4, 0, 2]

			score += tiles[i]; // adds the merged tile value to the score
		}
	}

	tiles = filterZero(tiles); // [4, 2]


	while(tiles.length < columns){
		tiles.push(0); // [4, 2, 0, 0]
	}
	return tiles;

}


// slideLeft function will use slide function to merge matching adjacent tiles.
// For merging, Slide left and right will be mainly through row values 
function slideLeft(){

	for(let r=0; r<rows; r++){

		// All tiles values per row are saved in a container row
		let row = board[r];
		row = slide(row); // use slide function to merge the same values
		board[r] = row;  // update the row with the merged tile/s

		// Because of this loop, we are able to update the id and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updated, but all the rows.

		for(let c=0; c<columns; c++){
			// Accesses the tile using it's id 
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}

	}
}

// For merging, Slide left and right will be mainly through row values 
function slideRight(){

	for(let r=0; r<rows; r++){

		// All tiles values per row are saved in a container row
		let row = board[r];

		// 2 2 2 0 -> 0 2 2 2
		row.reverse();

		row = slide(row); // use slide function to merge the same values 
		// 4 2 0 0
		row.reverse();
		// 0 0 2 4

		board[r] = row;  // update the row with the merged tile/s

		// Because of this loop, we are able to update the id and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updated, but all the rows.

		for(let c=0; c<columns; c++){
			// Accesses the tile using it's id 	
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}

	}
}


function slideUp(){

	for(let c=0; c<columns; c++){


		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
				// [0, 2, 2, 2] 
		col = slide(col); // use slide function to merge the same values
		// update the row with the merged tile/s
				// [4, 2, 0, 0]

		// Because of this loop, we are able to update the id and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updated, but all the rows.
		for(let r=0; r<rows; r++){

			board[r][c] = col[r];
			// Accesses the tile using it's id 
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}

	}
}

function slideDown(){

	for(let c=0; c<columns; c++){


		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
				// [0, 2, 2, 2] 

		col.reverse()
		col = slide(col); // use slide function to merge the same values
		// update the row with the merged tile/s
				// [4, 2, 0, 0]
		col.reverse();

		// Because of this loop, we are able to update the id and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updated, but all the rows.
		for(let r=0; r<rows; r++){

			board[r][c] = col[r];
			// Accesses the tile using it's id 
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}

	}
}


function hasEmptyTile(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if(board[r][c] == 0) {
				return true;
			}

		}
	}
	return false;
}

function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}

	let found = false;
	while(found == false){

		// This will generate a random value based on the rows value (0-3)
		// [random r]
		let r = Math.floor(Math.random() * rows); 
		// [random c]
		let c = Math.floor(Math.random() * columns); 

		// if(board[random r][random c] == 0)
		if(board[r][c] == 0){

			// If the tile is an empty tile, we convert the empty tile to 2 (0 -> 2)
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			// <div class="x2">2</div>
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}	
	}
}

function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096! You are fantastically unstoppable!");
				is4096Exist = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome!");
				is8192Exist = true;
			}
		}
	}
}

function hasLost(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if(board[r][c] == 0){
				return false;
			}

			
			const currentTile = board[r][c];
			
			if( 			
							    
				r > 0 && board[r-1][c] === currentTile || // to check if the current tile matches to the upper tile
				r < 3 && board[r+1][c] === currentTile || // to check if the current tile matches to the lower tile
				c > 0 && board[r][c-1] === currentTile || // to check if the current tile matches to the left tile
				c > 3 && board[r][c+1] === currentTile // to check if the current tile matches to the right tile
			){
				return false;
			}
			// No possible moves - meaning true, the user has lost.
			
				
		}



	}

	

	return true;
}

function restartGame(){
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];
	score = 0;
	setTwo();
}



















