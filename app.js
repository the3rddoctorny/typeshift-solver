// --- THE TRIE ENGINE ---
let trieRoot = {};

function buildTrie(words) {
    const root = {};
    words.forEach(word => {
        let node = root;
        for (const char of word.toLowerCase()) {
            if (!node[char]) node[char] = {};
            node = node[char];
        }
        node.isWord = true;
    });
    return root;
}

function solve(columns, node, currentWord = "", results = []) {
    const colIndex = currentWord.length;
    if (colIndex === columns.length) {
        if (node.isWord) results.push(currentWord.toUpperCase());
        return results;
    }

    for (const letter of columns[colIndex]) {
        const l = letter.toLowerCase();
        if (node[l]) {
            solve(columns, node[l], currentWord + letter, results);
        }
    }
    return [...new Set(results)];
}

// --- UI LOGIC ---
const grid = document.getElementById('grid-container');
const wordListDisplay = document.getElementById('word-list');
const status = document.getElementById('status');

function createColumn() {
    const col = document.createElement('div');
    col.className = 'column';
    
    for (let i = 0; i < 9; i++) {
        const input = document.createElement('input');
        input.maxLength = 1;
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocapitalize', 'characters');

        // VERTICAL THEN HORIZONTAL ADVANCE
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                const nextInCol = e.target.nextElementSibling;
                
                if (nextInCol && nextInCol.tagName === 'INPUT') {
                    // Move down the current column
                    nextInCol.focus();
                } else {
                    // We are at the bottom! Move to the top of the NEXT column
                    const currentColumn = e.target.parentElement;
                    const nextColumn = currentColumn.nextElementSibling;
                    if (nextColumn && nextColumn.classList.contains('column')) {
                        const firstInput = nextColumn.querySelector('input');
                        if (firstInput) firstInput.focus();
                    }
                }
            }
        });

        // BACKSPACE NAVIGATION
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0) {
                const prevInCol = e.target.previousElementSibling;
                
                if (prevInCol && prevInCol.tagName === 'INPUT') {
                    // Move up the current column
                    prevInCol.focus();
                } else {
                    // Move to the bottom of the PREVIOUS column
                    const currentColumn = e.target.parentElement;
                    const prevColumn = currentColumn.previousElementSibling;
                    if (prevColumn && prevColumn.classList.contains('column')) {
                        const inputs = prevColumn.querySelectorAll('input');
                        const lastInput = inputs[inputs.length - 1];
                        if (lastInput) lastInput.focus();
                    }
                }
            }
        });

        col.appendChild(input);
    }
    grid.appendChild(col);
}

// Initial Grid Setup (5 columns)
for (let i = 0; i < 5; i++) createColumn();

document.getElementById('add-column').addEventListener('click', createColumn);

document.getElementById('solve-btn').addEventListener('click', () => {
    const columns = Array.from(document.querySelectorAll('.column')).map(col => {
        return Array.from(col.querySelectorAll('input'))
            .map(i => i.value.trim())
            .filter(v => v !== "");
    }).filter(colArr => colArr.length > 0);

    if (columns.length < 2) {
        alert("Enter letters in at least 2 columns!");
        return;
    }

    status.innerText = "Solving...";
    const start = performance.now();
    console.log("Columns being searched:", columns);
    const results = solve(columns, trieRoot);
    console.log("Results found:", results);
    const end = performance.now();

    // Only show words that use all the columns you've filled out
    const filteredResults = results.filter(w => w.length === columns.length);
    displayResults(filteredResults, end - start);
});

function displayResults(words, time) {
    wordListDisplay.innerHTML = "";
    status.innerText = `Found ${words.length} words in ${time.toFixed(2)}ms`;
    words.sort().forEach(word => {
        const chip = document.createElement('span');
        chip.className = 'word-chip';
        chip.innerText = word;
        wordListDisplay.appendChild(chip);
    });
}

document.getElementById('reset-btn').addEventListener('click', () => {
    document.querySelectorAll('input').forEach(i => i.value = "");
    wordListDisplay.innerHTML = "";
    status.innerText = "Status: Cleared";
});

// --- LOAD REAL DICTIONARY ---
async function init() {
    status.innerText = "Loading Dictionary...";
    try {
        // Fetching a standard English word list from a public JSON source
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
        const data = await response.json();
        
        // The data is an object like {"word": 1}, so we take the keys
        const allWords = Object.keys(data);
        
        // Build the Trie (The "Brain")
        trieRoot = buildTrie(allWords);
        
        status.innerText = "Dictionary Loaded! Ready to Solve.";
    } catch (err) {
        console.error("Failed to load dictionary:", err);
        status.innerText = "Error loading dictionary.";
    }
}

// Start the app
init();
