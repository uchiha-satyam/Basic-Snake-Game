// CONSTANTS AND VARIABLES

let state = false;
const fps = 15;
let ltime = 0;
const n = 24;

let speed = 1;
let velocity = {
	x: 0,
	y: 0
};
let prevVelocity = {
	x: speed,
	y: 0
};
let snakeArr = [{x: n/2, y: n/2}, {x: n/2 - 1, y: n/2}];
let foodLocation = {x: n/2 + 3, y: n/2 + 2};

// const gameStart = new Audio('assets/audio/gamestart.mp3');
const eat = new Audio('assets/audio/eat.mp3');
const gameOver = new Audio('assets/audio/gameover.mp3');
// const move = new Audio('assets/audio/move.mp3');
const music = new Audio('assets/audio/music.mp3');

const board = document.getElementById('board');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnStart = document.getElementById('start');

// GAME FUNCTIONS

const arrowDown = () => {
	velocity = {x: 0, y: speed};
	const move = new Audio('assets/audio/move.mp3');
	move.play();
};

const arrowLeft = () => {
	velocity = {x: -(speed), y: 0};
	const move = new Audio('assets/audio/move.mp3');
	move.play();
};

const arrowRight = () => {
	velocity = {x: speed, y: 0};
	const move = new Audio('assets/audio/move.mp3');
	move.play();
};

const arrowUp = () => {
	velocity = {x: 0, y: -(speed)};
	const move = new Audio('assets/audio/move.mp3');
	move.play();
};

const main = (ctime) => {
	window.requestAnimationFrame(main);
	if(((ctime-ltime)/1000) < (1/fps)) return;
	ltime = ctime;
	updateFrame();
};

const start = () => {
	state = !state;
	if(state)
	{
		btnStart.textContent = 'Pause';
		velocity = prevVelocity;		
	}
	else
	{
		btnStart.textContent = '\u00a0Play';
		prevVelocity = velocity;
		velocity = {x: 0, y: 0};
	}
	const gameStart = new Audio('assets/audio/gamestart.mp3');
	gameStart.play();
};

const updateFrame = () => {
	// UPDATE SNAKE AND FOOD LOCATION
	// RENDER FRAME
	board.innerHTML = '';
	
	snakeArr.forEach((element, index) => {
		const color = (index==0)?'head':'tail';
		let snakePart = document.createElement('div');
		snakePart.style.gridColumnStart = element.x;
		snakePart.style.gridRowStart = element.y;
		snakePart.classList.add(color);
		board.appendChild(snakePart);
	});

	const food = document.createElement('div');
	food.style.gridColumnStart = foodLocation.x;
	food.style.gridRowStart = foodLocation.y;
	food.classList.add('food');
	board.appendChild(food);

};

// MAIN FUNCTION

window.requestAnimationFrame(main);

// EVENT LISTENERS

btnDown.onclick = arrowDown;
btnLeft.onclick = arrowLeft;
btnRight.onclick = arrowRight;
btnStart.onclick = start;
btnUp.onclick = arrowUp;

document.addEventListener('keydown', e => {
	if(e.code == 'Space')
	start();
	if(state == true)
	{
		switch(e.code)
		{
			case 'ArrowRight':
				arrowRight();
				break;
			case 'ArrowLeft':
				arrowLeft();
				break;
			case 'ArrowUp':
				arrowUp();
				break;
			case 'ArrowDown':
				arrowDown();
				break;
			default:
				break;
		}
	}
});