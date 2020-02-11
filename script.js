var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var memory_array = [];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var tiles_matched = 0;
var moves = 0;
var getCharacter;
var boardSize;
var cardStyleInactive;
var cardStyleActive;
var cardStyleFound;

if (localStorage.getItem("localHighScore") === null) {
  topvijf = [
    {
      Player: "Barak Obama",
      score: 200
    },
    {
      Player: "Bernie Sanders",
      score: 300
    },
    {
      Player: "Hillary Clinton",
      score: 400
    },
    {
      Player: "Donald Trump",
      score: 500
    },
    {
      Player: "Jeb Bush",
      score: 600
    },
  ]
  localStorage.setItem("localHighScore", JSON.stringify(topvijf));
  highScore();
}
else if (localStorage.getItem("localHighScore") !== null) {
var getLocal = localStorage.getItem("localHighScore");
topvijf = JSON.parse(getLocal);
highScore();
}

function alertName() {
  var txt;
  var person = prompt("Please enter your name:","Michiel Hegge");
  if (person == null || person == "") {
    txt = "Anoniem : " + seconds;
  } else {
      txt = person + " : " + seconds;
      alert("Gefeliciteerd " + person + " je tijd was: " + seconds + " seconden!");
  }
  topvijf.push({Player: person, score: seconds});
  highScore();
}

function highScore() {
  topvijf.sort((a, b) => (a.score > b.score) ? 1 : -1);
  localStorage.setItem("localHighScore", JSON.stringify(topvijf));
  document.getElementById("een").innerHTML = topvijf[0].Player + " : " + topvijf[0].score + " sec";
  document.getElementById("twee").innerHTML = topvijf[1].Player + " : " + topvijf[1].score + " sec";
  document.getElementById("drie").innerHTML = topvijf[2].Player + " : " + topvijf[2].score + " sec";
  document.getElementById("vier").innerHTML = topvijf[3].Player + " : " + topvijf[3].score + " sec";
  document.getElementById("vijf").innerHTML = topvijf[4].Player + " : " + topvijf[4].score + " sec";
}

function getBoardSize() {
  boardSize = document.getElementById("size").value;
  if(boardSize == 2) {
    const shuffled = alphabet.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 2);
    let selected2 = selected.concat(selected);
    memory_array = selected2;
    memory_board.style.width = '188px';
  }
  else if(boardSize == 4) {
    const shuffled = alphabet.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 8);
    let selected2 = selected.concat(selected);
    memory_array = selected2;
    memory_board.style.width = '366px';
  }
  else if(boardSize == 6) {
    const shuffled = alphabet.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 18);
    let selected2 = selected.concat(selected);
    memory_array = selected2;
    memory_board.style.width = '550px';
  }
}

function getColor() {
  cardStyleInactive = document.getElementById("cardStyleInactive").value;
  cardStyleActive = document.getElementById("cardStyleActive").value;
  cardStyleFound = document.getElementById("cardStyleFound").value; 
}

