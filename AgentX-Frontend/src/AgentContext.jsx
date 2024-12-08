import React, { createContext, useState } from "react";

export const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agentData, setAgentData] = useState({
    idea: "",
    enhancedIdea: "",
    name: "",
    personality: "",
    personalityProfile: "",
    gameType: "roulette",
    tokenCost: 100,
    commission: "",
    tickerName: "",
    tickerSymbol: "",
    initialSupply: 10000,
    socials: {
      twitter: "",
      telegram: "",
      website: "",
    },
    interface: "",
    telegramBotToken: "",
    walrusBlob: null, // Store Walrus blob ID here
  });

  return (
    <AgentContext.Provider value={{ agentData, setAgentData }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = React.useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
