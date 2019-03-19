/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
let openCards = [];
const cards = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb"
];
console.log(cards);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

shuffle(cards);

for (const card of cards) {

    const li = document.createElement("li");
    const icon = document.createElement("i");

    icon.classList.add("fa");
    icon.classList.add(card);
    li.classList.add("card");
    li.appendChild(icon);
    deck.appendChild(li);

}



// Shuffle function from http://stackoverflow.com/a/2450976
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

/*
 * set up the event listener for a card. If a card is clicked:

 *  - display the card's symbol (put this functionality in another function that you call from this one)
 * 
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 * 
 *  - if the list already has another card, check to see if the two cards match
 * 
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 * 
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 * 
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 * 
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener("click", function(e) {

    const selection = e.target;

    if (selection.classList.contains("card")) {

        displaySymbol(selection);

        // check if cards match
        if (openCards.length === 2) {
            const card1 = openCards[0];
            const card2 = openCards[1];
            if (card1 === card2) {
                for (card of deck.children) {
                    if (card.classList.contains(card1)) {
                        console.log(card);
                    }
                    else {
                        openCards = [];
                    }
                }
            }
            else {
                openCards = [];
                noMatch();
            }
        }
    }

    function displaySymbol(arg) {
        arg.classList.add("open", "show");
        addCard(arg);
    };
    
    function addCard(arg) {
        let icon = arg.firstElementChild;
        openCards.push(icon);
    };

    function isMatch(arg) {
        arg.classList.add("match");
    }

    function noMatch(arg1, arg2) {
        if (arg1 !== arg2) {
            return false;
        }
    }
});
