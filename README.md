# 🧠 Explain My Code — AI Code Explainer

An AI-powered web app that explains code in beginner-friendly language. Just paste your code, pick a mode, and get instant explanations!

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-rayrishu19--wq.github.io%2Fexplain--my--code-06d6a0?style=for-the-badge&logo=googlechrome&logoColor=white)](https://rayrishu19-wq.github.io/explain-my-code/)

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Groq](https://img.shields.io/badge/Powered_by-Groq_AI-orange)

> 🚀 **Direct Live Access**: You can test the app immediately online at [**rayrishu19-wq.github.io/explain-my-code**](https://rayrishu19-wq.github.io/explain-my-code/).
> - **Demo Mode**: Test all sample snippets (Python Loop, JS Fetch, Java Class, Rust Enum, Python Error, etc.) across all 5 modes with zero API key needed.
> - **Live AI Mode**: Enter a free Groq API key from [console.groq.com/keys](https://console.groq.com/keys) to analyze your own custom code in real time with Llama 3.3 70B!

## ✨ Features

| Mode | Description |
|------|-------------|
| 💡 **Explain** | Clear, beginner-friendly code explanation |
| 👶 **ELI5** | Explain Like I'm 5 — super simple with fun analogies |
| 📝 **Line-by-Line** | Every single line explained individually |
| 🔑 **Key Concepts** | Highlights loops, functions, variables, conditionals |
| ❌ **Error Mode** | Paste an error → get what went wrong & how to fix it |
| 🎧 **Vibe Coding** | Optimized for the modern "Builder" workflow |

## 🚀 Quick Start (Local)

1. **Clone the repo**
   ```bash
   git clone https://github.com/rayrishu19-wq/explain-my-code.git
   cd explain-my-code
   ```

2. **Open `index.html`** in your browser (just double-click it!)

3. **Explore immediately** using built-in Demo Mode, or paste your free Groq API key from [console.groq.com/keys](https://console.groq.com/keys) for custom code! 🎉

## 🎨 Design

- 🌙 **Dark theme** with glassmorphism effects
- ✨ **Animated background** with floating gradient orbs
- 🎯 **Neon accent colors** (cyan, purple, green)
- 📱 **Fully responsive** — works on mobile
- ⌨️ **Keyboard shortcuts** — `Ctrl+Enter` to explain, `Alt+C` to clear code input

## 💡 Pro Tips

- **Auto-detect:** Most of the time, leaving it on "Auto-detect" works great!
- **Error Mode:** When pasting errors, include a bit of the surrounding code for even better advice.
- **Copy:** Click the 📋 icon on the top right of the explanation to copy it instantly.
- **Download:** Click the 📥 icon on the top right of the explanation to download it as a Markdown (`.md`) file.

## 🛠️ Tech Stack

- **HTML5** — Structure
- **Vanilla CSS** — Dark theme, glassmorphism, animations
- **Vanilla JavaScript** — No frameworks, pure JS
- **Groq API** — Llama 3.3 70B model (free tier)
- **Highlight.js** — Syntax highlighting
- **Marked.js** — Markdown rendering

## 📁 Project Structure

```
explain-my-code/
├── index.html    ← Main page
├── style.css     ← All styling
├── app.js        ← Core logic & API integration
└── README.md     ← This file
```

## 🔑 API Key

The app uses **Groq API** (free tier). Your API key is stored locally in your browser's localStorage — it never leaves your device.

### ⚡ Why Groq?
- **Speed:** Near-instant responses (sub-second generation).
- **Cost:** Free tier allows generous usage without credits.
- **Privacy:** Key stays in your browser.


## 📸 Supported Languages

Python • JavaScript • Java • C++ • C • C# • HTML • CSS • SQL • PHP • Ruby • Go • Rust • TypeScript • Swift • Kotlin • Bash • Dart • R • Haskell

## 🔍 Troubleshooting

- **Invalid API Key (401):** Double-check that your API key is correct. You can reset it using the "Reset API Key" link in the footer.
- **Rate Limit Exceeded (429):** The free tier of Groq has limits. If you hit this, wait 30-60 seconds before trying again.
- **Local Storage Access:** The app stores your API key locally in your browser. Ensure your browser allows local storage/cookies for local files.

## 📝 License

MIT License — feel free to use, modify, and share!

## 🤝 Contributing

Pull requests are welcome! Feel free to open an issue or submit a PR.

---

Built with ❤️ | Powered by **Groq AI (Llama 3.3)**