function newBoard() {
  getBoardSize();
  getColor();
  getCharacter = document.getElementById("character").value;
  tiles_matched = 0;
  tijd.innerHTML = 0;
  gevonden.innerHTML = tiles_matched;
  tiles_flipped = 0;
  moves = 0;
  memory_array = shuffle(memory_array);
  
  var output = '';
  arrayEach(memory_array, function(memory_array_value, index) {
    output += '<div id="tile_'+ index +'" onclick="memoryFlipTile(this,\''+ memory_array_value +'\')" style="background:' + cardStyleInactive + '">' + getCharacter + '</div>';
  });

  document.getElementById('memory_board').innerHTML = output;
  clearTimer();
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;
      
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
  
function canFlipCard(tile) {
  return tile.innerHTML == getCharacter && memory_values.length < 2;
}

function isOneCardFlipped() {
  return memory_values.length == 1;
}

function areNoCardsFlipped() {
  return memory_values.length == 0;
}

function setCardAsFlipped(tile, value) {
  memory_values.push(value);
  memory_tile_ids.push(tile.id);
}

function isThereIsAMatch() {
  return memory_values[0] == memory_values[1];
}

function matchCards() {
  tiles_flipped += 2;
  tiles_matched ++;
  gevonden.innerHTML = tiles_matched;
  dontFlipCardBack();
  // Clear both arrays
  memory_values = [];
  memory_tile_ids = [];
}

function isGameOver() {
  // Check to see if the whole board is cleared
  return tiles_flipped == memory_array.length;
}

function gameIsOver() {
  speeltijd.push(seconds);
  setTimeout(() => {
    //alert("Board cleared... generating new board");
    alertName();
    document.getElementById('memory_board').innerHTML = "";
    tiles_matched = 0;
    gevonden.innerHTML = tiles_matched;
    newBoard();
  }, 10);
  clearTimer();
}

function cardsDoNotMatch() {
  move();
  setTimeout(flipCardBack, 1000);
}

function dontFlipCardBack() {
  var tile_1 = document.getElementById(memory_tile_ids[0]);
  var tile_2 = document.getElementById(memory_tile_ids[1]);
  tile_1.style.background = cardStyleFound;
  tile_1.innerHTML = memory_values[0];
  tile_2.style.background = cardStyleFound;
  tile_2.innerHTML = memory_values[1];
}

function flipCard(tile, value) {
  tile.style.background = cardStyleActive;
  tile.innerHTML = value;
  moves ++;
  if(moves == 1) {
    timer();
  }
}

var interval;
var seconds;
function timer() {
  seconds = 0;
  interval = setInterval(function() {
  tijd.innerHTML = seconds++;
  if(avg == null) {
    afwijking.innerHTML = "+0s";
  }
  else if((seconds - avg) < 0) {
    afwijking.innerHTML = (seconds - avg) + "s";
    afwijking.style.color = 'green';
  }
  else {
    afwijking.innerHTML = "+" + (seconds - avg) + "s";
    afwijking.style.color = 'red';
    }
  }, 1000)
}

var speeltijd = new Array();
var sum;
var avg;

function berekenGemiddelde() {
  if(typeof speeltijd !== 'undefined' && speeltijd.length > 0) {
    sum = speeltijd.reduce((previous, current) => current += previous);
    avg = sum / speeltijd.length;
    avg = Math.round(avg);
  }
  else {
    avg = 0;
  }
}

function clearTimer() {
  berekenGemiddelde();
  gemiddeld.innerHTML = avg + "s";
  afwijking.innerHTML = "+0s";
  afwijking.style.color = 'black';
  clearInterval(interval);
}

function flipCardBack() {
  // Flip the 2 tiles back over
  var tile_1 = document.getElementById(memory_tile_ids[0]);
  var tile_2 = document.getElementById(memory_tile_ids[1]);
  tile_1.style.background = cardStyleInactive;
  tile_1.innerHTML = getCharacter;
  tile_2.style.background = cardStyleInactive;
  tile_2.innerHTML = getCharacter;

  // Clear both arrays
  memory_values = [];
  memory_tile_ids = [];
}

function memoryFlipTile(tile, value) {
  if (canFlipCard(tile)) {
    flipCard(tile, value);
    if (areNoCardsFlipped()) {
      setCardAsFlipped(tile, value);
    } else if(isOneCardFlipped()) {
      setCardAsFlipped(tile, value);
      if(isThereIsAMatch()) {
        matchCards();
        if (isGameOver()) {
          gameIsOver();
        }
      } else {
        cardsDoNotMatch();
      }
    }
  }
}

function move() {
    var elem = document.getElementById("myBar");
    var width = 10;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        elem.style.width = '1%';
      } else {
        width++;
        elem.style.width = width + '%';
        elem.innerHTML = "";
      }
    }
}