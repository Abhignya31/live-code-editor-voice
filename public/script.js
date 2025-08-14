const codeArea = document.getElementById("codeArea");
const suggestionDiv = document.getElementById("suggestion");
const outputDiv = document.getElementById("output");
const languageSelect = document.getElementById("language");
const previewBox = document.getElementById("livePreview");

// 🆕 Clear editor on language change
languageSelect.addEventListener("change", () => {
    codeArea.value = "";
    suggestionDiv.textContent = "💡 AI Suggestion:";
    outputDiv.textContent = "";
    previewBox.style.display = "none";
});

// 🆕 Tab indentation + auto indent after Python keywords
codeArea.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
    if (e.key === "Enter") {
        const start = this.selectionStart;
        const currentLine = this.value.substring(0, start).split("\n").pop();
        const indentMatch = currentLine.match(/^\s+/);
        let indent = indentMatch ? indentMatch[0] : "";
        if (/:\s*$/.test(currentLine)) {
            indent += "    "; // Auto indent after Python colon
        }
        setTimeout(() => {
            const pos = this.selectionStart;
            this.value = this.value.substring(0, pos) + indent + this.value.substring(pos);
            this.selectionStart = this.selectionEnd = pos + indent.length;
        }, 0);
    }
});

function processMultipleCommands(spokenText, language) {
    let commands = spokenText.split(/\band\b|\n|;/);
    let result = "";
    commands.forEach(cmd => {
        let formatted = formatCodeFromVoice(cmd.trim(), language);
        result += formatted + "\n";
    });
    return result;
}

function formatCodeFromVoice(text, language) {
    text = text.toLowerCase().trim();

    // PRINT
    if (text.startsWith("print")) {
        let content = text.replace("print", "").trim();
        // 🆕 Remove trailing punctuation
        content = content.replace(/[.,!?]$/g, "");
        if (language === "c") return `#include <stdio.h>\n\nint main() {\n    printf("${content}\\n");\n    return 0;\n}`;
        if (language === "cpp") return `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "${content}" << endl;\n    return 0;\n}`;
        if (language === "python") return `print("${content}")`;
        if (language === "java") return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("${content}");\n    }\n}`;
        if (language === "javascript") return `console.log("${content}");`;
    }

    // SCAN
    if (text.startsWith("scan")) {
        let name = text.split(" ")[1] || "x";
        // 🆕 Remove punctuation from variable name
        name = name.replace(/[^a-zA-Z0-9_]/g, "");
        if (language === "c") return `#include <stdio.h>\n\nint main() {\n    int ${name};\n    scanf("%d", &${name});\n    printf("%d", ${name});\n    return 0;\n}`;
        if (language === "cpp") return `#include <iostream>\nusing namespace std;\n\nint main() {\n    int ${name};\n    cin >> ${name};\n    cout << ${name} << endl;\n    return 0;\n}`;
        if (language === "python") return `${name} = input()\nprint(${name})`;
        if (language === "java") return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int ${name} = sc.nextInt();\n        System.out.println(${name});\n    }\n}`;
        if (language === "javascript") return `let ${name} = prompt("Enter value:");\nconsole.log(${name});`;
    }

    return text;
}

function startVoiceAssistant() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("❌ Speech Recognition not supported. Use Chrome.");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.start();
    suggestionDiv.textContent = "🎙 Listening...";
    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        suggestionDiv.textContent = "💡 AI Suggestion: " + spokenText;
        const finalCode = processMultipleCommands(spokenText, languageSelect.value);
        codeArea.value += "\n" + finalCode;
    };
    recognition.onerror = (err) => {
        suggestionDiv.textContent = "❌ Voice Error: " + err.error;
    };
    recognition.onend = () => {
        suggestionDiv.textContent += " ✅ Finished listening";
    };
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

async function runCode() {
    const code = codeArea.value;
    const language = languageSelect.value;
    let input = document.getElementById("userInput").value;

    if (!input && (code.includes("scanf") || code.includes("cin >>") || code.includes("input(") || code.includes("Scanner"))) {
        input = prompt("Please enter runtime input:");
    }

    if (language === "html") {
        previewBox.style.display = "block";
        const previewDoc = previewBox.contentDocument || previewBox.contentWindow.document;
        previewDoc.open();
        previewDoc.write(code);
        previewDoc.close();
        outputDiv.textContent = "✅ Live Preview updated.";
        return;
    } else {
        previewBox.style.display = "none";
    }

    const response = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
    });

    const result = await response.json();
    outputDiv.textContent = result.output;
    speakText(result.output);
}
