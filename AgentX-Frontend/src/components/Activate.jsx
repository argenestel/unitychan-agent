import React from "react";
import { FaArrowRight } from "react-icons/fa";
const Activate=({setCurrentTab})=>{
    return(
        <>
        <main className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Activate</h2>
        <p className="text-sm text-gray-400 mb-8">
            Tell us your agent idea, and our AI assistant will bring it to life.
        </p>
        {/* Form */}
        <div className="space-y-6">
            {/* Game Type */}
            <div>
                <label
                    htmlFor="ticker-name"
                    className="text-xl font-semibold mb-4"
                >
                    Choose Interface
                </label>
                <input
                    id="ticker-name"
                    className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2  background: linear-gradient(to bottom, #D7EDED, #CCEBEB)"
                />
            </div>
            {/* Token Cost per Game */}
            <div>
            <label
            htmlFor="bot"
            className="text-xl font-semibold mb-4"
        >
            Telegram Bot Token
        </label>
        <input
            id="ticker-sym"
            type="text"
            className="mt-2 w-full bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2  background: linear-gradient(to bottom, #D7EDED, #CCEBEB)"
        />
            </div>

            {/* Commission */}
            <div>
            <label
            htmlFor="token-supply"
            className="text-xl font-semibold mb-4  "
        >
            Preview
        </label>
        <div className="bg-gray-800 w-full text-white p-6 rounded-lg shadow-md ">
      
          <p className="mb-2">Creation Cost: <span className="font-medium">500 AX</span></p>
          <p className="mb-2">Initial Supply: <span className="font-medium">1,000,000</span></p>
          <p>Cost per Game: <span className="font-medium">100</span></p>
      </div>
            </div>
        </div>
    </main>
    <footer className="px-8 py-4 flex justify-end">
    <button className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]">
    <span>Deploy Your Agent</span>
    <FaArrowRight />
  </button>
    </footer>
        </>
    )
}

export default Activate