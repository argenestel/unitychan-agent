import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const AgentBehaviour = ({ setCurrentTab }) => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/agent-behavior",
        {
          name: agentData.name,
          personality: agentData.personality,
        },
      );

      setAgentData((prev) => ({
        ...prev,
        personalityProfile: response.data.personality_profile,
      }));

      setCurrentTab(3);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process agent behavior");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Agent Behavior</h2>
        <p className="text-sm text-gray-400 mb-8">
          Tell us your agent idea, and our AI assistant will bring it to life.
        </p>

        <div className="space-y-6">
          <label htmlFor="agent-name" className="text-xl font-semibold mb-4">
            Name
          </label>
          <div>
            <input
              id="agent-name"
              value={agentData.name}
              onChange={(e) =>
                setAgentData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your Agent's Name"
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div className="space-y-6">
            <label htmlFor="personality" className="text-xl font-semibold mb-4">
              Personality
            </label>
            <div>
              <textarea
                id="personality"
                value={agentData.personality}
                onChange={(e) =>
                  setAgentData((prev) => ({
                    ...prev,
                    personality: e.target.value,
                  }))
                }
                placeholder="Describe your agent's personality"
                rows="10"
                className="mt-2 w-full h-[30%] bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
      <footer className="px-8 py-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={
            loading || !agentData.name.trim() || !agentData.personality.trim()
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

export default AgentBehaviour;
