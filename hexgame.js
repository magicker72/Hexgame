let pangramLetters = [];
let middleLetter = "";

let pangramOld = '';
let middleLetterOld = '';
let pangramLettersOld = [];

let allHexagons = [];
let outerHexagons = [];
let centralHexagon = null;

let entryContent = null;
let messageBox = null;
let foundWords = null;
let points = null;
let wordCount = null;
let setup = true;
let todaysGame = 0;
let shaking = false;
let mobile = false;
let stealFocusAllowed = true;

let currentTypedKey = '';
let hebChars = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'װ', 'ױ', 'ז', 'ח', 'ט', 'י', 'ײ', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'];
let hebCharsExtended = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'װ', 'ױ', 'ז', 'ח', 'ט', 'י', 'ײ', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת', 'אָ','אַ','בֿ','וּ','יִ','כּ','פּ','פֿ','שׂ','תּ','ַ','ָ','ֿ','ּ','ׂ','ײַ','יִ','ײַ','שׂ','אַ','אָ','וּ','כּ','פּ','תּ','בֿ','פֿ'];

let dictionary = [];
let foundWordsList = [];
let foundWordsFinalsList = [];
let maxPoints = 0;
let maxWords = 0;
let globalPangram = '';
let globalMid = '';
let saveGameKey = [];

let yesterdayLink = '';

var charsToCombine = [
	['אַ', 'אַ'],
	['אָ', 'אָ'],
	['בֿ', 'בֿ'],
	['וּ', 'ו'],
	['יִ', 'י'],
	['ײַ', 'ײַ'],
	['כּ', 'כּ'],
	['ך', 'כ'],
	['ם', 'מ'],
	['ן', 'נ'],
	['פּ', 'פּ'],
	['פֿ', 'פֿ'],
	['ף', 'פֿ'],
	['ץ', 'צ'],
	['שׂ', 'שׂ'],
	['תּ', 'תּ']
];

var charsToSeparate = [
	['װ','וו'],
	['ײ','יי'],
	['ױ','וי'],
	['אַ','א'],
	['אָ','א'],
	['בֿ','בֿ'],
	['ײַ','יי'],
	['כּ','כּ'],
	['פּ','פּ'],
	['פֿ','פֿ'],
	['שׂ','שׂ'],
	['תּ','תּ'],
];

/**
 * sets up game
 */
