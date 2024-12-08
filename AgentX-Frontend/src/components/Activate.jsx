import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const Activate = () => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // First generate complete config and store in Walrus
      const configResponse = await axios.post(
        "http://localhost:3000/api/generate-config",
        {
          ...agentData,
          interface: agentData.interface,
          telegramBotToken: agentData.telegramBotToken,
        },
      );

      // Store the Walrus blob ID
      const walrusBlob =
        configResponse.data.walrus_data.newlyCreated?.blobObject?.blobId ||
        configResponse.data.walrus_data.alreadyCertified?.blobId;

      // Activate the agent
      const response = await axios.post("http://localhost:3000/api/activate", {
        interface: agentData.interface,
        telegramBotToken: agentData.telegramBotToken,
        walrusBlob: walrusBlob,
      });

      setAgentData((prev) => ({
        ...prev,
        finalConfig: configResponse.data.config,
        activationData: response.data,
        walrusBlob: walrusBlob,
      }));

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to activate agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Activate</h2>
        <p className="text-sm text-gray-400 mb-8">
          Final step to bring your agent to life.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="interface" className="text-xl font-semibold mb-4">
              Choose Interface
            </label>
            <input
              id="interface"
              value={agentData.interface}
              onChange={(e) =>
                setAgentData((prev) => ({ ...prev, interface: e.target.value }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="bot" className="text-xl font-semibold mb-4">
              Telegram Bot Token
            </label>
            <input
              id="bot"
              type="text"
              value={agentData.telegramBotToken}
              onChange={(e) =>
                setAgentData((prev) => ({
                  ...prev,
                  telegramBotToken: e.target.value,
                }))
              }
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="text-xl font-semibold mb-4">Preview</label>
            <div className="bg-gray-800 w-full text-white p-6 rounded-lg shadow-md">
              <p className="mb-2">
                Creation Cost: <span className="font-medium">500 AX</span>
              </p>
              <p className="mb-2">
                Initial Supply: <span className="font-medium">1,000,000</span>
              </p>
              <p>
                Cost per Game: <span className="font-medium">100</span>
              </p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {success && (
            <div className="bg-green-800 text-white p-4 rounded-lg">
              <p className="font-medium">Agent Successfully Activated!</p>
              <p className="text-sm mt-2">
                Walrus Blob ID: {agentData.walrusBlob}
              </p>
              <p className="text-sm">
                You can retrieve your configuration using this blob ID
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="px-8 py-4 flex justify-end">
        <button
          onClick={handleActivate}
          disabled={
            loading || !agentData.interface || !agentData.telegramBotToken
          }
          className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]"
        >
          <span>{loading ? "Deploying..." : "Deploy Your Agent"}</span>
          <FaArrowRight />
        </button>
      </footer>
    </>
  );
};

export default Activate;
