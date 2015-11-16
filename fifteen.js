(function() {

	"use strict";

	var emptyRow = 3;
	var emptyCol = 3;
	var PUZZLE_SIZE = 4;
	var BLOCK_SIZE = 100;

	window.onload = function() {
		//extra feature
		imageSelector();

		createBlocks();		
		document.getElementById("shufflebutton").onclick = shuffle;
		document.getElementById("image").onchange = setBackgoundImg;
	};

	//this method creates 15 blocks and assign event handlers
	function createBlocks() {
		var puzzle = document.getElementById("puzzlearea");
		for (var i = 0; i < 15; i++) {
			var block = document.createElement("div");
			block.onclick = move;
			block.onmouseover = hover;
			block.classList.add("block");
			block.innerHTML = i + 1;
			var x = i % PUZZLE_SIZE * BLOCK_SIZE;
			var y = Math.floor(i / PUZZLE_SIZE) * BLOCK_SIZE;
			setId(block, y / BLOCK_SIZE, x / BLOCK_SIZE);
			block.style.left = x + "px";
			block.style.top = y + "px";

			//extra feature: set the background image to the default select option value
			block.style.backgroundImage =
					"url(\"img/background.jpg\")";

			block.style.backgroundPosition = -x + "px " + -y + "px";
			puzzle.appendChild(block);
		}
	}

	//give each block a background image and make them display correctly
	function setBackgoundImg() {
		var blocks = document.querySelectorAll(".block");
		for (var i = 0; i < 15; i++) {
			blocks[i].style.backgroundImage =
			    "url(\"img/" + this.value + "\")";
		}
	}

	//accept a block as parameter and return the row of it
	function getRow(block) {
		return parseInt(window.getComputedStyle(block).top) / BLOCK_SIZE;
	}

	//accept a block as parameter and return the column of it
	function getCol(block) {
		return parseInt(window.getComputedStyle(block).left) / BLOCK_SIZE;
	}

	//accept a block as parameter and return a boolean showing whether it is movable (neighbor
	//of the empty block), return false if the block is null
	function movable(block) {
		return block && ((Math.abs(getCol(block) - emptyCol) == 1 && getRow(block) == emptyRow) ||
			(Math.abs(getRow(block) - emptyRow) == 1 && getCol(block) == emptyCol));
	}

	//this no parameter method move is assigned to onclick event for the block
	function move() {
		//call the moveBlock method
		moveBlock(this, true);
	}

	//the move method that takes two parameters: one is the block that is be moved,
	//Extra Feature: another parameter is a boolean telling whether it should check if
	//				 the game is over after the move
	function moveBlock(block, checkWin) {
		//if the block is movable
		if (movable(block)) {
			//update the block's id to show its new position (the original empty block)
			setId(block, emptyRow, emptyCol);
			var top = emptyRow * BLOCK_SIZE + "px";
			var left = emptyCol * BLOCK_SIZE + "px";
			//update the empty block to the current block's position
			emptyRow = getRow(block);
			emptyCol = getCol(block);
			block.style.left = left;
			block.style.top = top;

			//Extra feature
			if (checkWin) {
				solved();
			}
		}
	}

	//accept a block and a row and col as parameters and assign an id to the block in the form of
	//"block_row_col"
	function setId(block, row, col) {
		block.setAttribute("id", "block_" + row + "_" + col);
	}

	//this function check each block if it is movable when the mouse is on it; if it is movable,
	//display differently
	function hover() {
		if (movable(this)) {
			this.classList.add("movable");
		} else {
			this.classList.remove("movable");
		}
	}

	//this method shuffle the whole puzzle
	function shuffle() {
		for (var i = 0; i < 1000; i++) {
			var neighbors = [];

			//try to add all four neighbors
			addNeighbors(
				document.getElementById("block_" + (emptyRow - 1) + "_" + emptyCol), neighbors);
			addNeighbors(
				document.getElementById("block_" + (emptyRow + 1) + "_" + emptyCol), neighbors);
			addNeighbors(
				document.getElementById("block_" + emptyRow + "_" + (emptyCol - 1)), neighbors);
			addNeighbors(
				document.getElementById("block_" + emptyRow + "_" + (emptyCol + 1)), neighbors);

			var pick = Math.floor(Math.random() * neighbors.length);
			moveBlock(neighbors[pick], false);
		}

		//extra feature: remove the "win" message
		if (document.getElementById("message")) {
			document.getElementById("puzzlearea").removeChild(document.getElementById("message"));
		}
	}

	//accept a block and an array of neighbors as parameter, if the block is not null,
	//add it to the neighbors array
	function addNeighbors(block, neighbors) {
		if (movable(block)) {
			neighbors.push(block);
		}
	}

	//Extra Feature #1: Test if the puzzle is solved
	function solved() {
		var blocks = document.querySelectorAll(".block");
		var result = true;
		for (var i = 0; i < blocks.length; i++) {
			//if the block's row * 4 + col + 1 does not equal to the block's assigned number
			if (getRow(blocks[i]) * 4 + getCol(blocks[i]) + 1 != parseInt(blocks[i].innerHTML)) {
				result = false;
			}
		}

		//if the game is over and the message div has not created yet, show the win message
		if (result && !document.getElementById("message")) {
			var win = document.createElement("div");
			win.setAttribute("id", "message");
			win.innerHTML = "You Win!! Good Job!!!";
			document.getElementById("puzzlearea").appendChild(win);
		}
	}

	//Extra Feature #5: add a drop-down select box to let the user select the background image
	function imageSelector() {
		var field = document.createElement("fieldset");
		var legend = document.createElement("legend");
		legend.innerHTML = "Background Image";
		var select = document.createElement("select");
		select.setAttribute("id", "image");
		var option1 = document.createElement("option");
		option1.setAttribute("value", "background.jpg");
		option1.setAttribute("selected", "selected");
		option1.innerHTML = "Cat";
		var option2 = document.createElement("option");
		option2.setAttribute("value", "saber.jpg");
		option2.innerHTML = "Saber";
		var option3 = document.createElement("option");
		option3.setAttribute("value", "assassins_1.jpg");
		option3.innerHTML = "Assassin's Creed";
		var option4 = document.createElement("option");
		option4.setAttribute("value", "night_sky.jpg");
		option4.innerHTML = "Night Sky";
		document.body.insertBefore(field, document.getElementById("controls"));
		field.appendChild(legend);
		field.appendChild(select);
		select.appendChild(option1);
		select.appendChild(option2);
		select.appendChild(option3);
		select.appendChild(option4);
	}
})();