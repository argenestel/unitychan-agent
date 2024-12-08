import axios from "axios";

export const retrieveWalrusConfig = async (blobId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/config/${blobId}`,
    );
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

// Usage example:
// const { success, config, error } = await retrieveWalrusConfig(agentData.walrusBlob);
