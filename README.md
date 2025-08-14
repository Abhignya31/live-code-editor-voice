# 🖥️ Multi-Language Live Code Editor with Voice Assistant  

A powerful **multi-language** online code editor with **voice-controlled programming**, real-time output preview for web code, and auto-formatted coding experience.  

---

## ✨ Features  
- 🌍 **Supports multiple languages**: Python, Java, C, C++, HTML, CSS, JavaScript  
- 📜 **Live HTML/CSS/JS Preview** — Instant updates without refreshing  
- 🗂 **Live Script Overview** — See the structure of your code at a glance  
- 🎙 **Voice Assistant** — Create, edit, run code with voice commands  
- 🔍 **"Scan x" Command** — Automatically writes code to scan and print `x` in the current language  
- 🎨 **Enhanced Code Editor** — Syntax highlighting, auto-indent, code formatting  
- ⚡ **Run & Output** — Immediate execution results inside the editor  

---

## 🛠 Tech Stack  
- **Node.js + Express** — Backend server  
- **CodeMirror / Monaco Editor** — Rich text code editor  
- **Web Speech API** — Voice recognition & speech synthesis  
- **HTML, CSS, JS** — Frontend  
- **Bootstrap / Tailwind** — UI styling  

---

## 🚀 How to Run Locally  

```bash
# 1. Clone the repository
git clone https://github.com/your-username/multilang-voice-code-editor.git

# 2. Open the folder
cd multilang-voice-code-editor

# 3. Install dependencies
npm install

# 4. Start the server
node server.js

# 5. Open in browser
http://localhost:3000
```

---

## 📂 Project Structure
```text
multilang-voice-code-editor/
│
├── server.js               # Node.js backend server
├── package.json            # Project dependencies
├── public/                 # Static files
│   ├── index.html          # Main UI
│   ├── style.css           # Styles
│   ├── script.js           # Voice assistant & editor logic
│   ├── editor.js           # CodeMirror/Monaco setup
│   └── runHandlers.js      # Run code per language
└── README.md               # Documentation
```

---

## 🎯 Voice Commands
Command	Action
- "Start voice"	- Activates the assistant
- "Write function hello"	- Inserts a sample function
- "Run code" -	Executes code in editor
- "Scan x" -	Writes code to scan and print x in current language
- "Clear editor"	- Removes all text
- "Read my code"	- Reads editor content aloud

---

## 🔮 Future Improvements
- 🤖 AI-based code completion & debugging
- ☁ Cloud save for projects
- 📂 Multi-file project support
- 🌐 Deploy to web hosting platforms
