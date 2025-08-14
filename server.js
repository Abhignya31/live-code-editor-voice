const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// JDoodle API credentials
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

app.post("/run", async (req, res) => {
    const { code, language, input } = req.body;

    let langMap = {
        python: "python3",
        java: "java",
        cpp: "cpp17",
        c: "c",
        javascript: "nodejs",
        html: null
    };

    if (!langMap[language]) {
        return res.json({ output: "❌ Language not supported for JDoodle execution." });
    }

    const program = {
        script: code,
        language: langMap[language],
        versionIndex: "0",
        stdin: input || "",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET
    };

    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(program)
        });

        const data = await response.json();
        res.json({ output: data.output || data.error });
    } catch (error) {
        res.json({ output: "❌ Error: " + error.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
