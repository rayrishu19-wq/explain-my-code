/* ========================================
   EXPLAIN MY CODE — App Logic
   Groq API Integration (Free & Fast!) + Instant Demo Mode
   ======================================== */

// ============ CONFIG ============
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Using Llama 3.3 70B via Groq for high performance and speed.
 * This model is excellent for coding explanations and logic reasoning.
 */
const GROQ_MODEL = 'llama-3.3-70b-versatile';


// ============ DOM ELEMENTS ============
const elements = {
    codeInput: document.getElementById('code-input'),
    btnExplain: document.getElementById('btn-explain'),
    btnClear: document.getElementById('btn-clear'),
    btnCopy: document.getElementById('btn-copy'),
    btnDownload: document.getElementById('btn-download'),
    outputSection: document.getElementById('output-section'),
    outputContent: document.getElementById('output-content'),
    outputTitle: document.getElementById('output-title'),
    charCount: document.getElementById('char-count'),
    wordCount: document.getElementById('word-count'),
    languageSelect: document.getElementById('language-select'),
    inputTitle: document.getElementById('input-title'),
    modeDescText: document.getElementById('mode-desc-text'),

    // Modal & Status Elements
    apiKeyModal: document.getElementById('api-key-modal'),
    apiKeyInput: document.getElementById('api-key-input'),
    btnSaveKey: document.getElementById('btn-save-key'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnTryDemo: document.getElementById('btn-try-demo'),
    btnStatus: document.getElementById('btn-status'),
    statusText: document.getElementById('status-text'),

    // Tabs
    modeTabs: document.querySelectorAll('.mode-tab'),
    exampleChips: document.querySelectorAll('.example-chip'),
    btnResetApi: document.getElementById('btn-reset-api'),
};


// ============ STATE ============
// 'currentMode' holds the identifier of the active tab (e.g., 'explain', 'eli5', 'error').
let currentMode = 'explain';
// 'isLoading' is a boolean flag to track if an API request is currently in progress.
let isLoading = false;
// 'apiKey' stores the user's Groq API key retrieved from local storage.
let apiKey = '';
try {
    apiKey = localStorage.getItem('groq_api_key') || '';
} catch (e) {
    console.error('LocalStorage access denied:', e);
}

// ============ MODE CONFIGS ============
const modeConfigs = {
    explain: {
        title: '📋 Paste Your Code',
        description: 'Paste your code and get a clear, beginner-friendly explanation.',
        outputTitle: '✨ Explanation',
        prompt: (code, lang) => `You are a friendly coding teacher. Explain the following ${lang} code in a clear, beginner-friendly way. 
Use simple language that a beginner programmer can understand.
Structure your explanation with:
- A brief summary of what the code does
- How it works step-by-step
- Any important things to note

Use markdown formatting. Use **bold** for important terms and \`code\` for code references.

Code:
\`\`\`${lang}
${code}
\`\`\``
    },
    eli5: {
        title: '📋 Paste Your Code',
        description: '🍭 Get a super simple explanation — like you\'re explaining to a 5-year-old!',
        outputTitle: '👶 ELI5 Explanation',
        prompt: (code, lang) => `You are explaining code to a complete beginner who has never programmed before. 
Explain this ${lang} code like you're talking to a 5-year-old child.
Use:
- Simple everyday analogies (like recipes, toys, building blocks)
- Very short sentences
- Fun emojis to make it engaging
- No technical jargon at all
- Compare programming concepts to real-world things kids understand

Use markdown formatting.

Code:
\`\`\`${lang}
${code}
\`\`\``
    },
    'line-by-line': {
        title: '📋 Paste Your Code',
        description: '📝 Every single line will be explained individually.',
        outputTitle: '📝 Line-by-Line Breakdown',
        prompt: (code, lang) => `You are a patient coding teacher. Break down this ${lang} code LINE BY LINE.
For each line:
1. Show the original line of code in a code block
2. Below it, explain what that line does in simple language
3. If it's important, mention WHY it's needed

Format like this for each line:
### Line X
\`\`\`
<the actual code line>
\`\`\`
**Explanation:** <what this line does>

Be thorough but keep explanations beginner-friendly. Use markdown formatting.

Code:
\`\`\`${lang}
${code}
\`\`\``
    },
    concepts: {
        title: '📋 Paste Your Code',
        description: '🔑 Highlights key concepts like loops, functions, and variables.',
        outputTitle: '🔑 Key Concepts',
        prompt: (code, lang) => `You are a coding teacher. Analyze this ${lang} code and identify ALL key programming concepts used.

For each concept found, explain it under a clear heading. Categorize them like:

### 🔄 Loops
Explain any loops found and how they work here.

### ⚡ Functions
Explain any functions and their purpose.

### 📦 Variables
List and explain the variables used.

### 🔀 Conditionals
Explain any if/else or switch statements.

### 📚 Data Structures
Explain any arrays, objects, lists, etc.

### 🧩 Other Concepts
Any other concepts (classes, imports, error handling, etc.)

Only include categories that are actually present in the code.
For each concept, explain it in beginner-friendly language and show the relevant code snippet.
Use markdown formatting with **bold** for terms and \`code\` for references.

Code:
\`\`\`${lang}
${code}
\`\`\``
    },
    error: {
        title: '❌ Paste Your Error',
        description: '🔧 Paste an error message and get a clear explanation of what went wrong.',
        outputTitle: '🔧 Error Explained',
        prompt: (code, lang) => `You are a helpful debugging assistant. A beginner programmer got this error and doesn't understand it.

Explain this error in a very beginner-friendly way:

1. **🔍 What the error means** — translate the technical message into simple English
2. **❓ Why it happened** — common causes for this type of error
3. **✅ How to fix it** — step-by-step solutions with code examples
4. **💡 Pro tip** — how to avoid this error in the future

Use simple language, emojis for visual appeal, and markdown formatting.
If relevant code is included with the error, reference specific lines.

Error/Code:
\`\`\`
${code}
\`\`\``
    }
};

// ============ EXAMPLE SNIPPETS ============
const examples = {
    'python-loop': {
        code: `# Calculate the sum of numbers from 1 to 10
total = 0
for i in range(1, 11):
    total += i
    print(f"Adding {i}, total is now {total}")

print(f"The final sum is: {total}")`,
        lang: 'python'
    },
    'js-fetch': {
        code: `// Fetch user data from an API
async function getUser(userId) {
    try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const userData = await response.json();
        console.log('User:', userData.name);
        return userData;
    } catch (error) {
        console.error('Failed to fetch user:', error.message);
    }
}

getUser(42);`,
        lang: 'javascript'
    },
    'java-class': {
        code: `public class Student {
    private String name;
    private int age;
    private double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }

    public boolean isHonorRoll() {
        return this.gpa >= 3.5;
    }

    @Override
    public String toString() {
        return name + " (Age: " + age + ", GPA: " + gpa + ")";
    }
}`,
        lang: 'java'
    },
    'rust-enum': {
        code: `// Define a Rust enum with associative data
enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
}

fn inspect_event(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("page loaded"),
        WebEvent::KeyPress(c) => println!("pressed key: {}", c),
        WebEvent::Click { x, y } => {
            println!("clicked at x={}, y={}", x, y);
        }
    }
}`,
        lang: 'rust'
    },
    'go-routine': {
        code: `package main

import (
    "fmt"
    "time"
)

func worker(id int) {
    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    go worker(1)
    go worker(2)
    
    // Wait for goroutines to finish
    time.Sleep(2 * time.Second)
}`,
        lang: 'go'
    },
    'error-msg': {
        code: `Traceback (most recent call last):
  File "app.py", line 15, in <module>
    result = calculate_average(numbers)
  File "app.py", line 8, in calculate_average
    return sum(numbers) / len(numbers)
ZeroDivisionError: division by zero`,
        lang: 'auto'
    },
    'cpp-template': {
        code: `// A simple C++ template function
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
        lang: 'c++'
    },
    'bash-script': {
        code: `#!/bin/bash
# Check if directory exists
DIR="/var/log"
if [ -d "$DIR" ]; then
    echo "Directory $DIR exists."
    ls -la "$DIR" | head -n 5
else
    echo "Directory $DIR does not exist."
fi`,
        lang: 'bash'
    }
};

// ============ BUILT-IN DEMO EXPLANATIONS (Zero API Key Needed for Visitors) ============
const DEMO_EXPLANATIONS = {
    'python-loop': {
        explain: `### 📋 Summary
This Python script calculates the sum of all integers from 1 up to 10 (which equals **55**) using a \`for\` loop and prints the running total at each iteration.

---

### 🔍 How It Works Step-by-Step

1. **\`total = 0\`**: Initializes an accumulator variable named \`total\` starting at zero.
2. **\`for i in range(1, 11):\`**: Generates numbers from \`1\` to \`10\` (the second number in \`range\` is exclusive). In each pass, variable \`i\` takes the next number.
3. **\`total += i\`**: Adds the current value of \`i\` to \`total\` (\`total = total + i\`).
4. **\`print(f"Adding {i}, total is now {total}")\`**: Uses an f-string to display the step-by-step running total.
5. **\`print(f"The final sum is: {total}")\`**: After the loop concludes, prints the final result: **55**.

---

### 💡 Key Takeaways
- \`range(start, stop)\` stops *before* reaching \`stop\`.
- \`total += i\` is standard shorthand for accumulating values.`,

        eli5: `### 👶 ELI5: The Piggy Bank Story! 🐖💰

Imagine you have an empty piggy bank labeled **total**. Right now, there are **0 coins** in it.

1. **Day 1**: You drop in **1 coin**. Your bank has **1 coin**! 🪙
2. **Day 2**: You drop in **2 coins**. Now you have **3 coins**! 🪙🪙
3. **Day 3**: You drop in **3 coins**. Now you have **6 coins**! 🪙🪙🪙
4. You keep doing this every day until Day 10.
5. On Day 10, you open your bank: **55 shiny coins in total!** 🎉

The \`for\` loop is just a little robot helper that drops the coins in for you, counting 1 to 10 without breaking a sweat! 🤖✨`,

        'line-by-line': `### Line 2
\`\`\`python
total = 0
\`\`\`
**Explanation:** Creates a variable named \`total\` initialized to \`0\`. This will store the running sum.

---

### Line 3
\`\`\`python
for i in range(1, 11):
\`\`\`
**Explanation:** Starts a loop. \`range(1, 11)\` generates numbers \`1\` through \`10\`. Each number is assigned to \`i\` one by one.

---

### Line 4
\`\`\`python
    total += i
\`\`\`
**Explanation:** Adds the current value of \`i\` to \`total\`.

---

### Line 5
\`\`\`python
    print(f"Adding {i}, total is now {total}")
\`\`\`
**Explanation:** Outputs the progress for each loop step using Python's formatted f-string.

---

### Line 7
\`\`\`python
print(f"The final sum is: {total}")
\`\`\`
**Explanation:** Runs after the loop finishes and prints the final computed sum (\`55\`).`,

        concepts: `### 📦 Variables
- \`total\`: An integer variable storing the running sum and final answer.
- \`i\`: The loop counter variable updated on each pass.

---

### 🔄 Loops
- \`for ... in range(...)\`: An iterator loop that executes a block for each item in a sequence.

---

### ⚙️ Python Features
- **\`range(1, 11)\`**: Generates an arithmetic progression from 1 up to (but not including) 11.
- **f-strings (\`f"..."\`)**: String interpolation for embedding expressions inside text.
- **Augmented Assignment (\`+=\`)**: Adds a value and reassigns in one clean step.`
    },

    'js-fetch': {
        explain: `### 📋 Summary
This JavaScript code defines an asynchronous function \`getUser\` that requests user data from an external REST API, handles potential network or HTTP failures cleanly using a \`try...catch\` block, and logs the user's name to the console.

---

### 🔍 How It Works Step-by-Step

1. **\`async function getUser(userId)\`**: Declares an async function that naturally returns a Promise.
2. **\`try / catch\`**: Ensures the application does not crash if network requests fail.
3. **\`await fetch(...)\`**: Dispatches an HTTP GET request to \`https://api.example.com/users/\${userId}\` and pauses until headers return.
4. **\`if (!response.ok)\`**: Checks if the HTTP status code is outside the 200–299 range (e.g. 404 or 500) and throws an error if so.
5. **\`await response.json()\`**: Resolves the response stream into a JavaScript object.
6. **\`getUser(42)\`**: Calls the function with user ID 42.`,

        eli5: `### 👶 ELI5: Ordering Pizza by Phone! 🍕📞

1. **Making the call** (\`fetch\`): You dial the pizzeria to ask for customer #42's order.
2. **Staying on the line** (\`await\`): You hold the line while the cashier checks the computer.
3. **Checking the answer** (\`if (!response.ok)\`): Did the cashier find the order, or say "Sorry, no order exists"? If there is an issue, you complain!
4. **Getting the receipt** (\`response.json\`): The cashier reads out the details to you.
5. **The Safety Net** (\`catch\`): If the phone line cuts off, you don't panic — you catch the error and print a friendly message. 🛡️`,

        'line-by-line': `### Line 2
\`\`\`javascript
async function getUser(userId) {
\`\`\`
**Explanation:** Declares an asynchronous function accepting a \`userId\` parameter.

---

### Line 3
\`\`\`javascript
    try {
\`\`\`
**Explanation:** Starts an error-handling block to catch any network errors or thrown exceptions.

---

### Line 4
\`\`\`javascript
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
\`\`\`
**Explanation:** Sends an asynchronous HTTP GET request and waits for the remote server's response.

---

### Lines 6-8
\`\`\`javascript
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
\`\`\`
**Explanation:** Validates that the server returned a 2xx success status code before proceeding.

---

### Line 10
\`\`\`javascript
        const userData = await response.json();
\`\`\`
**Explanation:** Parses the incoming JSON response body into a JavaScript object.`,

        concepts: `### ⚡ Asynchronous Programming
- **\`async / await\`**: Modern syntax for handling asynchronous operations cleanly without callback hell.
- **\`fetch()\`**: The browser standard API for making HTTP requests.

---

### 🛡️ Error Handling
- **\`try / catch\`**: Protects against uncaught runtime rejections and network failures.
- **\`throw new Error()\`**: Triggers an error condition when an HTTP status is not successful.`
    },

    'error-msg': {
        error: `### 🔍 What the Error Means
**\`ZeroDivisionError: division by zero\`** means your code attempted to divide a number by **0**, which is mathematically undefined and strictly forbidden in Python.

---

### ❓ Why It Happened
Look closely at line 8:
\`\`\`python
return sum(numbers) / len(numbers)
\`\`\`
When \`calculate_average(numbers)\` was called, the \`numbers\` argument was an **empty list** (\`[]\`).
- \`sum([])\` evaluates to \`0\`
- \`len([])\` evaluates to \`0\`
- \`0 / 0\` triggers the **\`ZeroDivisionError\`**!

---

### ✅ How to Fix It
Add a guard condition before dividing to handle empty lists safely:

\`\`\`python
def calculate_average(numbers):
    if not numbers:
        return 0  # or return None / raise a custom friendly message
    return sum(numbers) / len(numbers)
\`\`\`

---

### 💡 Pro Tip
Whenever calculating an average, percentage, or ratio, always check that the divisor (denominator) is greater than zero! 🛡️`,

        explain: `### 📋 Error Breakdown
This traceback shows a runtime crash caused by **\`ZeroDivisionError\`** in \`calculate_average\`.

- **Crashing Code:** \`return sum(numbers) / len(numbers)\`
- **Cause:** An empty list was passed, making \`len(numbers)\` equal to \`0\`.

### 🛠️ Solution
\`\`\`python
def calculate_average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)
\`\`\``,

        eli5: `### 👶 ELI5: Sharing Cookies with Zero Friends! 🍪🚫

Imagine you have 10 cookies, and you want to share them fairly:
- If you have 2 friends: each gets 5 cookies. Easy!
- If you have **0 friends** standing there: How many cookies does each friend get?
It makes no sense because there is nobody to receive them!

In programming, dividing by zero is an impossible question, so Python stops and says **ZeroDivisionError**! 🚨`
    },

    'java-class': {
        explain: `### 📋 Summary
This Java code defines an Object-Oriented class named \`Student\` containing private instance fields for encapsulation, a parameterized constructor for object creation, a business method \`isHonorRoll()\`, and an overridden \`toString()\` method.

---

### 🔍 Key Components
1. **Encapsulation**: Private fields (\`name\`, \`age\`, \`gpa\`) guard internal state against unintended external modification.
2. **Constructor**: Initializes a new Student object with custom parameters.
3. **Logic Method**: \`isHonorRoll()\` evaluates whether \`gpa >= 3.5\`.
4. **\`@Override toString()\`**: Formats the object into a readable string when printed.`,

        eli5: `### 👶 ELI5: A Student ID Card Factory! 🪪🎒
Think of the \`Student\` class like a mold or template for creating student ID cards:
- It records each student's name, age, and grade score (GPA).
- If their score is 3.5 or higher, a gold star is stamped on: **Honor Roll!** ⭐
- \`toString()\` reads the card out loud in plain words!`,

        'line-by-line': `### Line 1
\`\`\`java
public class Student {
\`\`\`
**Explanation:** Defines a public class blueprint named \`Student\`.

---

### Lines 2-4
\`\`\`java
private String name;
private int age;
private double gpa;
\`\`\`
**Explanation:** Defines private fields storing each student's attributes.

---

### Lines 13-15
\`\`\`java
public boolean isHonorRoll() {
    return this.gpa >= 3.5;
}
\`\`\`
**Explanation:** An instance method that returns \`true\` if GPA is at least 3.5.`,

        concepts: `### 🏛️ Object-Oriented Programming (OOP)
- **Encapsulation**: Using \`private\` fields with controlled access methods.
- **Constructors**: Setting up object state on instantiation.
- **Method Overriding**: Customizing \`Object.toString()\` for structured display.`
    },

    'rust-enum': {
        explain: `### 📋 Summary
This Rust snippet defines an algebraic data type (\`enum WebEvent\`) with variants holding different types of payloads (unit, tuple, and struct-like), and uses exhaustive pattern matching (\`match\`) to handle every variant safely at compile time.

---

### 🔍 Key Components
1. **\`enum WebEvent\`**: Defines 3 distinct variants: \`PageLoad\`, \`KeyPress(char)\`, and \`Click { x, y }\`.
2. **\`match event\`**: Guarantees all variants are handled without runtime crashes.`,

        eli5: `### 👶 ELI5: A Universal Game Controller! 🎮🕹️
Imagine a toy controller with different actions:
- Pressing a button sends a character letter! 🔤
- Clicking the mouse sends coordinates on screen! 🖱️
- Loading the page tells the game to start! 🚀
The \`match\` block is like the game knowing exactly which action was pressed and reacting right away!`,

        'line-by-line': `### Lines 2-6
\`\`\`rust
enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
}
\`\`\`
**Explanation:** Declares an enum where each variant can store distinct types of data.

---

### Lines 8-15
\`\`\`rust
match event {
    WebEvent::PageLoad => println!("page loaded"),
    ...
}
\`\`\`
**Explanation:** Exhaustive pattern matching over all enum variants.`,

        concepts: `### 🦀 Rust Core Features
- **Algebraic Data Types (ADTs)**: Enums that can carry structured payloads.
- **Exhaustive Pattern Matching**: Compiler-enforced verification that all cases are handled.`
    }
};

/**
 * Matches input code against known demo snippets for instant explanation.
 */
function findDemoKey(code) {
    if (!code) return null;
    const c = code.trim();
    if (c.includes('range(1, 11)') || c.includes('total = 0') || c.includes('The final sum is')) return 'python-loop';
    if (c.includes('getUser') || c.includes('api.example.com') || c.includes('fetch(')) return 'js-fetch';
    if (c.includes('ZeroDivisionError') || c.includes('calculate_average')) return 'error-msg';
    if (c.includes('class Student') || c.includes('isHonorRoll')) return 'java-class';
    if (c.includes('enum WebEvent') || c.includes('PageLoad')) return 'rust-enum';
    return null;
}


// ============ INITIALIZATION ============
/**
 * Initializes the application.
 * Configures status UI, loads default example for instant testing,
 * and sets up all event listeners.
 */
function init() {
    // Bind all UI events to their listeners.
    setupEventListeners();

    // Initialize the character count display.
    updateCharCount();

    // If code input is empty on first load, pre-populate the Python loop example
    // so any visitor can test "Explain" immediately with zero setup!
    if (!elements.codeInput.value.trim()) {
        loadExample('python-loop');
    }

    // Update the API status pill in the header
    updateApiStatusUi();

    // Set the current year in the footer.
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/**
 * Attaches event listeners to all interactive DOM elements.
 */
function setupEventListeners() {
    setupModeListeners();
    setupActionListeners();
    setupInputListeners();
    setupModalListeners();
}

function setupModeListeners() {
    elements.modeTabs.forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    elements.exampleChips.forEach(chip => {
        chip.addEventListener('click', () => loadExample(chip.dataset.example));
    });
}

function setupActionListeners() {
    elements.btnExplain.addEventListener('click', handleExplain);

    elements.btnClear.addEventListener('click', () => {
        if (elements.codeInput.value.trim() !== '') {
            if (confirm('Are you sure you want to clear the code input?')) {
                elements.codeInput.value = '';
                updateCharCount();
                elements.codeInput.focus();
                showToast('🗑️ Input cleared');
            }
        } else {
            elements.codeInput.focus();
        }
    });

    elements.btnCopy.addEventListener('click', copyExplanation);

    if (elements.btnDownload) {
        elements.btnDownload.addEventListener('click', downloadExplanation);
    }

    if (elements.btnResetApi) {
        elements.btnResetApi.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset and delete your stored API key?')) {
                localStorage.removeItem('groq_api_key');
                apiKey = '';
                updateApiStatusUi();
                showApiKeyModal();
                showToast('🔑 API key reset');
            }
        });
    }
}

