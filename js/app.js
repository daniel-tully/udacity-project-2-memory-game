// cards
var cards = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];

// global variables
var deck = document.querySelector('.deck');
var moveCounterSpan = document.querySelector('.moves');
var moveCount = 0;
var pairCount = 0;
var openCards = [];

// start game
window.onload = function() {
    shuffle(cards);
    for (i = 0; i < cards.length; i++) {
        var li = document.createElement('li');
        var icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add(cards[i]);
        li.classList.add('card');
        li.appendChild(icon);
        deck.appendChild(li);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** 
 * capture click event on any card in deck
*/
deck.addEventListener('click', function(e) {
    if (openCards.length < 2) {
        const selection = e.target;

        if (selection.classList.contains('card')) {
            showCard(selection);
            addCard(selection);

            // check if cards match
            if (openCards.length > 1) {
                moveCounter();
                if (openCards[0].value === openCards[1].value) {
                    isMatch();
                    if (pairCount === 8) {
                        completed();
                        restartGame();
                    }
                } else {
                    noMatch();
                }
            }
        }
    }

});

// show selected card
function showCard(param) {
    param.classList.add('open', 'show');
};

// add card to openCards
function addCard(param) {
    var icon = param.firstElementChild.classList;
    return openCards.push(icon);
};

// cards match
function isMatch() {
    for (const card of deck.children) {
        if (card.classList.contains('open')) {
            card.classList.add('match');
            card.classList.remove('open', 'show');
        }
    }
    openCards = [];
    pairCount += 1;
}

// cards dont match
function noMatch() {
    setTimeout(function () {
        for (const card of deck.children) {
            card.classList.remove('open', 'show');
        }
        openCards = [];
    }, 1000);
}

// count player's moves
function moveCounter() {
    moveCount += 1;
    moveCounterSpan.innerHTML = moveCount;
}

// game is completed
function completed() {
    setTimeout(function () {
        var successContainer = document.querySelector('.success-container');
        var successCount = document.querySelector('.success-count');
        successCount.innerHTML = moveCount;
        successContainer.style.display = 'flex';
    },300);
}

// restart game
function restartGame() {
    var restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', function (){
        var eachCard = deck.querySelectorAll('.card');
        var successContainer = document.querySelector('.success-container');

        successContainer.style.display = 'none';
        moveCounterSpan.innerHTML = 0;
        shuffle(cards);

        for (i = 0; i < eachCard.length; i++) {
            eachCard[i].classList.remove('match');
            eachCard[i].firstElementChild.classList = 'fa ' + cards[i];
        }
        moveCount = 0;
        pairCount = 0;
    });
}
