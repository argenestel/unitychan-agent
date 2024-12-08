import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const CreateToken = ({ setCurrentTab }) => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/create-token",
        {
          tickerName: agentData.tickerName,
          tickerSymbol: agentData.tickerSymbol,
          initialSupply: agentData.initialSupply,
        },
      );

      setAgentData((prev) => ({
        ...prev,
        token: response.data.token,
      }));

      setCurrentTab(5);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Create Token</h2>
        <p className="text-sm text-gray-400 mb-8">
          Configure your agent's token details.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="ticker-name" className="text-xl font-semibold mb-4">
              Ticker Name
            </label>
            <input
              id="ticker-name"
              value={agentData.tickerName}
              onChange={(e) =>
                setAgentData((prev) => ({
                  ...prev,
                  tickerName: e.target.value,
                }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="ticker-sym" className="text-xl font-semibold mb-4">
              Ticker Symbol
            </label>
            <input
              id="ticker-sym"
              type="text"
              value={agentData.tickerSymbol}
              onChange={(e) =>
                setAgentData((prev) => ({
                  ...prev,
                  tickerSymbol: e.target.value,
                }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="token-supply"
              className="text-xl font-semibold mb-4"
            >
              Initial token supply
            </label>
            <input
              id="token-supply"
              type="number"
              value={agentData.initialSupply}
              onChange={(e) =>
                setAgentData((prev) => ({
                  ...prev,
                  initialSupply: parseInt(e.target.value),
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
            !agentData.tickerName ||
            !agentData.tickerSymbol ||
            !agentData.initialSupply
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

export default CreateToken;
