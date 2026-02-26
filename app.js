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
    for (let i = 0; i < 7; i++) { // Supporting up to 7 rows per column
        const input = document.createElement('input');
        input.maxLength = 1;
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

    displayResults(results, end - start);
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
