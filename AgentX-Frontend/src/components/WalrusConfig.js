import axios from "axios";

export const retrieveWalrusConfig = async (blobId) => {
  try {
    const response = await axios.get(`http://localhost:3000/config/${blobId}`);
    return {
      success: true,
      config: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to retrieve configuration",
    };
  }
};

// Example Walrus Config Response Format:
const walrusConfigExample = {
  name: "Aira",
  base_traits: {
    energy_level: 0.8,
    humor_style: 0.7,
    tech_enthusiasm: 0.9,
    empathy: 0.8,
    creativity: 0.85,
  },
  deployment_details: {
    token_cost: 100,
    commission: 2.5,
    socials: {
      telegram: "@aira_bot",
      twitter: "@aira_gaming",
      website: "https://aira.games",
    },
    deployment_timestamp: "2024-12-08T12:00:00Z",
  },
  token_details: {
    name: "Aira Token",
    symbol: "AIRA",
    initial_supply: "1000000",
    cost_per_game: 100,
  },
};
