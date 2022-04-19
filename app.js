/*
NOTES
    - Description:
        Classic Blackjack game with options for "betting".
    - Code Overview:
        Section A for variable declaration.
        Section B for helper functions and classes.
        Section C for what the user is expected to go through.
    - Versions and Timeline:
        v1.0:   Started on 2022 Apr 15 11:00. Finished a working version at 21:45, after 5~7 hours of coding.
                Code is very much not clean and may also contain bugs, but the game works.
                Hope to clean the code and add more features later.
        v1.1:   Cleaning the code: started on 2022 Apr 17 21:30. Finished with a much cleaner (I guess) code at 0:05.
        v1.2:   Added the reset feature. Took around 30 minutes.
        v2.0:   Worked on adding a LogIn system with user Profiles. Started using firebase-firestore.
                Players can now create their own accounts with name, password, W-L-D score and cash.
                There's also a "guest mode", of course. (2022 Apr 18 22:45 - 0:05). 
        v2.1:   Adding the displaying mechanism. (2022 Apr 19 14:10 - 16:20).
*/

/* SECTION A. Declaring Variables */

// 1    Document Objects & Related Variables
// 1.1  Pages & Display Objects
const welcomePg = document.querySelector('.welcomePage');
const gamePg = document.querySelector('.gamePage');
const resultPg = document.querySelector('.resultPage');
const header = document.querySelector('.headerAboveCards');
const loginForm = document.querySelector('.loginForm');
const loginMsg = document.querySelector('.loginForm h3');

const winN = document.querySelector('#winN');
const loseN = document.querySelector('#loseN');
const drawN = document.querySelector('#drawN');
const winD = document.querySelector('.win');
const loseD = document.querySelector('.lose');
const drawD = document.querySelector('.draw');
let win = 0; // Win Lose Draw numbers.
let lose = 0;
let draw = 0; 
let resultD; // Result to be displayed.

// 1.2  Betting
const betAmt = document.querySelector('#betBar');
const betContainer = document.querySelector('.betContainer');
const betValue = document.querySelector('#betValue');
const rangeInput = document.querySelector('#rangeInput');
const pot = document.querySelector('#pot');
let bet = 0;

// 1.3  Hit/Stand Buttons
const btns = document.querySelectorAll('.btn');
const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');

// 1.4 Cash
const cashTxt = document.querySelector('#cashText');
let cash = 100;
/*      -----------------------------------------------------    */

// 2.       Cards
// 2.1      DOM-related Cards
// 2.1.1    For Player
let cP1 = document.querySelector('#player1');
let cP2 = document.querySelector('#player2');
let cP3 = document.querySelector('#player3');
let cP4 = document.querySelector('#player4');
let cP5 = document.querySelector('#player5');
let pCardsDisplay = [cP1, cP2, cP3, cP4, cP5];
const cPlayer = document.querySelector('.playerCards');

// 2.2.2    For Comp
let cC1 = document.querySelector('#comp1');
let cC2 = document.querySelector('#comp2');
let cC3 = document.querySelector('#comp3');
let cC4 = document.querySelector('#comp4');
let cC5 = document.querySelector('#comp5');
let cCardsDisplay = [cC1, cC2, cC3, cC4, cC5];
const cComp = document.querySelector('.compCards');

// 2.2      Script-related Cards
// 2.2.1    Arrays For The Deck
let deckT = ['spades', 'hearts', 'diamonds', 'clubs'];
let deck = [];

// 2.2.2    Player's Hand
let pCards = [];
let pCCount = 0;
let playerValue = 0;

// 2.2.3    Comp's Hand
let cCards = [];
let cCCount = 0;
let compValue = 0;
/*      -----------------------------------------------------    */