const start = () => {
    // set up controls - assign buttons to functions
    allHexagons = document.querySelectorAll(".outer-hexagon, .central-hexagon");
    outerHexagons = document.querySelectorAll(".outer-hexagon");
    centralHexagon = document.querySelectorAll(".central-hexagon")[0];
    entryContent = document.querySelector("#entryContent");
    messageBox = document.querySelector("#messageBox");
    foundWords = document.querySelector("#foundWords");
	maxPointsDiv = document.querySelector("#maxPointsDiv");
	maxWordsDiv = document.querySelector("#maxWordsDiv");
    points = document.querySelector("#points");
    wordCount = document.querySelector("#wordCount");
	yesterdayGame = document.querySelector("#yesterdayGame");
	todaysGameNumber = document.querySelector("#todaysGameNumber");
	whichGame = document.querySelector("#whichGame");
	whichGameIsThis = document.querySelector("#whichGameIsThis");

    document.querySelector("#deleteButton").addEventListener("click", deleteLetter);
    document.querySelector("#shuffleButton").addEventListener("click", shuffle);
    document.querySelector("#enterButton").addEventListener("click", enter);
    document.addEventListener("keyup", typeLetter);
	//document.addEventListener("keydown", typeLetterRestricted);
	//document.addEventListener("keypress", checkKeyPress);


	//check for mobile users
	if (detectMob()) mobile = true;

    allHexagons.forEach((ele) => {
        ele.addEventListener("click", addLetter);
    });

    // seed the Math random function based on the current date
    // https://github.com/davidbau/seedrandom
	const epoch = new Date("02/16/2022");
    const today = new Date();
	today.setHours(today.getHours()-4);
	todaysGame = Math.floor((today.getTime()-epoch.getTime())/(1000*60*60*24));
	
	// set up "play another game"
	todaysGameNumber.innerText += todaysGame;
	for (let i = 1; i <= todaysGame; i++) {
		let option = document.createElement("option");
		option.innerText += i.toString();
		whichGame.appendChild(option);
	}
    Math.seedrandom("" + today.getFullYear() + today.getMonth() + today.getDate());
	// Math.seedrandom();

    // set up game
    const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("whichGame")) {
		todaysGame = urlParams.get("whichGame");
		whichGameIsThis.innerText += todaysGame;
		whichGameIsThis.style.display = "block";
	}
    if (urlParams.has("pangram")) {
        if (urlParams.has("mid")) {
            setUpWithWord(combineCharacters(urlParams.get("pangram")), combineCharacters(urlParams.get("mid")));
        } else {
            setUpWithWord(combineCharacters(urlParams.get("pangram")));
        }
		saveGameKey = [globalPangram, globalMid];
				
		// load saved game
		var savedgame = JSON.parse(window.localStorage.getItem(saveGameKey));
		if (savedgame == null) window.localStorage.setItem(saveGameKey,JSON.stringify(foundWordsList));
		else {
			for (i in savedgame) correctWord(savedgame[i]);
		};
		setup = false;
	} else {
        fetch("sevenletterwords_curated.txt?"+todaysGame).then((response) => {
            return response.text().then((file) => {
                const lines = file.split(/\n/g);
                const count = (lines || []).length;

                // const no = Math.floor(Math.random() * count);
                let todaysGameData = lines[todaysGame%lines.length].trim().split(',');
				globalPangram = todaysGameData[0];
				globalMid = todaysGameData[1];

                // console.log(pangram);
				// console.log(middleLetter);

                // setUpWithWord(pangram,mid);
				setUpWithWord(globalPangram,globalMid);
				
				saveGameKey = [globalPangram, globalMid];
				
				// yesterday's pangram
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate()-1);
				Math.seedrandom("" + yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate());
				let noOld = Math.floor(Math.random() * count);
				//pangramOld = lines[noOld].trim();
				let yesterdaysGameData = lines[((todaysGame-1%lines.length)+lines.length)%lines.length].trim().split(',');
				//console.log(yesterdaysGameData);
				pangramOld = yesterdaysGameData[0];
				middleLetterOld = yesterdaysGameData[1];
				getOldMiddleLetter(pangramOld);
				
				// load saved game
				var savedgame = JSON.parse(window.localStorage.getItem(saveGameKey));
				if (savedgame == null) window.localStorage.setItem(saveGameKey,JSON.stringify(foundWordsList));
				else {
					for (i in savedgame) correctWord(savedgame[i]);
				};
				setup = false;
            });
        });
    }

    fetch("dictionaryyiddish_curated.txt?"+todaysGame).then((response) => {
        return response.text().then((file) => {
			dictionary = file.split(/\r\n/g);
			let Calculation = maxPointsCalculation(dictionary,pangramLetters,middleLetter);
			maxPoints = Calculation[0];
			maxWords = Calculation[1];
			//console.log(Calculation[2]);
			maxPointsDiv.innerText = maxPoints;
			maxWordsDiv.innerText = maxWords;
            if (urlParams.has("pangram")) {
                dictionary.push(urlParams.get("pangram"));
            }
			//middleLetterOld = getOldMiddleLetter(pangramOld);
			// yesterdayLink.innerText = "שפּיל די נעכטיקע שפּיל".link("https://jiconway.com/hex/?pangram="+pangramOld+"&mid="+middleLetterOld);
			// console.log(pangramOld + ',' + middleLetterOld);
			// console.log(maxPointsCalculation(dictionary,pangramLettersOld, middleLetterOld)[2]);
			let yesterdaysWords = maxPointsCalculation(dictionary,pangramLettersOld, middleLetterOld)[2];
			let yesterdaySavedGameKey = [pangramOld, middleLetterOld];
			var yesterdaysSavedGame = JSON.parse(window.localStorage.getItem(yesterdaySavedGameKey));
			let playedYesterday = true;
			if (yesterdaysSavedGame == null) playedYesterday = false;
			let yesterdaysFoundWords = [];
			if (yesterdaysSavedGame) {
				for (i in yesterdaysSavedGame) yesterdaysFoundWords.push(yesterdaysSavedGame[i]);
			}
			yesterdaysWords.sort((a,b) => (separateCharacters(a) > separateCharacters(b)) ? 1 : ((separateCharacters(b) > separateCharacters(a)) ? -1 : 0));
			for (word in yesterdaysWords) {
				let li = document.createElement("li");
				li.innerText += '‮'+addFinals(yesterdaysWords[word]);
				if (playedYesterday && yesterdaysFoundWords.includes(yesterdaysWords[word])) {
					li.innerText += ' \u2713'
				}
				yesterdayGame.appendChild(li);
			};
			//yesterdayGame.style.display = 'none';
        });
    });
};

