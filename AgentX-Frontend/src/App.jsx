import { RiEditLine } from "react-icons/ri";
import profile from "./assets/profile.png";
import NavButton from "./components/NavButton";
import brainstormico from "./assets/icons/brainstorm.svg";
import brainstormg from "./assets/icons/brainstormg.svg";
import agentbehavior from "./assets/icons/agentbehavior.svg";
import agentbehaviorg from "./assets/icons/agentbehaviorg.svg";
import agentconfig from "./assets/icons/agentconfig.svg";
import agentconfigg from "./assets/icons/agentconfigg.svg";
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import BrainStorm from "./components/BrainStorm";
import AgentBehaviour from "./components/AgentBehaviour";
import AgentConfiguration from "./components/AgentConfiguration";
import CreateToken from "./components/CreateToken";
import LinkSocials from "./components/LinkSocials";
import Activate from "./components/Activate";
import { AgentProvider } from "./AgentContext";
import { Web3Provider } from "./Web3Provider";
import TokenDeploymentDashboard from "./components/TokenDeploymentDashboard";
function App() {
  const [currentTab, setCurrentTab] = useState(1);
  const tabs = [
    {
      number: 1,
      text: "Brainstorm",
      logo: brainstormico,
      activelogo: brainstormg,
      component: <BrainStorm setCurrentTab={setCurrentTab} />,
    },
    {
      number: 2,
      text: "Agent Behaviour",
      logo: agentbehavior,
      activelogo: agentbehaviorg,
      component: <AgentBehaviour setCurrentTab={setCurrentTab} />,
    },
    {
      number: 3,
      text: "Agent Configuration",
      logo: agentconfig,
      activelogo: agentconfigg,
      component: <AgentConfiguration setCurrentTab={setCurrentTab} />,
    },
    {
      number: 4,
      text: "Create Token",
      logo: agentconfig,
      activelogo: agentconfigg,
      component: <CreateToken setCurrentTab={setCurrentTab} />,
    },
    {
      number: 5,
      text: "Link Socials",
      logo: agentconfig,
      activelogo: agentconfigg,
      component: <LinkSocials setCurrentTab={setCurrentTab} />,
    },
    {
      number: 6,
      text: "Activate",
      logo: agentconfig,
      activelogo: agentconfigg,
      component: <Activate setCurrentTab={setCurrentTab} />,
    },
    {
      number: 7,
      text: "Token Dashboard",
      logo: agentconfig,
      activelogo: agentconfigg,
      component: <TokenDeploymentDashboard />,
    },
  ];

  return (
    <>
      <Web3Provider>
        <AgentProvider>
          <div className="min-h-screen flex flex-col bg-[#131619] text-white p-5 tracking-wide">
            <div className="bg-[#0D0F10] rounded-[30px]">
              <header className="flex items-center justify-between px-8 py-10">
                <div>
                  <h1 className="text-xl mb-1 plus-jakarta-sans-600">AgentX</h1>
                  <p className="text-sm mt-1 text-[#9B9C9E] plus-jakarta-sans-500">
                    Launch gaming agents in secs
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-[38px] h-[38px] rounded mr-5 p-1">
                    <img
                      src={profile}
                      alt=""
                      className="w-full h-full rounded"
                    />
                  </div>
                  <span className="text-[#9B9C9E] text-sm">Name</span>
                  <div className="ml-5 rounded w-[38px] h-[38px] flex items-center justify-center bg-[#1A1D21]">
                    <RiEditLine className="" />
                  </div>
                  <ConnectKitButton />
                </div>
              </header>

              {/* Navigation tabs */}
              <nav className="flex px-8 pt-4">
                {tabs.map((e) => {
                  return (
                    <NavButton
                      active={e.number === currentTab}
                      onClick={() => {
                        setCurrentTab(e.number);
                      }}
                      key={e.number}
                      text={e.text}
                      logo={e.logo}
                      activelogo={e.activelogo}
                    />
                  );
                })}

                {/* <NavButton text="Agent Behaviour" logo={agentbehavior} activelogo={agentbehaviorg}/>
            <NavButton text="Agent Configuration" logo={agentconfig} activelogo={agentconfigg}/>
            <NavButton text="Create Token" logo={agentconfig} activelogo={agentconfigg}/>
            <NavButton text="Link Socials" logo={agentconfig} activelogo={agentconfigg}/>
            <NavButton text="Activate" logo={agentconfig} activelogo={agentconfigg}/> */}
              </nav>
            </div>
            {tabs.filter((e) => e.number === currentTab)[0].component}
          </div>
        </AgentProvider>
      </Web3Provider>
    </>
  );
}

export default App;