function setupInputListeners() {
    elements.codeInput.addEventListener('input', updateCharCount);

    elements.codeInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleExplain();
        }
        // Alt + C keyboard shortcut to clear the code input
        if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            elements.btnClear.click();
        }
    });
}

function setupModalListeners() {
    if (elements.btnSaveKey) {
        elements.btnSaveKey.addEventListener('click', saveApiKey);
    }
    if (elements.apiKeyInput) {
        elements.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveApiKey();
        });
    }
    if (elements.btnCloseModal) {
        elements.btnCloseModal.addEventListener('click', closeApiKeyModal);
    }
    if (elements.btnTryDemo) {
        elements.btnTryDemo.addEventListener('click', () => {
            closeApiKeyModal();
            showToast('⚡ In Demo Mode: Click any example chip below to test!');
        });
    }
    if (elements.btnStatus) {
        elements.btnStatus.addEventListener('click', showApiKeyModal);
    }
    if (elements.apiKeyModal) {
        elements.apiKeyModal.addEventListener('click', (e) => {
            if (e.target === elements.apiKeyModal) {
                closeApiKeyModal();
            }
        });
    }
}


// ============ MODE SWITCHING ============
/**
 * Switches the active explanation mode.
 * 
 * @param {string} mode - The mode identifier to switch to.
 */