//function to check for mobile user
function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

//function to blur inputbox if on mobile
function mobileBlur() {
	if (mobile) document.getElementById("entryContent").blur();
}

//keeps focus on textbox
setInterval(function(){
	var focusbox;
	var dropdown;
	focusbox = document.getElementById("entryContent");
	dropdown = document.getElementById("whichGame");
	const elem = document.activeElement;
	if (elem != dropdown) focusbox.focus();
});


/**
 * Takes a Yiddish word and makes all the character precombined
 */
function combineCharacters(word) {
	for (replacement in charsToCombine) {
		word = word.replaceAll(charsToCombine[replacement][0], charsToCombine[replacement][1]);
	}
	return word
}

/**
 * Takes a Yiddish word and makes all the character separated
 */
function separateCharacters(word) {
	for (replacement in charsToSeparate) {
		word = word.replaceAll(charsToSeparate[replacement][0], charsToSeparate[replacement][1]);
	}
	return word
}

/**
 * Adds final letters
 */
function addFinals(word) {
	if (word.endsWith('כ')) { word = word.slice(0,-1) + 'ך';};
if (word.endsWith('מ')) { word = word.slice(0,-1) + 'ם';};
	if (word.endsWith('נ')) { word = word.slice(0,-1) + 'ן';};
	if (word.endsWith('פֿ')) { word = word.slice(0,-1) + 'ף';};
	if (word.endsWith('צ')) { word = word.slice(0,-1) + 'ץ';};
	return word
}

/**
 * Takes a seven letter word and processes it to set up the game
 */
const setUpWithWord = (pangram, mid) => {
    // remove duplicate letters
    for (let i = 0; i < pangram.length; i++) {
        if (!pangramLetters.includes(pangram[i].toUpperCase())) {
            pangramLetters.push(pangram[i].toUpperCase());
        }
    }
    shuffleArray(pangramLetters);
    if (mid && pangramLetters.includes(mid)) {
        middleLetter = mid;
    } else {
        middleLetter = pangramLetters[Math.floor(Math.random() * pangramLetters.length)];
    }
    pangramLetters.splice(pangramLetters.indexOf(middleLetter), 1);

    // for each unique letter in word, assign to hex
    for (let i = 0; i < pangramLetters.length; i++) {
        outerHexagons[i].innerText = pangramLetters[i];
    }
    centralHexagon.innerText = middleLetter;
	//globalPangram = pangram;
	//globalMid = middleLetter;
}

/**
 * Gets yesterday's middle letter
 */
function getOldMiddleLetter(pangram) {
    // remove duplicate letters
    for (let i = 0; i < pangram.length; i++) {
        if (!pangramLettersOld.includes(pangram[i].toUpperCase())) {
            pangramLettersOld.push(pangram[i].toUpperCase());
        }
    }
	const today = new Date();
	today.setHours(today.getHours()-4);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate()-1);
    Math.seedrandom("" + yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate());
	Math.random();
	for (let i = pangramLettersOld.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pangramLettersOld[i], pangramLettersOld[j]] = [pangramLettersOld[j], pangramLettersOld[i]];
    }
    return pangramLettersOld[Math.floor(Math.random() * pangramLettersOld.length)]
}

/**
 * Calculates max points
 */
