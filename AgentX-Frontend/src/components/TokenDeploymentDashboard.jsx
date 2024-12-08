import React, { useState, useEffect } from "react";
import { FaArrowRight, FaEthereum } from "react-icons/fa";
import { useAgent } from "../AgentContext";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useBalance,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { deployContract } from "@wagmi/core";
import { retrieveWalrusConfig } from "./WalrusConfig";

const TokenABI = [
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "costPerGame",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creatorCommission",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameCreator",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "playGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const TokenDeploymentDashboard = () => {
  const { agentData } = useAgent();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [deployedAddress, setDeployedAddress] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buyAmount, setBuyAmount] = useState("");
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [walrusConfig, setWalrusConfig] = useState(null);

  const byteCode =
    "0x60806040523480156200001157600080fd5b5060405162001028380380620010288339810160408190526200003491620001aa565b6000620000428382620002a5565b506001620000518282620002a5565b5069152d02c7e14af68000006003556103e86004556101f4600555600680546001600160a01b031916339081179091556000818152600760205260408082206509184e72a00090819055600281905590517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91620000d29190815260200190565b60405180910390a3505062000371565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200010a57600080fd5b81516001600160401b0380821115620001275762000127620000e2565b604051601f8301601f19908116603f01168101908282118183101715620001525762000152620000e2565b81604052838152602092508660208588010111156200017057600080fd5b600091505b8382101562000194578582018301518183018401529082019062000175565b6000602085830101528094505050505092915050565b60008060408385031215620001be57600080fd5b82516001600160401b0380821115620001d657600080fd5b620001e486838701620000f8565b93506020850151915080821115620001fb57600080fd5b506200020a85828601620000f8565b9150509250929050565b600181811c908216806200022957607f821691505b6020821081036200024a57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620002a0576000816000526020600020601f850160051c810160208610156200027b5750805b601f850160051c820191505b818110156200029c5782815560010162000287565b5050505b505050565b81516001600160401b03811115620002c157620002c1620000e2565b620002d981620002d2845462000214565b8462000250565b602080601f831160018114620003115760008415620002f85750858301515b600019600386901b1c1916600185901b1785556200029c565b600085815260208120601f198616915b82811015620003425788860151825594840194600190910190840162000321565b5085821015620003615787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610ca780620003816000396000f3fe608060405260043610610..."; // Your full bytecode here

  const handleDeploy = async () => {
    try {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);
      setError(null);

      // Ensure we have the required parameters
      if (!agentData.tickerName || !agentData.tickerSymbol) {
        throw new Error("Token name and symbol are required");
      }

      console.log("Starting deployment with:", {
        address,
        name: agentData.tickerName,
        symbol: agentData.tickerSymbol,
      });

      const deploymentConfig = {
        abi: TokenABI,
        bytecode: byteCode,
        account: address,
        args: [agentData.tickerName, agentData.tickerSymbol],
      };

      const hash = await deployContract(deploymentConfig);

      console.log("Contract deployed at:", hash);
      setDeployedAddress(hash);
      setIsDeployed(true);
    } catch (err) {
      console.error("Deployment error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Contract Read Operations
  const { data: balance } = useContractRead({
    address: deployedAddress,
    abi: TokenABI,
    functionName: "balanceOf",
    args: [address],
    enabled: isDeployed,
  });

  const { data: totalSupply } = useContractRead({
    address: deployedAddress,
    abi: TokenABI,
    functionName: "totalSupply",
    enabled: isDeployed,
  });

  // Buy Tokens
  const { write: buyTokens } = useContractWrite({
    address: deployedAddress,
    abi: TokenABI,
    functionName: "buyTokens",
  });

  // Get ETH Balance
  const { data: ethBalance } = useBalance({
    address,
  });

  const handleBuyTokens = async () => {
    try {
      setIsBuyLoading(true);
      await buyTokens({
        value: parseEther(buyAmount),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBuyLoading(false);
    }
  };

  useEffect(() => {
    const fetchWalrusConfig = async () => {
      if (agentData.walrusBlob) {
        const { success, config, error } = await retrieveWalrusConfig(
          agentData.walrusBlob,
        );
        if (success) {
          setWalrusConfig(config);
        } else {
          setError(error);
        }
      }
    };
    fetchWalrusConfig();
  }, [agentData.walrusBlob]);

  // Deployment View
  if (!isDeployed) {
    return (
      <div className="flex-grow px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Deploy Token Contract</h2>

        {walrusConfig && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl mb-4">Walrus Configuration</h3>
            <div className="space-y-3">
              <p>Blob ID: {agentData.walrusBlob}</p>
              <p>Agent Name: {walrusConfig.name}</p>
              <p>
                Deployment Timestamp:{" "}
                {walrusConfig.deployment_details?.deployment_timestamp}
              </p>
              <p>Token Cost: {walrusConfig.deployment_details?.token_cost}</p>
              <p>Commission: {walrusConfig.deployment_details?.commission}%</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl mb-4">Token Details</h3>
          <div className="space-y-3">
            <p>Name: {agentData.tickerName}</p>
            <p>Symbol: {agentData.tickerSymbol}</p>
            <p>Initial Supply: {agentData.initialSupply || "10000000000000"}</p>
            <p>Cost per Game: 1000 tokens</p>
            <p>Creator Commission: 5%</p>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          disabled={loading || !agentData.tickerName || !agentData.tickerSymbol}
          className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white py-3 rounded-lg disabled:opacity-50 hover:from-gray-700 hover:to-gray-800"
        >
          {loading ? "Deploying..." : "Deploy Contract"}
        </button>

        {error && (
          <div className="mt-4 bg-red-800/50 text-white p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="flex-grow px-8 py-6">
      <h2 className="text-2xl font-semibold mb-4">Token Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Your Balance</h3>
          <p className="text-2xl">
            {balance ? formatEther(balance) : "0"} {agentData.tickerSymbol}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Supply</h3>
          <p className="text-2xl">
            {totalSupply ? formatEther(totalSupply) : "0"}{" "}
            {agentData.tickerSymbol}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">ETH Balance</h3>
          <p className="text-2xl">
            {ethBalance ? formatEther(ethBalance.value) : "0"} ETH
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl mb-4">Buy Tokens</h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            placeholder="ETH Amount"
            className="flex-1 bg-gray-700 text-white p-3 rounded-lg"
          />
          <button
            onClick={handleBuyTokens}
            disabled={isBuyLoading || !buyAmount}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isBuyLoading ? "Buying..." : "Buy Tokens"}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl mb-4">Contract Information</h3>
        <div className="space-y-2">
          <p>Contract Address: {deployedAddress}</p>
          <p>Token Name: {agentData.tickerName}</p>
          <p>Token Symbol: {agentData.tickerSymbol}</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-800 text-white p-4 rounded-lg">{error}</div>
      )}
    </div>
  );
};

export default TokenDeploymentDashboard;
