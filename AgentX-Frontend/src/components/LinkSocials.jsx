import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useAgent } from "../AgentContext";

const LinkSocials = ({ setCurrentTab }) => {
  const { agentData, setAgentData } = useAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/link-socials",
        {
          twitter: agentData.socials.twitter,
          telegram: agentData.socials.telegram,
          website: agentData.socials.website,
        },
      );

      setAgentData((prev) => ({
        ...prev,
        socialLinks: response.data.social_links,
      }));

      setCurrentTab(6);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to link socials");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialChange = (field, value) => {
    setAgentData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value,
      },
    }));
  };

  return (
    <>
      <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Link Socials</h2>
        <p className="text-sm text-gray-400 mb-8">
          Connect your agent's social media accounts.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="x" className="text-xl font-semibold mb-4">
              X
            </label>
            <input
              id="x"
              value={agentData.socials.twitter}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="@username"
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="telegram" className="text-xl font-semibold mb-4">
              Telegram
            </label>
            <input
              id="telegram"
              type="text"
              value={agentData.socials.telegram}
              onChange={(e) => handleSocialChange("telegram", e.target.value)}
              placeholder="@username or channel link"
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="web" className="text-xl font-semibold mb-4">
              Website
            </label>
            <input
              id="web"
              type="url"
              value={agentData.socials.website}
              onChange={(e) => handleSocialChange("website", e.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
      <footer className="px-8 py-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]"
        >
          <span>{loading ? "Processing..." : "Next"}</span>
          <FaArrowRight />
        </button>
      </footer>
    </>
  );
};

export default LinkSocials;