function maxPointsCalculation(dictionary,pangramLetters,middleLetter) {
	let point = 0;
	let count = 0;
	let validwords = [];
	for (i in dictionary) {
		let isValid = true;
		let w = dictionary[i];
		if (w.length < 4 || !w.includes(middleLetter)) {
			isValid = false;
		}
		if (isValid) {
			for (let i = 0; i < w.length; i++) {
                if (!(pangramLetters.includes(w[i]) || w[i] === middleLetter)) {
                    isValid = false;
                    break;
                }
			}
		}
		if (isValid) {
			count++;
			validwords.push(w);
			if (w.length == 4) { point++; }
			if (w.length > 4) { point += w.length; }
			let isPangram = true;
			for (let i = 0; i < pangramLetters.length; i++) {
				if (!w.includes(pangramLetters[i])) {
					isPangram = false;
					break;
				}
			}
			if (isPangram) { point += 7; }
		}
	}
	return [point, count, validwords]
}	

/**
 * Shuffles the letters around in the outer hexagons
 */
const shuffle = () => {
    shuffleArray(pangramLetters);
    for (let i = 0; i < pangramLetters.length; i++) {
        outerHexagons[i].innerText = pangramLetters[i];
    }
};

/**
 * Adds a letter to the entered word when pressing button
 * @param {*} event button press event
 */
const addLetter = (event) => {
    const letter = event.currentTarget.innerText;
    entryContent.value += letter;
    validateLetters();
};

/**
 * Adds a letter to the entered word when typing
 * @param {*} event type event
 */
const typeLetter = (event) => {
    if (!event.metaKey) {
        event.preventDefault();
		if (!shaking) {
			if (event.code === "Enter" || event.code === "NumpadEnter") enter();
			else if (event.code === "Space") shuffle();
			}
		}
		//else {
		//	console.log('Key '+event.key+' of length '+event.key.length);
		//	console.log('Keycode '+event.code);
		//}
};

const typeLetterRestricted = (event) => {
    if (event.code === "Backspace" || event.code === "Delete") deleteLetter();
}

const checkKeyPress = (event) => {
    if (!event.metaKey) {
		event.preventDefault();
		if (event.code == 'Enter' || event.code === 'NumpadEnter') enter();
		else if (event.code == 'Space') shuffle();
		else if (event.key == 'ַ' || event.key == 'ָ' || event.key == 'ֿ' || event.key == 'ּ' || event.key == 'ִ') {
			currentTypedKey += event.key;
			entryContent.value = entryContent.value.slice(0,-1)+combineCharacters(combineCharacters(currentTypedKey));
			validateLetters();
		}
		else if (hebChars.includes(event.key)) {
			currentTypedKey = event.key;
			entryContent.value += combineCharacters(combineCharacters(currentTypedKey));
			validateLetters();
		}
    }
};

/**
 * Deletes a letter from the entered word
 */
const deleteLetter = () => {
    if (entryContent.value.length > 0) {
        entryContent.value = entryContent.value.slice(0, -1);
    }
    validateLetters();
};

/**
 * Adds valid or invalid class to entered word field
 */
const validateLetters = () => {
	const regex = /[^אַָבֿגדהוּװױזחטיִײײכךלמםנןסעפףצץקרשׂתיִײַשׂאַאָוּכּפּתּבֿפֿ]/g;
	entryContent.value = entryContent.value.replaceAll(regex,'');
	let middleLetterOther = addFinals(middleLetter);
	entryContent.value = combineCharacters(entryContent.value);
    entryContent.classList.remove("valid");
    entryContent.classList.remove("invalid");
	if (entryContent.value.includes('ך')) {
		entryContent.value = entryContent.value.replaceAll('ך','כ')
	}
	if (entryContent.value.endsWith('כ')) {
		entryContent.value = entryContent.value.slice(0,-1) + 'ך';
	}
	if (entryContent.value.includes('ם')) {
		entryContent.value = entryContent.value.replaceAll('ם','מ')
	}
	if (entryContent.value.endsWith('מ')) {
		entryContent.value = entryContent.value.slice(0,-1) + 'ם';
	}
	if (entryContent.value.includes('ן')) {
		entryContent.value = entryContent.value.replaceAll('ן','נ')
	}
	if (entryContent.value.endsWith('נ')) {
		entryContent.value = entryContent.value.slice(0,-1) + 'ן';
	}
	if (entryContent.value.includes('ף')) {
		entryContent.value = entryContent.value.replaceAll('ף','פֿ')
	}
	if (entryContent.value.endsWith('פֿ')) {
		entryContent.value = entryContent.value.slice(0,-1) + 'ף';
	}
	if (entryContent.value.includes('ץ')) {
		entryContent.value = entryContent.value.replaceAll('ץ','צ')
	}
	if (entryContent.value.endsWith('צ')) {
		entryContent.value = entryContent.value.slice(0,-1) + 'ץ';
	}
	if (entryContent.value.includes(middleLetter) || entryContent.value.includes(middleLetterOther)) {
        entryContent.classList.add("valid");
    } else {
        entryContent.classList.add("invalid");
    }
};

