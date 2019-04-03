/**
 * module - queries
 */
const query = (() => {
    const deck = document.querySelector('.deck');
    const restartIcon = document.querySelector('.restart');
    const timerSpan = document.querySelector('.timer-time');
    const stars = document.querySelector('.score-panel').children;
    const playerDetails = document.querySelector('.player-details');
    const beginButton = playerDetails.querySelector('.begin-btn');
    const sideBarUl = document.querySelector('.leader-ul');

    return {
        deck: deck,
        restartIcon: restartIcon,
        timerSpan: timerSpan,
        stars: stars,
        playerDetails: playerDetails,
        beginButton: beginButton
    };
})();

/**
 * module - values
 */
const nums = (() => {
    let moveCount = 0;
    let pairCount = 0;
    let starCount = 0;
    let seconds = 0;
    let minutes = 0;
    let zeroSec;
    let zeroMin;
    let timerObj;
    
    return {
        moveCount: moveCount,
        pairCount: pairCount,
        starCount: starCount,
        seconds: seconds,
        minutes: minutes,
        zeroSec: zeroSec,
        zeroMin: zeroMin,
        timerObj: timerObj,
    };
})();

/**
 * module - arrays
 */
const arr = (() => {
    let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    let openCards = [];
    let players = [];

    return {
        cards: cards,
        openCards: openCards,
        players: players
    };
})();

/**
 * start game
 */
query.beginButton.addEventListener('click',  (e) => {
    e.preventDefault();

    // get player name input value
    const playerName = query.playerDetails.querySelector('#first-name').value;

    // push player into players array using createPlayer class
    arr.players.push( new createPlayer(playerName));

    // get player
    let activeUser = document.querySelector('.active-user');

    // close modal
    query.playerDetails.classList.replace('modal-open', 'modal-closed');

    shuffle(arr.cards);

    for (let card of arr.cards) {
        const li = document.createElement('li');
        const icon = document.createElement('i');
        icon.classList.add('fa'); // add 'fa-question-circle'
        icon.classList.add(card);
        li.classList.add('card', 'flex', 'align', 'justify-center');
        li.appendChild(icon);
        query.deck.appendChild(li);
    }
    activeUser.innerText = arr.players[0].name;
    startTimer();
});

/**
 * createPlayer class
 */
class createPlayer {
    constructor (value) {
        this.name = value;
        this.score = 0;
    }
}

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} array is the cards 
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
query.deck.addEventListener('click', (e) => {
    if (arr.openCards.length < 2) {
        const selection = e.target;

        // check if same card is clicked twice
        if (selection.classList.contains('show')) {
            return;
        } else {

            // check if target is card li
            if (selection.nodeName === 'LI') {
                showCard(selection);
                addCard(selection);
    
                // check if cards match
                if (arr.openCards.length > 1) {
                    moveCounter();
                    starRating();
                    if (arr.openCards[0].classList.value === arr.openCards[1].classList.value) {
                        isMatch();
                        if (nums.pairCount === 1) {
                            completed();
                            successModal();
                        }
                    } else {
                        noMatch();
                    }
                }

            }

        }
    }
});

/**
 * add timer interval
 */
function startTimer() {
    nums.timerObj = setInterval(timer, 1000);
}
/**
 * timer action
 */
function timer() {
    (nums.seconds < 9) ? nums.zeroSec = 0 : nums.zeroSec = '';
    if (nums.seconds < 59) {
        nums.seconds += 1;
    } else {
        nums.minutes += 1;
        nums.seconds = 0;
        nums.zeroSec = 0;
    }
    (nums.minutes <= 9) ? nums.zeroMin = 0 : nums.zeroMin = '';
    query.timerSpan.textContent = `${nums.zeroMin}${nums.minutes}:${nums.zeroSec}${nums.seconds}`;
}

/**
 * restart during game
 */
query.restartIcon.addEventListener('click', () => {
    restartGame();
});

/**
 * show selected card
 * @param {node} selection is the target clicked
 */
function showCard(selection) {
    selection.classList.add('open', 'show');
}