// 3.   Other Misc. Variables
let threeCardFlag;          // To help rule out the possibility of ${"A-9-K"} counting wrong.
let standBtnFlag = false;   // To help reduce work for checking whether or not to display StandBtn.
let dealObj = [];           // To save Deal objects (well, I don't know how to work with a single instance yet, so...)
let dealingCards1, dealingCards2, dealingCards3, dealingCards4, dealingCards5; // Same as above.

let userRecord = [0,0,0];
let userCash = 100;
let username, userpassword, userID, userIndex;   //User Profile
/*      -----------------------------------------------------    */
/*      -----------------------------------------------------    */

/* SECTION B. Setting Up The Program */

// 1.   Creating the Deck
class Deck {
    //Constructor and starts the processes.
    constructor() {
        this.dIndex = 0;
        this.cardBuilder();
    }
    //Adds cards to the deck by loopint through 13 cards of 4 types (A-K, SHDC).
    cardBuilder() {
        for (let i = 1; i < 14; i++) {
            for (let j = 0; j < 4; j++) {
                this.cardPopulator(i, j);
            }
        }
    }
    //Handles adding the card objects to the deck.
    cardPopulator(number, type) {
        deck[this.dIndex] = {
            cNumber: number,
            cType: deckT[type],
            cImg: `deck/${number}_of_${deckT[type]}.png`
        };
        this.dIndex++;
    }
}
/*      -----------------------------------------------------    */

// 2.   Dealing Cards
class Deal {
    constructor() {
        this.turn;
        this.time;
        this.delay;
    }
    dealAndShow(turn, time, delay) {
        /*  turn:'player' or 'comp'. 
            time: total cards for that receiver. 
            delay: yes(1) or no(0).                */
        this.turn = turn;
        this.time = time;
        this.delay = delay;

        //  Deals the cards and shows them on the screen. On 1 sec intervals.
        this.deal();
        if (this.turn === 'player') {
            pCardsDisplay[this.time].src = pCards[this.time].cImg;
            setTimeout(() => { pCardsDisplay[this.time].style.display = 'block'; }, (3 ** this.time) * 1000 * this.delay);
        } else if (this.turn === 'comp') {
            cCardsDisplay[this.time].src = 'cardBack01.png'; // Comp's cards will only be revealed at the end of the game.
            setTimeout(() => { cCardsDisplay[this.time].style.display = 'block'; }, (2 ** this.time) * 2000 * this.delay);
        }
    }
    deal() {
        // Deals a random card (add into one of the cardArrays) and removes that card from the deck.
        let n = Math.floor(Math.random() * (deck.length));
        if (this.turn === 'player') {
            pCards[pCCount] = deck[n];
            pCCount++;
        } else if (this.turn === 'comp') {
            cCards[cCCount] = deck[n];
            cCCount++;
        }
        deck.splice(n, 1);
    }
}

/*      -----------------------------------------------------    */

// 3.  Object Creator and Value Checker Functions
function createObj(){
    new Deck();
    dealingCards1 = new Deal();
    dealingCards2 = new Deal();
    dealingCards3 = new Deal();
    dealingCards4 = new Deal();
    dealingCards5 = new Deal();
    dealObj = [dealingCards3, dealingCards4, dealingCards5];
}

function checkValue(cArray) {
    let cValue = 0;
    let arrLen = cArray.length;
    // return cArray[0].cNumber;
    for (let i = 0; i < arrLen; i++) {
        if (cArray[i].cNumber === 1) {
            if (arrLen === 2) {
                cValue += 11;
            } else if (arrLen === 3) {
                cValue += 10;
                threeCardFlag = true;
            } else {
                cValue += 1;
            }
        } else if (cArray[i].cNumber >= 10) {
            cValue += 10;
        } else {
            cValue += cArray[i].cNumber;
        }
    }
    return cValue;
}
/*      -----------------------------------------------------    */

