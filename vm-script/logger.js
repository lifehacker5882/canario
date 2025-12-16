const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // <-- NYT

const app = express();

// Konfigurer CORS
const corsOptions = {
    // Tillat spesifikke Origin-adresser (Dette er tryggere enn '*')
    // Bruk de faktiske IP-ene og portene til dine frontend-tjenester (Eminem/Adele)
    origin: ["http://10.196.242.39:8080", "http://10.196.242.39:8081"], 
    methods: "GET,HEAD,POST", // Tillat POST og OPTIONS/HEAD metoder
    credentials: true,
};

app.use(cors(corsOptions)); // <-- NYT: Bruk CORS-middleware

app.use(express.json());

const logFile = path.join(process.cwd(), "feature_log.json");

// Håndtering av OPTIONS-forespørsler skjer nå automatisk via `cors`

app.post("/logFeature", (req, res) => {
    const data = req.body;
    fs.appendFileSync(logFile, JSON.stringify(data) + "\n");
    res.status(200).send({ ok: true });
});

app.listen(5000, () => console.log("Logger running on port 5000"));
