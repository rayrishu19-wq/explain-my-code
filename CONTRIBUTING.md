# 🤝 Contributing to Explain My Code

Thank you for your interest in contributing to **Explain My Code**! We welcome all contributions — from bug fixes and new features to documentation improvements.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [How to Contribute](#-how-to-contribute)
- [Issue Guidelines](#-issue-guidelines)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Coding Standards](#-coding-standards)
- [Development Workflow](#-development-workflow)
- [Code of Conduct](#-code-of-conduct)

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/explain-my-code.git
   cd explain-my-code
   ```
3. **Get a free Groq API key** from [console.groq.com/keys](https://console.groq.com/keys)
4. **Open `index.html`** in your browser to test locally

## 💡 How to Contribute

### Reporting Bugs
- Use the **Bug Report** issue template
- Include clear reproduction steps
- Provide browser and OS details
- Add screenshots if possible

### Suggesting Features
- Use the **Feature Request** issue template
- Explain the problem the feature would solve
- Describe your proposed solution
- Consider UI/UX implications

### Submitting Code Changes
1. Create a new branch from `main`
2. Make your changes
3. Test thoroughly in multiple browsers
4. Submit a pull request using the PR template

## 📌 Issue Guidelines

### Before Opening an Issue
- **Search existing issues** to avoid duplicates
- **Check if the bug is reproducible** on the latest version
- **Use the provided templates** — they help us understand and address your issue faster

### Writing Good Issues
- Use a **clear, descriptive title** prefixed with `[BUG]` or `[FEATURE]`
- Provide **all requested information** from the template
- Include **minimal reproduction steps** for bugs
- Add **labels** if you have access

## 🔀 Pull Request Guidelines

### Before Submitting a PR
- **Open an issue first** to discuss the change (for non-trivial changes)
- **Create a feature branch** — never commit directly to `main`
- **Keep PRs focused** — one feature/fix per PR

### Branch Naming Convention
```
feature/description    → New features
fix/description        → Bug fixes
docs/description       → Documentation updates
style/description      → UI/styling changes
refactor/description   → Code refactoring
chore/description      → Build/config updates
```

### PR Requirements
- [ ] Fill out the **PR template** completely
- [ ] Reference the related issue using `Closes #issue_number`
- [ ] Ensure no **console errors** in the browser
- [ ] Test all **5 explanation modes**
- [ ] Verify **responsive design** on mobile viewport
- [ ] Add **screenshots** for UI changes

### 💡 Local Testing Tips
- **Simulate Clean Install:** To test the API key modal prompt, use the "Reset API Key" link in the footer or clear local storage by running `localStorage.clear()` in the browser developer console.
- **Responsive Testing:** Use the browser's responsive design mode (F12) to verify UI scaling down to mobile viewports (e.g., iPhone SE at 375px).
- **Checking API Responses:** Inspect the browser Console and Network tabs if you encounter issues calling the Groq endpoint.

### Commit Message Format
Use [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add dark/light theme toggle
fix: resolve API key modal not closing
docs: update README with new mode descriptions
style: improve mobile responsiveness
refactor: extract API call logic into separate module
chore: update highlight.js version
```

### ⚛️ Atomic Commits
Try to keep your commits **atomic** (one small, focused change per commit). This makes it easier to review and track the history of the project.

## 🎨 Coding Standards

### HTML
- Use **semantic HTML5** elements
- Include **ARIA labels** for accessibility
- Add **unique IDs** to interactive elements

### CSS
- Use **CSS custom properties** (variables) for theming
- Follow the existing **dark theme + glassmorphism** design system
- Ensure **mobile responsiveness** (test at 375px width)
- Use **smooth transitions** and **animations** sparingly

### JavaScript
- Use **vanilla JavaScript** — no frameworks or libraries (except highlight.js and marked.js)
- Use `const` and `let` — never `var`
- Add **JSDoc comments** for functions
- Handle **errors gracefully** with user-friendly messages
- Store user data in **localStorage** only (never send to external servers except Groq API)

## 🔧 Development Workflow

1. **Fork & Clone** the repository
2. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test locally
4. **Commit with a descriptive message:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** against the `main` branch

## 📜 Code of Conduct

- Be **respectful** and **inclusive** in all interactions
- Provide **constructive feedback** on issues and PRs
- Help **newcomers** feel welcome — this project is beginner-friendly!
- Focus on the **code and ideas**, not the person

---

Thank you for contributing! Every improvement makes **Explain My Code** better for everyone 🎉
