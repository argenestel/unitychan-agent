import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const Brainstorm = ({ setCurrentTab }) => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/brainstorm",
        {
          idea: agentData.idea,
        },
      );

      setAgentData((prev) => ({
        ...prev,
        enhancedIdea: response.data.suggestion,
      }));

      setCurrentTab(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Create your agent</h2>
        <p className="text-sm text-gray-400 mb-8">
          Tell us your agent idea, and our AI assistant will bring it to life.
        </p>

        <div className="space-y-6">
          <div>
            <textarea
              id="enter-agent"
              value={agentData.idea}
              onChange={(e) =>
                setAgentData((prev) => ({ ...prev, idea: e.target.value }))
              }
              placeholder="Tell us your agent idea, and our AI assistant will bring it to life."
              rows="10"
              className="mt-2 w-full h-[30%] bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
      <footer className="px-8 py-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || !agentData.idea.trim()}
          className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]"
        >
          <span>{loading ? "Processing..." : "Next"}</span>
          <FaArrowRight />
        </button>
      </footer>
    </>
  );
};

export default Brainstorm;
