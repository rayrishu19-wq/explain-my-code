/* ========================================
   EXPLAIN MY CODE — App Logic
   Groq API Integration (Free & Fast!)
   ======================================== */

// ============ CONFIG ============
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ============ DOM ELEMENTS ============
const elements = {
    codeInput: document.getElementById('code-input'),
    btnExplain: document.getElementById('btn-explain'),
    btnClear: document.getElementById('btn-clear'),
    btnCopy: document.getElementById('btn-copy'),
    outputSection: document.getElementById('output-section'),
    outputContent: document.getElementById('output-content'),
    outputTitle: document.getElementById('output-title'),
    charCount: document.getElementById('char-count'),
    languageSelect: document.getElementById('language-select'),
    inputTitle: document.getElementById('input-title'),
    modeDescText: document.getElementById('mode-desc-text'),

    // Modal
    apiKeyModal: document.getElementById('api-key-modal'),
    apiKeyInput: document.getElementById('api-key-input'),
    btnSaveKey: document.getElementById('btn-save-key'),

    // Tabs
    modeTabs: document.querySelectorAll('.mode-tab'),
    exampleChips: document.querySelectorAll('.example-chip'),
};

// ============ STATE ============
let currentMode = 'explain';
let isLoading = false;
let apiKey = localStorage.getItem('groq_api_key') || '';

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
    'error-msg': {
        code: `Traceback (most recent call last):
  File "app.py", line 15, in <module>
    result = calculate_average(numbers)
  File "app.py", line 8, in calculate_average
    return sum(numbers) / len(numbers)
ZeroDivisionError: division by zero`,
        lang: 'auto'
    }
};

// ============ INITIALIZATION ============
function init() {
    // Check for API key
    if (!apiKey) {
        showApiKeyModal();
    }

    // Event listeners
    setupEventListeners();

    // Initial char count
    updateCharCount();
}

function setupEventListeners() {
    // Mode tabs
    elements.modeTabs.forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    // Explain button
    elements.btnExplain.addEventListener('click', handleExplain);

    // Clear button
    elements.btnClear.addEventListener('click', () => {
        elements.codeInput.value = '';
        updateCharCount();
        elements.codeInput.focus();
    });

    // Copy button
    elements.btnCopy.addEventListener('click', copyExplanation);

    // Character count
    elements.codeInput.addEventListener('input', updateCharCount);

    // Example chips
    elements.exampleChips.forEach(chip => {
        chip.addEventListener('click', () => loadExample(chip.dataset.example));
    });

    // API key modal
    elements.btnSaveKey.addEventListener('click', saveApiKey);
    elements.apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveApiKey();
    });

    // Keyboard shortcut: Ctrl+Enter to explain
    elements.codeInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleExplain();
        }
    });
}

// ============ MODE SWITCHING ============
function switchMode(mode) {
    currentMode = mode;

    // Update active tab
    elements.modeTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // Update UI text
    const config = modeConfigs[mode];
    elements.inputTitle.textContent = config.title;
    elements.modeDescText.textContent = config.description;

    // If switching to error mode, update placeholder
    if (mode === 'error') {
        elements.codeInput.placeholder = '// Paste your error message here...\n// You can also include the code that caused the error\n\nTraceback (most recent call last):\n  File "app.py", line 5\n    print("Hello")\nSyntaxError: unexpected EOF';
    } else {
        elements.codeInput.placeholder = '// Paste your code here...\n// Supports Python, JavaScript, Java, C++, and more!\n\nfunction greet(name) {\n  return \'Hello, \' + name + \'!\';\n}';
    }
}

// ============ EXAMPLE LOADING ============
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
    showToast('✨ Example loaded! Click Explain to see the magic');
}

// ============ MAIN EXPLAIN HANDLER ============
async function handleExplain() {
    const code = elements.codeInput.value.trim();

    if (!code) {
        showToast('⚠️ Please paste some code first!');
        elements.codeInput.focus();
        return;
    }

    if (!apiKey) {
        showApiKeyModal();
        return;
    }

    // Get language
    let lang = elements.languageSelect.value;
    if (lang === 'auto') lang = 'the detected programming language';

    // Build prompt
    const config = modeConfigs[currentMode];
    const prompt = config.prompt(code, lang);

    // UI loading state
    setLoading(true);
    showOutput('');
    elements.outputTitle.textContent = config.outputTitle;

    try {
        const response = await callGroqAPI(prompt);
        const explanation = response;

        // Render the output with markdown
        renderOutput(explanation);
        showToast('✅ Explanation ready!');
    } catch (error) {
        console.error('API Error:', error);

        let errorMsg = '## ❌ Oops! Something went wrong\n\n';
        if (error.message.includes('Invalid API') || error.message.includes('invalid_api_key') || error.message.includes('401')) {
            errorMsg += 'Your API key seems invalid. Please check it and try again.\n\n';
            errorMsg += '**Get a free key from:** [console.groq.com/keys](https://console.groq.com/keys)';
            // Reset key
            localStorage.removeItem('groq_api_key');
            apiKey = '';
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

    // Extract text from Groq response (OpenAI-compatible format)
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
        throw new Error('No response generated. Please try again.');
    }

    return text;
}

// ============ RENDERING ============
function renderOutput(markdownText) {
    elements.outputSection.style.display = 'block';

    // Configure marked for safe rendering
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

    // Render markdown to HTML
    const html = marked.parse(markdownText);
    elements.outputContent.innerHTML = html;

    // Highlight any code blocks
    elements.outputContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // Smooth scroll to output
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
    elements.charCount.textContent = elements.codeInput.value.length;
}

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ API KEY MANAGEMENT ============
function showApiKeyModal() {
    elements.apiKeyModal.style.display = 'flex';
    setTimeout(() => elements.apiKeyInput.focus(), 100);
}

function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();

    if (!key) {
        showToast('⚠️ Please enter your API key');
        return;
    }

    apiKey = key;
    localStorage.setItem('groq_api_key', key);
    elements.apiKeyModal.style.display = 'none';
    showToast('🔑 API key saved! You\'re ready to go');
}

// ============ COPY FUNCTIONALITY ============
function copyExplanation() {
    const text = elements.outputContent.innerText;

    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Explanation copied!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('📋 Explanation copied!');
    });
}

// ============ START APP ============
init();