/**
 * Event listener to get word from entry content and then check if word is valid and process valid/invalid words.
 */
const enter = () => {
    //get word
    const word = combineCharacters(entryContent.value);
    let isValid = true;

    //check if word is valid
    if (word.length > 0) {
        if (isValid && word.length < 4) {
            isValid = false;
            incorrectWord("צו קורץ");
        }
        if (isValid && !word.includes(middleLetter)) {
            isValid = false;
            incorrectWord("פֿעלט צענטראַלן אות");
        }
		if (isValid) {
			for (let i = 0; i < word.length; i++) {
                if (!(pangramLetters.includes(word[i]) || word[i] === middleLetter)) {
                    isValid = false;
                    incorrectWord("אומגילטיקע אותיות");
                    break;
                }
            }
		}
        if (isValid && !dictionary.includes(word)) {
            isValid = false;
            incorrectWord("נישט אין װערטער־אוצר");
        }
        if (isValid && foundWordsList.includes(word)) {
            isValid = false;
            incorrectWord("שױן געפֿונען");
        }
        if (isValid) {
            console.log("גוט װאָרט");
            correctWord(word);
			window.localStorage.setItem(saveGameKey, JSON.stringify(foundWordsList));
        }
    }


};

/**
 * Processes the entry when the word is a valid word
 * @param {*} word 
 */
const correctWord = (word) => {
    //add word to list
    foundWordsList.push(word);
	foundWordsFinalsList.push(addFinals(word));
	foundWordsFinalsList.sort((a,b) => (separateCharacters(a) > separateCharacters(b)) ? 1 : ((separateCharacters(b) > separateCharacters(a)) ? -1 : 0));
	foundWords.innerText = foundWordsFinalsList.join('\r\n').toString();

    //check if pangram
    let isPangram = true;
    for (let i = 0; i < pangramLetters.length; i++) {
        if (!word.includes(pangramLetters[i])) {
            isPangram = false;
            break;
        }
    }

    //add points
    let currentPoints = parseInt(points.innerText);
    let newPoints = word.length;
    if (word.length === 4) newPoints = 1;
    if (isPangram) newPoints += 8;
    points.innerText = currentPoints + newPoints;

    //update number of words found
    wordCount.innerText = foundWordsList.length;

    //show positive message
	if (!setup) {
		if (isPangram) {
			let pointsToAdd = parseInt(word.length)+7;
			showGoodMessage("פּאַנגראַם! +"+pointsToAdd);
		} else if (word.length === 4) {
			showGoodMessage("גוט! +1");
		} else if (word.length < 7) {
			showGoodMessage("װוּנדערלעך! +"+word.length);
		} else {
			showGoodMessage("אױסגעצײכנט! +"+word.length);
		}
	}
    //reset entry
    entryContent.value = "";
};

/**
 * Processes the entry when the word is an invalid word
 * @param {*} error 
 */
const incorrectWord = (error) => {
    entryContent.classList.add("shake");
	shaking = true;
    messageBox.innerText = error;
    entryContent.addEventListener("animationend", () => {
        entryContent.value = "";
        messageBox.innerText = "";
        entryContent.classList.remove("shake");
		shaking = false;
    });
};

/**
 * Show a message without the shake
 * @param {} message 
 */
const showGoodMessage = (message) => {
    messageBox.innerText = message;
    messageBox.classList.add("valid");
    setTimeout(() => {
        messageBox.innerText = "";
       messageBox.classList.remove("valid");
    }, 1000);
}

/**
 * Helper function to shuffle an array
 * https://stackoverflow.com/a/12646864/8182370
 * @param {*} array array to shuffle
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

window.onload = start;