// 4. Dealing With The Result
class Result{
    constructor(){
        this.result();
    }
    result() {
        // Make sure that A-9-K isn't 29.
        threeCardFlag = false;
        playerValue = checkValue(pCards);
        if (threeCardFlag === true && pCCount === 3 && playerValue > 21) {
            playerValue -= 9;
        }
        threeCardFlag = false;
        compValue = checkValue(cCards);
        if (threeCardFlag === true && cCCount === 3 && compValue > 21) {
            compValue -= 9;
        }
        console.log("pCCount,cCCount,playerValue,computerValue",pCCount,cCCount,playerValue,compValue);
        // Conditions:
        if (pCCount === 5 && playerValue < 22) {
            console.log("playerWins");
            resultD = winD;
            this.playerWin();
        } else if (compValue < 22 && (cCCount === 5 || playerValue > 21 || compValue > playerValue)) {
            console.log("computerWins");
            resultD = loseD;
            this.compWin();
        } else if (playerValue < 22 && (compValue > 21 || playerValue > compValue)) {
            console.log("playerWins");
            resultD = drawD;
            this.playerWin();
        } else {
            console.log("draw");
            this.draw();
        }
        gamePg.style.display = 'none';
        resultD.style.display = 'block';
        saveData();
    }
    // Win,Lose,Draw Animations
    playerWin(){
        cash += bet * 2;
        cashTxt.textContent = cash;
        win++;
        winN.textContent = win;
        resultD = winD;
    }
    compWin(){
        lose++;
        loseN.textContent = lose;
        resultD = loseD;
    }
    draw(){
        cash += bet;
        cashTxt.textContent = cash;
        draw++;
        drawN.textContent = draw;
        resultD = drawD;
    }
}

function saveData(){
    db.collection("userInfo").get()
        .then((response) => {response.docs[userIndex].data().userRecord = [win, lose, draw]});
}

// 5. Resetter Function
function reset(){
    // Resets the necessary variables.
    // (2.2.1.)   Arrays For The Deck
    deck = [];
    // (2.2.2)    Player's Hand
    pCards = [];
    pCCount = 0;
    playerValue = 0;
    // (2.2.3)   Comp's Hand
    cCards = [];
    cCCount = 0;
    compValue = 0;
    // (3.)   Other Misc. Variables
    threeCardFlag;          
    standBtnFlag = false;  
    dealObj = [];   

    //Recreates data.
    createObj();

    // Refreshes the game page.
    resultD.style.display = 'none';
    gamePg.style.display = 'block';
    pCardsDisplay.forEach(e=>e.style.display='none');
    cCardsDisplay.forEach(e=>e.style.display='none');
    betContainer.style.display = 'flex';
}

/*      -----------------------------------------------------    */
/*      -----------------------------------------------------    */

/* SECTION C. Starting The Game */

// 1.        Game Flow UI/UX (ain't so sure about the terminology, but you get the point).
// 1.1.      Starting
// 1.1.1.    Logging In
function formAnimation(){
    // In case the user doesn't click on the buttons.
    loginForm.style.border = '2px solid #333';
    setTimeout(() => {
        loginForm.style.border = '2px solid #D69215'
    }, 500);
}

function getUserInfo(){
    // So that both sign in and sign up can use these.
    username = document.querySelector('#name').value;
    userpassword = document.querySelector('#password').value;
}
async function  login(){
    getUserInfo();
    let index = 0; // To help with getting userIndex.
    let flag = false; // Whether or not the user exists in the database.
    // Search the database for user's profile.
    await db.collection('userInfo').get()
        .then((response)=>{response.docs.forEach(
            (doc) => {
                if(doc.data().name === username && doc.data().password === userpassword){
                    document.querySelector('#greetName').textContent = username;
                    cash = doc.data().cash;
                    userRecord = [doc.data().win, doc.data().loss, doc.data().draw];
                    userIndex = index;
                    flag = true;
                    start();
                }
                index++;
            }
        )})
        .catch(err=>console.log(err));
    
    // For when the user profile is not found.
    if(!flag){
        document.querySelector('.startBtn').textContent = "Hmm.. account not found.";
        formAnimation();
        setTimeout(() => {
            location.reload();
        }, 2000); 
    }    
}

