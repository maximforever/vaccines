const canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d'); 
const ANIMATION_SPEED = 50;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const VARIATION = 5;

const PEOPLE_COUNT = 100;
const MOVE_SPEED = 5;
const PERSON_SIZE = 8;
const DAY_LENGTH = 10;

let people = [];
let frame = 0;
let sickCount = 1;
let recoveredCount = 0;

let day = 1;
let sickByDay = [1];
let recoveredByDay = [0];
/*

	1. people move in random directions/bounce
	2. ever day is X frames
	3. we track how many people are sick & how long (which frame)
	4. we track which vaccine everyone has
	4. we track total # of cases

 */

init();



function init(){
	generatePeople();
	setInterval(drawLoop, ANIMATION_SPEED);
}


// main game loop

function drawLoop(){
	frame++;
	clear();
	
	if(sickCount < PEOPLE_COUNT){
		movePeople();
		infect();
		updateStats();
	}

	drawBackground();
	drawPeople();
}

function generatePeople(){
	const sickPerson = Math.floor(Math.random() * PEOPLE_COUNT)
	for(let i = 0; i < PEOPLE_COUNT; i++){
		people.push({
			id: i,
			x: WIDTH*Math.random(),
			y: HEIGHT*Math.random(),
			vaccine: false,
			sick: i === sickPerson ? true : false,
			infectionDate: null,
			recovered: false,
			deltaX: (Math.random() - 0.5) * MOVE_SPEED,
			deltaY: (Math.random() - 0.5) * MOVE_SPEED,
		})
	}
}


function drawBackground(){
	rect(0, 0, WIDTH, HEIGHT, "#000000");
}

function movePeople(){
	people.forEach((person) =>  movePerson(person));
}

function movePerson(person){
	person.x += person.deltaX;
	person.y += person.deltaY;

	if(person.x < 0) {
		person.x = WIDTH;
	}

	if(person.x > WIDTH) {
		person.x = 0;
	}

	if(person.y < 0) {
		person.y = HEIGHT;
	}

	if(person.y > HEIGHT) {
		person.y = 0;
	}
}

function drawPeople(){
	people.forEach((person) => drawPerson(person));
}

function infect(){
	people.forEach((person) => {
		if(person.sick){
			//check for collisions
			people.forEach((otherPerson) => {
				if(person.sick && !person.recovered && otherPerson.id !== person.id && !otherPerson.sick && !otherPerson.recovered && colliding(person, otherPerson)){					
					otherPerson.sick = true;
					otherPerson.infectionDate = day;
					sickCount++;
				}
			})

			// if(day - person.infectionDate > 10){
			// 	person.recovered = true;
			// 	recoveredCount++;
			// }
		}
	})
}

function drawPerson(person){
	let color = "#0000FF";

	if(person.sick){ color = "#FF0000" }
	if(person.recovered){ color = "#34e8eb" } 

	circle(person.x, person.y, PERSON_SIZE, color, false);
}

function distanceBetween(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

function colliding(objectOne, objectTwo){
	return distanceBetween(objectOne.x, objectOne.y, objectTwo.x, objectTwo.y) < PERSON_SIZE
}

function updateStats(){
	document.getElementById("frame").innerText = frame;
	document.getElementById("day").innerText = day;
	document.getElementById("sickCount").innerText = sickCount;
	document.getElementById("recoveredCount").innerText = recoveredCount;

	if(frame%DAY_LENGTH === 0){ 
		day++;
		sickByDay.push(sickCount);
		recoveredByDay.push(recoveredCount); 
	}

	document.getElementById("sickByDay").innerText = sickByDay;
	document.getElementById("recoveredByDay").innerText = recoveredByDay;
}