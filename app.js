let trieRoot = {};
:root {
    --primary: #2c3e50;
    --accent: #27ae60;
    --bg: #ecf0f1;
    --card: #ffffff;
}

body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); margin: 0; display: flex; justify-content: center; color: var(--primary); }

.app-container { max-width: 900px; width: 95%; padding: 20px; text-align: center; }

.grid-container {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 20px 10px;
    margin-bottom: 20px;
    scroll-behavior: smooth;
    border-bottom: 2px solid #bdc3c7;
}

.column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 60px;
    background: var(--card);
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.column input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid #dfe6e9;
    border-radius: 8px;
}

.column input:focus { border-color: var(--accent); outline: none; background: #f9f9f9; }

.primary-btn { background: var(--accent) !important; font-weight: bold; }

button { padding: 12px 18px; cursor: pointer; background: #95a5a6; color: white; border: none; border-radius: 8px; margin: 5px; transition: 0.2s; }
button:hover { opacity: 0.8; }

.word-chip-container { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 15px; }

.word-chip { background: var(--primary); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; letter-spacing: 1px; }

#status { font-size: 0.8rem; color: #7f8c8d; margin-bottom: 10px; }