function switchMode(mode) {
    currentMode = mode;

    // Update active tab
    elements.modeTabs.forEach(tab => {
        const isActive = tab.dataset.mode === mode;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update UI text
    const config = modeConfigs[mode];
    if (config) {
        elements.inputTitle.textContent = config.title;
        elements.modeDescText.textContent = config.description;
    }

    // If switching to error mode, update placeholder
    if (mode === 'error') {
        elements.codeInput.placeholder = '// Paste your error message here...\n// You can also include the code that caused the error\n\nTraceback (most recent call last):\n  File "app.py", line 5\n    print("Hello")\nSyntaxError: unexpected EOF';
    } else {
        elements.codeInput.placeholder = '// Paste your code here...\n// Supports Python, JavaScript, Java, C++, and more!\n\nfunction greet(name) {\n  return \'Hello, \' + name + \'!\';\n}';
    }
}

// ============ EXAMPLE LOADING ============
/**
 * Loads a predefined code example into the input area.
 * 
 * @param {string} exampleKey - The key identifying the example to load.
 */
function loadExample(exampleKey) {
    const example = examples[exampleKey];
    if (!example) return;

    // Switch to error mode if loading error example
    if (exampleKey === 'error-msg') {
        switchMode('error');
    } else if (currentMode === 'error') {
        switchMode('explain');
    }

    elements.codeInput.value = example.code;

    // Set language
    if (example.lang !== 'auto') {
        elements.languageSelect.value = example.lang;
    } else {
        elements.languageSelect.value = 'auto';
    }

    updateCharCount();

    // Visual feedback
    elements.codeInput.focus();
    showToast('✨ Example loaded! Click Explain to see the breakdown');
}

// ============ MAIN EXPLAIN HANDLER ============
/**
 * Main handler for the "Explain" button click.
 * Handles both Live Groq AI requests and zero-friction Demo Mode.
 */
function getCacheKey(code, mode, lang) {
    const str = `${mode}_${lang}_${code}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return 'cache_' + hash;
}

async function handleExplain() {
    const code = elements.codeInput.value.trim();

    if (!code) {
        showToast('⚠️ Please paste some code first!');
        elements.codeInput.focus();
        return;
    }

    // Get language
    let lang = elements.languageSelect.value;
    if (lang === 'auto') lang = 'the detected programming language';

    const config = modeConfigs[currentMode];
    elements.outputTitle.textContent = config.outputTitle;

    // Check if there is an instant Demo Mode explanation for this snippet
    const demoKey = findDemoKey(code);

    // CASE 1: No API key provided, but user is testing a sample or known demo
    if (!apiKey) {
        if (demoKey && DEMO_EXPLANATIONS[demoKey]) {
            const demoModeKey = DEMO_EXPLANATIONS[demoKey][currentMode] ? currentMode : 'explain';
            const demoText = DEMO_EXPLANATIONS[demoKey][demoModeKey];
            
            if (demoText) {
                setLoading(true);
                showOutput('');
                setTimeout(() => {
                    setLoading(false);
                    const demoBanner = `> ⚡ **Demo Mode Active**: You are viewing an instant pre-computed breakdown. To analyze your own custom code with live Groq Llama 3.3 70B, <a href="javascript:void(0)" onclick="showApiKeyModal()">click here to enter a free Groq API key</a>.\n\n`;
                    renderOutput(demoBanner + demoText);
                    showToast('⚡ Instant explanation ready!');
                }, 500);
                return;
            }
        }

        // Custom code pasted without an API key -> Prompt user with friendly modal
        showApiKeyModal();
        showToast('💡 Enter your free Groq API key for custom code, or pick any sample chip above for Demo Mode!');
        return;
    }

    // CASE 2: User has entered a Groq API Key -> Call Live AI
    const cacheKey = getCacheKey(code, currentMode, lang);
    let cache = {};
    try {
        cache = JSON.parse(localStorage.getItem('explain_my_code_cache') || '{}');
    } catch (e) {
        console.error('Failed to parse cache:', e);
    }

    if (cache[cacheKey]) {
        showToast('⚡ Loaded from cache!');
        renderOutput(cache[cacheKey]);
        return;
    }

    // Build prompt
    const prompt = config.prompt(code, lang);

    // UI loading state
    setLoading(true);
    showOutput('');

    try {
        const response = await callGroqAPI(prompt);
        const explanation = response;

        // Save to cache
        try {
            cache[cacheKey] = explanation;
            const keys = Object.keys(cache);
            if (keys.length > 25) {
                delete cache[keys[0]];
            }
            localStorage.setItem('explain_my_code_cache', JSON.stringify(cache));
        } catch (e) {
            console.error('Failed to save to cache:', e);
        }

        // Render the output with markdown
        renderOutput(explanation);
        showToast('✅ Explanation ready!');
    } catch (error) {
        console.error('API Error:', error);

        let errorMsg = '## ❌ Oops! Something went wrong\n\n';
        if (error.message.includes('Invalid API') || error.message.includes('invalid_api_key') || error.message.includes('401')) {
            errorMsg += 'Your API key seems invalid. Please check it and try again.\n\n';
            errorMsg += '**Get a free key from:** [console.groq.com/keys](https://console.groq.com/keys)';
            localStorage.removeItem('groq_api_key');
            apiKey = '';
            updateApiStatusUi();
        } else if (error.message.includes('rate') || error.message.includes('429')) {
            errorMsg += '⏳ You\'ve hit the API rate limit. Please wait 30-60 seconds and try again.\n\n';
            errorMsg += 'Groq free tier allows ~30 requests per minute.';
        } else {
            errorMsg += `**Error:** ${error.message}\n\n`;
            errorMsg += 'Please check your internet connection and try again.';
        }
        renderOutput(errorMsg);
        showToast('❌ Failed to get explanation');
    } finally {
        setLoading(false);
    }
}

// ============ GROQ API CALL ============
/**
 * Makes an asynchronous POST request to the Groq API.
 * 
 * @param {string} prompt - The formatted prompt string to send to the AI model.
 * @returns {Promise<string>}
 */
async function callGroqAPI(prompt) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful coding teacher who explains code in a clear, beginner-friendly way. Always use markdown formatting in your responses.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4096,
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;

        if (response.status === 401) {
            throw new Error('Invalid API key (401)');
        }
        if (response.status === 429) {
            throw new Error('Rate limit exceeded (429)');
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
        throw new Error('No response generated. Please try again.');
    }

    return text;
}

// ============ RENDERING ============
/**
 * Parses and renders Markdown text into HTML with syntax highlighting.
 * 
 * @param {string} markdownText - The raw markdown text from the AI response.
 */
function renderOutput(markdownText) {
    elements.outputSection.style.display = 'block';

    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true,
    });

    const html = marked.parse(markdownText);
    elements.outputContent.innerHTML = html;

    elements.outputContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    elements.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showOutput(content) {
    elements.outputSection.style.display = 'block';
    elements.outputContent.innerHTML = content || '<p style="color: var(--text-muted); text-align: center;"><span class="spinner"></span> Thinking... this may take a few seconds</p>';
}

// ============ UI HELPERS ============
function setLoading(loading) {
    isLoading = loading;
    const btnText = elements.btnExplain.querySelector('.btn-text');
    const btnLoading = elements.btnExplain.querySelector('.btn-loading');

    elements.btnExplain.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'inline-flex' : 'none';
}

function updateCharCount() {
    const text = elements.codeInput.value.trim();
    const length = elements.codeInput.value.length;
    elements.charCount.textContent = length;
    
    if (length > 5000) {
        elements.charCount.classList.add('exceeded');
        elements.charCount.textContent = length + ' (Exceeds recommended limit!)';
    } else {
        elements.charCount.classList.remove('exceeded');
    }
    
    const words = text ? text.split(/\s+/).length : 0;
    if (elements.wordCount) {
        elements.wordCount.textContent = words;
    }
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateApiStatusUi() {
    if (!elements.btnStatus || !elements.statusText) return;
    if (apiKey) {
        elements.btnStatus.classList.add('connected');
        elements.statusText.textContent = '✅ Groq AI Active (Llama 3.3)';
        elements.btnStatus.title = 'Click to manage your Groq API key';
    } else {
        elements.btnStatus.classList.remove('connected');
        elements.statusText.textContent = '⚡ Instant Demo Mode (Click for Custom Groq AI)';
        elements.btnStatus.title = 'Click to add a free Groq API key for custom code';
    }
}

// ============ API KEY MANAGEMENT ============
function showApiKeyModal() {
    elements.apiKeyModal.style.display = 'flex';
    if (apiKey) {
        elements.apiKeyInput.value = apiKey;
    }
    setTimeout(() => elements.apiKeyInput.focus(), 100);
}

function closeApiKeyModal() {
    elements.apiKeyModal.style.display = 'none';
}

function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();

    if (!key) {
        showToast('⚠️ Please enter your API key');
        return;
    }

    apiKey = key;
    localStorage.setItem('groq_api_key', key);
    closeApiKeyModal();
    updateApiStatusUi();
    showToast('🔑 API key saved! Live AI activated');

    // If code is present, automatically trigger explanation
    if (elements.codeInput.value.trim()) {
        handleExplain();
    }
}

// ============ COPY & DOWNLOAD FUNCTIONALITY ============
function copyExplanation() {
    const text = elements.outputContent.innerText;

    const setCopySuccess = () => {
        showToast('📋 Explanation copied!');
        const originalContent = elements.btnCopy.textContent;
        elements.btnCopy.textContent = '✅';
        setTimeout(() => {
            elements.btnCopy.textContent = originalContent;
        }, 2000);
    };

    navigator.clipboard.writeText(text).then(setCopySuccess).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        setCopySuccess();
    });
}

function downloadExplanation() {
    const text = elements.outputContent.innerText;
    if (!text) {
        showToast('⚠️ Nothing to download!');
        return;
    }

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `explanation-${currentMode}-${dateStr}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('📥 Download started!');
}

// ============ START APP ============
init();
