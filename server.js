// const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const axios = require("axios");

// admin.initializeApp({
//     credential: admin.credential.cert(require("./sge-parashstone-firebase-adminsdk-fbsvc-a3b75c3f70.json"))
// });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Allow all origins
app.use(cors());

// Handle preflight requests
// app.options('*', cors());
app.get("/", (req, res) => {
    res.json({
        message: "Bin Data Server is running on Render",
        status: "active",
        timestamp: new Date().toISOString(),
        endpoints: [
            "POST /sendBinData",
            "GET /sendBinData",
            "GET /health",
            "GET /test"
        ]
    });
});
// Your endpoint
app.post("/sendBinData", async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.ip ||
            req.connection.remoteAddress ||
            null;

        await axios.post('https://asia-south1-sge-parashstone.cloudfunctions.net/sendBinData/BIN123', JSON.stringify({
            id: req.params,
            query: req.query,
            body: req.body || {},
            ip: ip,
            type: "POST",
            ts: Date.now()
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Store data in Firestore
        // await admin.firestore().collection("BinData").add({
        //     id: req.params,
        //     query: req.query,
        //     body: req.body || {},
        //     ip: ip,
        //     ts: Date.now()
        // });

        return res.status(200).send({
            success: true,
            relay: 1,
            message: "Data stored successfully"
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `${err}`
        });
    }
});

// GET endpoint for testing (optional)
app.get("/sendBinData", async (req, res) => {
    try {
        console.log("Received GET request with query:", req.query);

        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.ip ||
            req.connection.remoteAddress ||
            null;

        await axios.post('https://asia-south1-sge-parashstone.cloudfunctions.net/sendBinData/BIN123', JSON.stringify({
            id: req.params,
            query: req.query,
            body: req.body || {},
            ip: ip,
            type: "POST",
            ts: Date.now()
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).send({
            success: true,
            relay: 1,
            message: "GET data stored successfully"
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: `${err}`
        });
    }
});

// Health check endpoint
// app.get("/health", (req, res) => {
//     res.status(200).json({
//         status: "OK",
//         timestamp: new Date().toISOString(),
//         service: "Bin Data Server"
//     });
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Main endpoint: http://localhost:${PORT}/sendBinData`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

// Handle graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received, shutting down gracefully');
//     process.exit(0);
// });

// exports.sendBinData = onRequest(async (req, res) => {
//     // res.set('Access-Control-Allow-Origin', '*');
//     // const allowedOrigins = [
//     //   "https://www.saadahalwai.com",
//     //   "https://saadahalwai.com",
//     //   "https://sadda-dhaba.vercel.app",
//     //   "https://sadda-halwai.vercel.app",
//     //   "http://localhost:60600"
//     // ];
//     // const origin = req.headers.origin;
//     // if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Origin", origin);
//     // }
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.set("Access-Control-Allow-Headers", "Content-Type");
//     try {
//         console.log(req.body);
//         const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || null;
//         await admin.firestore().collection("BinData").add({
//             id: req.params,
//             query: req.query,
//             body: req.body || {},
//             ip: ip,
//             ts: Date.now()
//         });
//         return res.status(200).send({
//             success: true
//         });
//     } catch (err) {
//         return res.status(500).json({ message: `${err}` });
//     }
// });
