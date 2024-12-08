import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const AgentConfiguration = ({ setCurrentTab }) => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/agent-configuration",
        {
          gameType: agentData.gameType,
          tokenCost: agentData.tokenCost,
          commission: agentData.commission,
        },
      );

      setAgentData((prev) => ({
        ...prev,
        config: response.data.config,
      }));

      setCurrentTab(4);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Agent Configuration</h2>
        <p className="text-sm text-gray-400 mb-8">
          Tell us your agent idea, and our AI assistant will bring it to life.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="game-type" className="text-xl font-semibold mb-4">
              Game type
            </label>
            <select
              id="game-type"
              value={agentData.gameType}
              onChange={(e) =>
                setAgentData((prev) => ({ ...prev, gameType: e.target.value }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            >
              <option value="roulette">Roulette - this is the dropdown</option>
              <option value="blackjack">BlackJack - coming soon</option>
            </select>
          </div>

          <div>
            <label htmlFor="token-cost" className="text-xl font-semibold mb-4">
              Token Cost per Game
            </label>
            <input
              id="token-cost"
              type="number"
              value={agentData.tokenCost}
              onChange={(e) =>
                setAgentData((prev) => ({ ...prev, tokenCost: e.target.value }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="commission" className="text-xl font-semibold mb-4">
              Commission
            </label>
            <input
              id="commission"
              type="number"
              value={agentData.commission}
              onChange={(e) =>
                setAgentData((prev) => ({
                  ...prev,
                  commission: e.target.value,
                }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
      <footer className="px-8 py-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !agentData.gameType ||
            !agentData.tokenCost ||
            !agentData.commission
          }
          className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]"
        >
          <span>{loading ? "Processing..." : "Next"}</span>
          <FaArrowRight />
        </button>
      </footer>
    </>
  );
};

export default AgentConfiguration;