function createAcc(){
    // Displaying the createAcc form.
    loginMsg.textContent = "Great. Please fill in:";
    document.querySelector('#loginBtn').style.display = 'none';
    document.querySelector('#createBtn').style.display = 'none';
    document.querySelector('#confirmBtn').style.display = 'block';
}

function addAcc(){
    // Actually adding the account to the database.
    getUserInfo();
    let newUser = {cash: 100, draw: 0, name: username, password: userpassword, loss: 0, win: 0};
    // When the user clicked submit.
    db.collection('userInfo').add(newUser)
        .then(()=>{
            loginMsg.textContent = "Successfully added! Please log in again.";
            setTimeout(()=>{location.reload();}, 2000);
        })
}

//  1.1.2.  Starting The Game
function start() {
    welcomePg.style.display = 'none';
    gamePg.style.display = 'block';
    document.querySelector('.titleSub').style.display = 'none';
    winN.textContent = userRecord[0];
    loseN.textContent = userRecord[1];
    drawN.textContent = userRecord[2];
    createObj();
}
/*      -----------------------------------------------------    */

// 1.2. Betting
function showVal(val) {
    betValue.innerHTML = betAmt.value;
}
function confirmBet() {
    bet = (Number)(betAmt.value);
    cash -= bet;

    betContainer.style.display = 'none';
    pot.textContent = bet * 2; //Because the pot holds player's bet plus the comp"s.
    cashTxt.textContent = cash;

    dealInitialCards();
}
/*      -----------------------------------------------------    */

// 1.3      Dealing Cards
// 1.3.1.   Changing The Header
function changeHeader(){
    header.innerHTML = "<h2> GET READY ... </h2>";
    setTimeout(() => {
        header.style.display = 'none';
    }, 2000);
}

// 1.3.2.   Initial Dealing (2 Cards Each)
function dealInitialCards() {
    changeHeader();
    // Dealing cards (2 cards each).
    // For reasons unknown to me at this time, it doesn't work with only one object (images replacing each other).
    dealingCards1.dealAndShow('player', pCCount, 1);
    dealingCards1.dealAndShow('comp', cCCount, 1);
    dealingCards2.dealAndShow('player', pCCount, 1);
    dealingCards2.dealAndShow('comp', cCCount, 1);

    //Displaying Buttons. (StandBtn will display only when playerValue>14)
    setTimeout(() => { btns[0].style.display = 'block'; }, 5000); // HIT BTN
    setTimeout(() => { if (checkValue(pCards) > 14) { btns[1].style.display = 'block'; standBtnFlag = true; } }, 5000); // STAND BTN
}

//  1.3.3.   Hitting & Standing
function hit() {
    dealingCards3.dealAndShow('player', pCCount, 0);
    if (pCCount === 5) {
        hitBtn.style = 'disable';
    }
    if ((standBtnFlag === false && checkValue(pCards) > 14) || pCCount === 5) {
        standBtn.style.display = 'block';
        standBtnFlag = true;
    }
}

async function stand() {
    //Disables Btns
    btns.forEach(e => e.style.display = 'none');

    //Comp will stand when it's (15,16,17) or more.
    let compChoice = Math.floor(Math.random() * 3) + 15;
    let dealObjIndex = 0;
    while (checkValue(cCards) < compChoice && cCCount !== 5) {
        dealObj[dealObjIndex].dealAndShow('comp', cCCount, 0);
        dealObjIndex++;
    }

    //Showing Comp's Cards:
    function sleep(ms) {
        //This helps setting up the timer.
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let i = 0;
    while (i < cCards.length) {
        await sleep(1000);  //Time between revealing each card.
        cCardsDisplay[i].src = cCards[i].cImg;
        i++;
    }
    setTimeout(() => new Result(), 2000);
}
