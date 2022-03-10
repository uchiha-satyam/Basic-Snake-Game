// CONSTANTS AND VARIABLES

let state = false;
const fps = 6;
let ltime = 0;
const grids = [16, 18, 20, 22, 24];
let n = grids[0];

let speed = 1;
let velocity = {
	x: 0,
	y: 0
};
let prevVelocity = {
	x: speed,
	y: 0
};
let snakeArr = [{x: n/2, y: n/2}];
let foodLocation = {x: n/2 + 3, y: n/2 + 2};
let score = 0;
let highScore = 0;

// const gameStart = new Audio('assets/audio/gamestart.mp3');
const eat = new Audio('assets/audio/eat.mp3');
const gameOver = new Audio('assets/audio/gameover.mp3');
// const move = new Audio('assets/audio/move.mp3');
const music = new Audio('assets/audio/music.mp3');
music.loop = true;

const board = document.getElementById('board');
const btnAudioControl = document.getElementById('audioControl');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnGrid = document.getElementById('grid');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const btnStart = document.getElementById('start');
const scoreBoard = document.getElementById('score').getElementsByTagName('span')[0];
const highScoreBoard = document.getElementById('highScore').getElementsByTagName('span')[0];

// GAME FUNCTIONS

const arrowDown = () => {
	if(state)
	{
		velocity = {x: 0, y: speed};
		const move = new Audio('assets/audio/move.mp3');
		move.play();
	}
};

const arrowLeft = () => {
	if(state)
	{
		velocity = {x: -(speed), y: 0};
		const move = new Audio('assets/audio/move.mp3');
		move.play();
	}
};

const arrowRight = () => {
	if(state)
	{
		velocity = {x: speed, y: 0};
		const move = new Audio('assets/audio/move.mp3');
		move.play();
	}
};

const arrowUp = () => {
	if(state)
	{
		velocity = {x: 0, y: -(speed)};
		const move = new Audio('assets/audio/move.mp3');
		move.play();
	}
};

const ate = () => {
	const x1 = snakeArr[0].x;
	const y1 = snakeArr[0].y;
	const x2 = foodLocation.x;
	const y2 = foodLocation.y;
	
	if(x1==x2 && y1==y2) return true;
	else return false;
};

const audioControl = () => {
	const move = new Audio('assets/audio/move.mp3');
	move.play();
	if(btnAudioControl.textContent == '🔊')
	{
		btnAudioControl.textContent = '🔇';
		music.muted = true;
	}
	else
	{
		btnAudioControl.textContent = '🔊';
		music.muted = false;
	}
};

const changeGrid = () => {
	const move = new Audio('assets/audio/move.mp3');
	move.play();
	let index = grids.indexOf(parseInt(btnGrid.textContent));
	if(index == grids.length - 1)
	grid(grids[0]);
	else
	grid(grids[index+1]);
};

const checkFood = (X,Y) => {
	snakeArr.forEach((e) => {
		if(e.x==X && e.y==Y)
		return true;
	});
	foodLocation = {x: X, y: Y};
	return false;
};

const collide = () => {
	const head = snakeArr[0];
	
	// HITTING BOUNDARY
	if(head.x<0 || head.x>n || head.y<0 || head.y>n)
	return true;

	// HITTING body
	for(let i=2; i<snakeArr.length; i++)
	{
		if(snakeArr[i].x == snakeArr[0].x && snakeArr[i].y == snakeArr[0].y)
		return true;
	}
	/* i is starting from 2 & not from 1 because in doing so,
	the snakeArr[0] and snakeArr[1] becomes equal during eat() which causes collide() to return true
	if the game is paused during this exact state. */

	// DEFAULT RETURN
	return false;
};

const grid = (number) => {
	if(number>0)
	{
		if(number%2==0)
		n = number;
		else
		n = number+1;
	}
	btnGrid.textContent = number;
	board.style.gridTemplateRows = 'repeat(' + n + ',1fr)';
	board.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
}

const newFood = () => {
	const a = 1;
	const b = n;
	let newX, newY;	
	do
	{
		newX = Math.round(a + (b-a)*Math.random());
		newY = Math.round(a + (b-a)*Math.random());
	}while(checkFood(newX,newY));
};

const reset = () => {
	state = false;
	score = 0;
	scoreBoard.textContent = '0';
	speed = 1;
	velocity = {x: 0, y: 0};
	prevVelocity = {x: speed, y: 0};
	snakeArr = [{x: n/2, y: n/2}];
	foodLocation = {x: n/2 + 3, y: n/2 + 2};
	btnStart.textContent = 'Start';
};

const start = () => {
	state = !state;
	if(state)
	{
		btnStart.textContent = 'Pause';
		velocity = prevVelocity;
		music.play();
	}
	else
	{
		btnStart.textContent = 'Play';
		prevVelocity = velocity;
		velocity = {x: 0, y: 0};
		music.pause();
	}
	const gameStart = new Audio('assets/audio/gamestart.mp3');
	gameStart.play();
};

// GAME ENGINE

const updateFrame = () => {

	// UPDATE SNAKE AND FOOD LOCATION

	if(collide())
	{
		music.pause();
		gameOver.play();
		alert("GAME OVER !");
		reset();
	}

	if(ate())
	{
		newFood();
		eat.play();
		snakeArr.unshift({
			x: snakeArr[0].x + velocity.x,
			y: snakeArr[0].y + velocity.y
		});
		score++;
		scoreBoard.textContent = score;
	}

	if(state)
	{
		snakeArr.unshift({
			x: snakeArr[0].x + velocity.x,
			y: snakeArr[0].y + velocity.y
		});
		snakeArr.pop();
	}

	// RENDER FRAME

	board.innerHTML = '';
	
	const food = document.createElement('div');
	food.style.gridColumnStart = foodLocation.x;
	food.style.gridRowStart = foodLocation.y;
	food.classList.add('food');
	board.appendChild(food);

	snakeArr.forEach((element, index) => {
		const color = (index==0)?'head':'tail';
		let snakePart = document.createElement('div');
		snakePart.style.gridColumnStart = element.x;
		snakePart.style.gridRowStart = element.y;
		snakePart.classList.add(color);
		board.appendChild(snakePart);
	});

};

// MAIN FUNCTION

const main = (ctime) => {
	window.requestAnimationFrame(main);
	if(((ctime-ltime)/1000) < (1/fps)) return;
	ltime = ctime;
	updateFrame();
};

window.requestAnimationFrame(main);

// EVENT LISTENERS

window.onload = () => {
	btnGrid.textContent = n;
};

btnAudioControl.onclick = audioControl;
btnDown.onclick = arrowDown;
btnGrid.onclick = changeGrid;
btnLeft.onclick = arrowLeft;
btnRight.onclick = arrowRight;
btnStart.onclick = start;
btnUp.onclick = arrowUp;

window.addEventListener('keydown', e => {
	if(e.code == 'Space')
	start();
	else
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
		case 'Escape':
			audioControl();
			break;
		case 'Backquote':
			changeGrid();
			break;
		default:
			// console.log(e.code);
			break;
	}
});