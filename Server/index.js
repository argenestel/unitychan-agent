require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();

// Initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: "./uploads/",
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Walrus Configuration
const WALRUS_AGGREGATOR =
	process.env.WALRUS_AGGREGATOR ||
	"https://aggregator.walrus-testnet.walrus.space";
const WALRUS_PUBLISHER =
	process.env.WALRUS_PUBLISHER ||
	"https://publisher.walrus-testnet.walrus.space";

// Step 1: Brainstorm
app.post("/api/brainstorm", async (req, res) => {
	try {
		const { idea } = req.body;

		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an AI assistant specializing in gaming and casino agent creation.",
				},
				{
					role: "user",
					content: `Enhance and suggest improvements for this gaming agent idea: ${idea}`,
				},
			],
		});

		res.json({
			suggestion: completion.choices[0].message.content,
			enhanced_idea: completion.choices[0].message.content,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Step 2: Agent Behavior
app.post("/api/agent-behavior", async (req, res) => {
	try {
		const { name, personality } = req.body;

		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an AI assistant specializing in creating engaging gaming agent personalities.",
				},
				{
					role: "user",
					content: `Create a detailed personality profile for a gaming agent named ${name} with these traits: ${personality}`,
				},
			],
		});

		res.json({
			name,
			personality_profile: completion.choices[0].message.content,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Step 3: Agent Configuration
app.post("/api/agent-configuration", async (req, res) => {
	try {
		const { gameType, tokenCost, commission } = req.body;

		// Validate configuration
		if (tokenCost < 0 || commission < 0) {
			return res
				.status(400)
				.json({ error: "Token cost and commission must be positive values" });
		}

		res.json({
			config: {
				game_type: gameType,
				token_cost: tokenCost,
				commission: commission,
				status: "configured",
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Step 4: Create Token
app.post("/api/create-token", async (req, res) => {
	try {
		const { tickerName, tickerSymbol, initialSupply } = req.body;

		// Validate token parameters
		if (!tickerName || !tickerSymbol || initialSupply <= 0) {
			return res.status(400).json({ error: "Invalid token parameters" });
		}

		res.json({
			token: {
				name: tickerName,
				symbol: tickerSymbol,
				initial_supply: initialSupply,
				status: "created",
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Step 5: Link Socials
app.post("/api/link-socials", async (req, res) => {
	try {
		const { twitter, telegram, website } = req.body;

		// Validate social links
		const socialLinks = {
			twitter: twitter || null,
			telegram: telegram || null,
			website: website || null,
		};

		res.json({
			social_links: socialLinks,
			status: "linked",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Step 6: Activate
app.post("/api/activate", async (req, res) => {
	try {
		const { interface: userInterface, telegramBotToken } = req.body;

		// Validate activation parameters
		if (!userInterface || !telegramBotToken) {
			return res
				.status(400)
				.json({ error: "Missing required activation parameters" });
		}

		// Generate final agent configuration
		const agentConfig = {
			interface: userInterface,
			telegram_bot_token: telegramBotToken,
			creation_cost: "500 AX",
			initial_supply: "1,000,000",
			cost_per_game: "100",
		};

		// Store in Walrus
		const walrusResponse = await axios({
			method: "PUT",
			url: `${WALRUS_PUBLISHER}/v1/store?epochs=5`,
			data: JSON.stringify(agentConfig),
			headers: {
				"Content-Type": "application/json",
			},
		});

		res.json({
			status: "activated",
			config: agentConfig,
			walrus_data: walrusResponse.data,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Generate complete agent configuration
app.post("/api/generate-config", async (req, res) => {
	try {
		const {
			name,
			personality,
			gameType,
			tokenCost,
			commission,
			socials,
			interface: userInterface,
			telegramBotToken,
			voiceSettings,
			customResponses,
			interests,
			specialTraits,
		} = req.body;

		const config = {
			name: name,
			base_traits: {
				energy_level: Math.random() * 0.5 + 0.5,
				playfulness: Math.random() * 0.5 + 0.5,
				mysteriousness: Math.random() * 0.5 + 0.5,
				wisdom: Math.random() * 0.5 + 0.5,
				mischievousness: Math.random() * 0.5 + 0.5,
				empathy: Math.random() * 0.5 + 0.5,
				elegance: Math.random() * 0.5 + 0.5,
			},
			speech_style: {
				tone: personality?.tone || "friendly and engaging",
				language: personality?.language || "English",
				emoji_use: personality?.emoji_use || "moderate",
				speaking_quirks: personality?.quirks || [
					"Uses gaming terms frequently",
					"Makes friendly jokes",
					"Shows enthusiasm",
				],
			},
			responses: {
				greeting: customResponses?.greeting || [
					"Hello there! Ready to play?",
					"Welcome to the game!",
					"Great to see you!",
				],
				casino: {
					win: customResponses?.casino?.win || [
						"Congratulations on your win!",
						"Amazing play!",
						"Well done!",
					],
					lose: customResponses?.casino?.lose || [
						"Better luck next time!",
						"Don't give up!",
						"Keep trying!",
					],
					start: customResponses?.casino?.start || [
						"Let's begin!",
						"Ready to play?",
						"Game time!",
					],
				},
				stream: {
					donation: customResponses?.stream?.donation || [
						"Thank you for your support!",
						"You're amazing!",
						"Much appreciated!",
					],
					raid: customResponses?.stream?.raid || [
						"Welcome raiders!",
						"Thanks for the raid!",
						"Great to have you all!",
					],
				},
				reactions: customResponses?.reactions || [
					"That's awesome!",
					"How interesting!",
					"Amazing!",
				],
			},
			voice_settings: {
				unity: voiceSettings?.unity || {
					voice_name: "en-US-Standard",
					style: "casual",
					pitch: 1.0,
					rate: 1.0,
					volume: 1.0,
				},
				realtime: voiceSettings?.realtime || {
					voice_id: "default_voice",
					model: "eleven_multilingual_v2",
					settings: {
						stability: 0.5,
						similarity_boost: 0.5,
						style: 0.5,
						speaking_rate: 1.0,
					},
				},
			},
			interests: interests || {
				traditional: ["Gaming", "Entertainment"],
				gaming: ["Popular Games", "Casino Games"],
				entertainment: ["Streaming", "Social Media"],
				food: ["Snacks", "Drinks"],
			},
			game_settings: {
				type: gameType,
				token_cost: tokenCost,
				commission: commission,
			},
			social_links: socials,
			interface_settings: {
				type: userInterface,
				telegram_bot_token: telegramBotToken,
				...voiceSettings,
			},
		};

		// Add any special traits if provided
		if (specialTraits) {
			config.special_traits = specialTraits;
		}

		// Store in Walrus
		const walrusResponse = await axios({
			method: "PUT",
			url: `${WALRUS_PUBLISHER}/v1/store?epochs=5`,
			data: JSON.stringify(config),
			headers: {
				"Content-Type": "application/json",
			},
		});

		res.json({
			status: "success",
			config: config,
			walrus_data: walrusResponse.data,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Retrieve configuration from Walrus
app.get("/api/config/:blobId", async (req, res) => {
	try {
		const { blobId } = req.params;
		const response = await axios({
			method: "GET",
			url: `${WALRUS_AGGREGATOR}/v1/${blobId}`,
			responseType: "json",
		});

		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: "Internal server error",
		message: err.message,
	});
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
	fs.mkdirSync("./uploads");
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
