import React from "react";
import { FaArrowRight } from "react-icons/fa";
const AgentBehaviour = ({setCurrentTab}) => {
    return (
        <>
            <main className="flex-grow px-8 py-6">
                <h2 className="text-2xl font-semibold mb-4">Agent Behavior</h2>
                <p className="text-sm text-gray-400 mb-8">
                    Tell us your agent idea, and our AI assistant will bring it to life.
                </p>

                <div className="space-y-6">
                    <label
                        htmlFor="commission"
                        className="text-xl font-semibold mb-4"
                    >
                        Name
                    </label>
                    <div>
                        <input
                            id="enter-agent"
                            placeholder="Your Agent's Name"
                            className="mt-2 w-full  bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2  background: linear-gradient(to bottom, #D7EDED, #CCEBEB)"
                        />
                    </div>

                 {/*
                    
                    <label
                        htmlFor="commission"
                        className="text-xl font-semibold mb-4"
                    >
                        Upload Image
                    </label>*/}

                </div>
                <br/>
                <div className="space-y-6">
                    <label
                        htmlFor="commission"
                        className="text-xl font-semibold mb-4"
                    >

                        Personality
                    </label>
                    <div>
                        <textarea
                            id="enter-agent"
                            placeholder="Your Agent's Name"
                            rows="10"
                            className="mt-2 w-full h-[30%] bg-gray-800 text-white p-3 rounded-[12px] border border-gray-700 focus:outline-none focus:ring-2  background: linear-gradient(to bottom, #D7EDED, #CCEBEB)"
                        />
                    </div>
                </div>
            </main>
            <footer className="px-8 py-4 flex justify-end">
                <button onClick={()=>setCurrentTab(3)} className="flex items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium py-2 px-6 rounded-md shadow-md hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 transition-all float-left w-[280px] h-[52px]">
                    <span>Next</span>
                    <FaArrowRight />
                </button>
            </footer>
        </>
    )
}

export default AgentBehaviour