/**
 * add card to openCards
 * @param {node} selection is the target clicked
 */
function addCard(selection) {
    return arr.openCards.push(selection.firstElementChild);
}

/**
 * cards match
 */
function isMatch() {
    for (let card of query.deck.children) {
        if (card.classList.contains('open')) {
            card.classList.add('match', 'enlarge');
            card.classList.remove('open', 'show');
        }
    }
    arr.openCards = [];
    nums.pairCount += 1;
}

/**
 * cards dont match - remove from openCards array
 */
function noMatch() {
    setTimeout(() => {
        for (let card of query.deck.children) {
            card.classList.remove('open', 'show');
        }
        arr.openCards = [];
    }, 800);
}

// count player's moves
function moveCounter() {
    const moveCounterSpan = document.querySelector('.moves');
    nums.moveCount += 1;
    moveCounterSpan.innerHTML = nums.moveCount;
}

// star rating
function starRating() {
    if (nums.moveCount > 14) {
        query.stars[2].firstElementChild.classList.remove('star-lit');
    }
    if (nums.moveCount > 20) {
        query.stars[1].firstElementChild.classList.remove('star-lit');
    }
}

/**
 * game is completed
 */
function completed() {
    const successUl = document.getElementById('success-stars');

    // clear timer
    clearInterval(nums.timerObj);

    // load stars rating into success modal
    successUl.innerHTML = query.stars[0].parentNode.innerHTML;

    // load time into success modal
    setTimeout( () => {
        const successContainer = document.querySelector('.success-container');
        const successCount = document.querySelector('.success-count');
        const timeAmount = document.querySelector('.time-amount');
        let showMins;
        let s;

        if (nums.minutes >= 1) {
            if(nums.minutes > 1) {
                s = 's';
            } else {
                s = '';
            }
            showMins = `${nums.minutes} minute${s} and`;
        } else {
            showMins = '';
        }

        timeAmount.innerHTML = `${showMins} ${nums.seconds} seconds`;
        successCount.innerHTML = nums.moveCount;
        successContainer.classList.replace('modal-closed', 'modal-open');
    },800);

    // add player name and time to leaderboard
    function el(_type, _class) {
        const element = document.createElement(_type);
        element.classList.add(_class);
        return element;
    }

    const leaderLi = el('LI', 'leader-li flex justify align');
    const leaderName = el('SPAN', 'leader-name');
    const leaderTime = el('SPAN', 'leader-time');

    leaderName.innerText = arr.players[0];
    leaderTime.innerText = `${nums.minutes}:${nums.seconds}`;
    
    leaderLi.appendChild(leaderName);
    leaderLi.appendChild(leaderTime);
    query.sideBarUl.appendChild(leaderLi);

}

/**
 * success modal
 */
function successModal() {
    const restartButton = document.querySelector('.restart-btn');
    restartButton.addEventListener('click', () => {
        const successContainer = document.querySelector('.success-container');
        successContainer.classList.replace('modal-open', 'modal-closed');
        restartGame();
    });
}

/**
 * restart game
 */
function restartGame() {
    const eachCard = query.deck.querySelectorAll('.card');
    const moveCounterSpan = document.querySelector('.moves');
    
    moveCounterSpan.innerHTML = 0;
    shuffle(arr.cards);

    // reload the deck
    for (let i = 0; i < eachCard.length; i++) {
        eachCard[i].classList.remove('match', 'show', 'open', 'enlarge');
        eachCard[i].firstElementChild.classList = 'fa ' + arr.cards[i];
    }

    // reload the stars
    for (star of query.stars) {
        if (star.firstElementChild.classList.contains('star-lit')) {
            continue;
        }
        else {
            star.firstElementChild.classList.add('star-lit');
        }
    }

    // reset values
    nums.moveCount = 0;
    nums.pairCount = 0;
    nums.starCount = 0;
    arr.openCards = [];

    // clear timer
    clearInterval(nums.timerObj);
    query.timerSpan.textContent = '00:00';
    nums.seconds = 0;
    nums.minutes = 0;

    // start timer
    startTimer();
}
