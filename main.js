const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const nextButton = document.querySelector('.next-button');
const gameText = document.querySelector('.game-text');
const startPage = document.querySelector('.start-page');
const siteMain = document.querySelector('.site-main');
const game = document.querySelector('.wrap-all');
const li = document.getElementsByTagName('li');
const root = document.documentElement;
let l0 = document.getElementsByClassName("list0");
let l1 = document.getElementsByClassName("list1");
let l2 = document.getElementsByClassName("list2");
let l3 = document.getElementsByClassName("list3");
const tileCount = 4;
const dragged = {
	el: null,
	class: null,
	index: null
};
let fileName = null;
let tiles = [];
let isPlaying = false;
let imgNum = 1;
let isClick = false;
var clientX, clientY;
//set game
function setGame() {
	container.innerHTML = '';
	gameText.style.display = 'none';
	tiles = createImageTiles();
	tiles.forEach((tile) => container.appendChild(tile));
	setTimeout(() => {
		container.innerHTML = '';
		shuffle(tiles).forEach((tile) => container.appendChild(tile));
		gameStart();
	}, 2000);
}

function gameStart() {
	isPlaying = true;
}
//make img tiles
function createImageTiles() {
	const tempArray = [];
	Array(tileCount).fill().forEach((_, i) => {
		const li = document.createElement('li');
		li.setAttribute('data-index', i);
		li.setAttribute('draggable', 'true');
		li.classList.add(`list${i}`);
		li.classList.add(`list`);
		tempArray.push(li);
	});
	return tempArray;
}
//shuffle card
function shuffle(array) {
	let index = array.length - 1;
	while (index > 0) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[ array[index], array[randomIndex] ] = [ array[randomIndex], array[index] ];
		index--;
	}
	return array;
}
//check is complete
function checkStatus() {
	const currentList = [ ...container.children ];
	const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute('data-index')) !== index);
	if (unMatchedList.length === 0) {
		gameText.style.display = 'block';
		isPlaying = false;
		if (imgNum == 3) {
			nextButton.style.display ="none";
			gameText.innerHTML="All Completed!!";
			alert('모든 퍼즐을 다 맞추셨습니다.');
			location.reload();
		}
		nextButton.style.display ="block";
	}
}
//SELLECT IMGFILE
function sellectfile(imgfile) {
	game.style.display="block";
	startPage.style.display="none";
    siteMain.style.display="none";
	fileName = imgfile;
	root.style.setProperty('--url','url("img/'+fileName+'/'+imgNum +'.jpg")');
}
function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
//	FOR MOBILE
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	window.onload=function() {
		
		container.addEventListener('click', (event) => {
			if (!isPlaying) return;
			const obj = event.target;
			dragged.el = obj;
			dragged.class = obj.className;
			dragged.index = [ ...obj.parentNode.children ].indexOf(obj);
			isClick === true;
			event.preventDefault();
		});
		container.addEventListener('mousedown', (event) => {
			if (!isPlaying) return;
			const obj = event.target;
			if (obj.className !== dragged.class) {
				let originPlace;
				let isLast = false;
				isClick = false;
				if (dragged.el.nextSibling) {
					originPlace = dragged.el.nextSibling;
				} else {
					originPlace = dragged.el.previousSibling;
					isLast = true;
				}
				const droppedIndex = [ ...obj.parentNode.children ].indexOf(obj);
				dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
				isLast ? originPlace.after(obj) : originPlace.before(obj);
			}
			checkStatus();
		});
		setInterval(function() {
			if (l0.length == 2) {
				l0[1].remove()
			} else if(l1.length == 2){
				l1[1].remove()
			}else if(l2.length == 2){
				l2[1].remove()
			}else if(l3.length == 2){
				l3[1].remove()
			}},10)
	}	
}
//FOR COMPUTER
container.addEventListener('dragstart', (event) => {
	if (!isPlaying) return;
	const obj = event.target;
	dragged.el = obj;
	dragged.class = obj.className;
	dragged.index = [ ...obj.parentNode.children ].indexOf(obj);
});

container.addEventListener('dragover', (event) => {
	event.preventDefault();
});

container.addEventListener('drop', (event) => {
	if (!isPlaying) return;
	const obj = event.target;
	if (obj.className !== dragged.class) {
		let originPlace;
		let isLast = false;
		if (dragged.el.nextSibling) {
			originPlace = dragged.el.nextSibling;
		} else {
			originPlace = dragged.el.previousSibling;
			isLast = true;
		}
		const droppedIndex = [ ...obj.parentNode.children ].indexOf(obj);
		dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
		isLast ? originPlace.after(obj) : originPlace.before(obj);
	}
	checkStatus();
});
// CLICK EVENT
startButton.addEventListener('click', () => {
	setGame();
	const currentList = [ ...container.children ];
	currentList.forEach((li) => {
		li.innerText = "";
	});
	startButton.style.display ="none";
});

nextButton.addEventListener('click', () => {
	setGame();
	const currentList = [ ...container.children ];
	currentList.forEach((li) => {
		li.innerText = "";
	});
	nextButton.style.display ="none";
	gameText.style.display = 'none';
	imgNum ++;
	root.style.setProperty('--url','url("img/'+fileName+'/'+imgNum +'.jpg")');
})