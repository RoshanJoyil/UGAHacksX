import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

import "./App.css";
import {
  createAdminPoll,
  createPoll,
  getPollCount,
  getPollIPFSHash,
  getPollResults,
} from "./utils/viem";
import { uploadToPinata } from "./utils/pinata";
import { ethers } from "ethers"; // Added Ethers.js

interface Poll {
  id: number;
  question: string;
  options: string[];
  results: number[];
  closed: boolean;
  createdByAdmin: boolean;
}

const getOptions = async () => {
  const ipfsHash = prompt("Enter the IPFS hash of the poll:");

  if (!ipfsHash) {
    alert("No IPFS hash provided.");
    return;
  }

  try {
    // Fetch the metadata from IPFS
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);

    if (!response.ok) {
      throw new Error("Failed to fetch data from IPFS.");
    }

    const metadata = await response.json();

    // Display poll options
    if (metadata.options && Array.isArray(metadata.options)) {
      alert(`Options for the poll:\n${metadata.options.join("\n")}`);
    } else {
      alert("This poll does not have valid options.");
    }
  } catch (error) {
    console.error("Error fetching poll options:", error);
    alert("Failed to fetch poll options.");
  }
};

const Sidebar: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [buttonPressed, setButtonPressed] = useState(false);

  return (
    <div className="sidebar">
      <Link to="/verified" className="sidebar-link">
        <span className="icon">✔️</span>
        <span>Verified</span>
      </Link>
      <Link to="/community" className="sidebar-link">
        <span className="icon">👥</span>
        <span>Community</span>
      </Link>
      <button
        onClick={getOptions}
        className="sidebar-link get-options-button"
      >
        🔍 View Poll Options
      </button>
      {!buttonPressed && !isAuthenticated ? (
        <button
          onClick={() => {
            loginWithRedirect();
            setButtonPressed(true);
          }}
          className="sidebar-link"
        >
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()} className="sidebar-link">
          Login
        </button>
      ) : (
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: "http://localhost:3000/verified",
              },
            })
          }
          className="sidebar-link"
        >
          Logout
        </button>
      )}
    </div>
  );
};


const PollCard: React.FC<{ question: string }> = ({ question }) => {
  return (
    <div className="poll-card">
      <h3>{question}</h3>
    </div>
  );
};

const CommunityPollCard: React.FC<{ poll: Poll }> = ({ poll }) => {
  const totalVotes = poll.results.reduce((sum, votes) => sum + votes, 0);

  return (
    <div className="poll-card">
      <h3>{poll.question}</h3>
      <div className="poll-results">
        {poll.options.map((option, index) => {
          const votePercentage = totalVotes > 0 ? (poll.results[index] / totalVotes) * 100 : 0;

          return (
            <div key={index} className="poll-option">
              <span className="option-text">{option}</span>
              <div className="bar-container">
                <div
                  className="bar"
                  style={{
                    width: `${votePercentage}%`,
                  }}
                ></div>
              </div>
              <span className="vote-count">{poll.results[index]} votes</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PollGrid: React.FC<{ polls: Poll[]; isCommunity?: boolean }> = ({
  polls,
  isCommunity = false,
}) => {
  return (
    <div className="poll-grid">
      {polls.map((poll, index) => (
        <Link to={`/poll/${poll.id}`} key={index}>
          {isCommunity ? (
            <CommunityPollCard poll={poll} />
          ) : (
            <PollCard question={poll.question} />
          )}
        </Link>
      ))}
    </div>
  );
};

const VerifiedPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchVerifiedPolls() {
      try {
        setLoading(true);

        // Add some sample polls
        const samplePolls: Poll[] = [
          {
            id: 1,
            question: "What is your favorite programming language?",
            options: ["JavaScript", "Python", "C++"],
            results: [50, 30, 20],
            closed: false,
            createdByAdmin: true,
          },
          {
            id: 2,
            question: "What framework do you prefer?",
            options: ["React", "Vue", "Angular"],
            results: [70, 20, 10],
            closed: false,
            createdByAdmin: true,
          },
        ];

        // Simulate fetching verified polls
        setPolls(samplePolls);
      } catch (error) {
        console.error("Error fetching verified polls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVerifiedPolls();
  }, []);

  if (loading) {
    return <div className="content">Loading polls...</div>;
  }

  return (
    <div className="content">
      <PollGrid polls={polls} />
      <CreatePollButton isAdmin={true} />
    </div>
  );
};


const CommunityPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCommunityPolls() {
      try {
        setLoading(true);

        // Add some sample community polls
        const samplePolls: Poll[] = [
          {
            id: 3,
            question: "What is your favorite sport?",
            options: ["Football", "Basketball", "Tennis"],
            results: [40, 35, 25],
            closed: false,
            createdByAdmin: false,
          },
          {
            id: 4,
            question: "What type of movies do you like?",
            options: ["Action", "Romance", "Comedy"],
            results: [45, 30, 25],
            closed: false,
            createdByAdmin: false,
          },
        ];

        setPolls(samplePolls);
      } catch (error) {
        console.error("Error fetching community polls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityPolls();
  }, []);

  if (loading) {
    return <div className="content">Loading polls...</div>;
  }

  return (
    <div className="content">
      <PollGrid polls={polls} isCommunity={true} />
      <CreatePollButton isAdmin={false} />
    </div>
  );
};

const CreatePollButton: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          setAccount(accounts[0]);
        });
    }
  }, []);

  const handleCreatePoll = async () => {
    const question = prompt("Enter poll question:");
    if (!question) return;

    const optionsString = prompt(
      "Enter poll options separated by commas (e.g., Option1,Option2,Option3):"
    );
    if (!optionsString) return;

    const options = optionsString.split(",").map((option) => option.trim());
    const metadata = { question, options, createdBy: account, timestamp: new Date().toISOString() };

    try {
      const ipfsHash = await uploadToPinata(metadata); // Upload metadata to IPFS
      if (isAdmin) {
        await createAdminPoll(ipfsHash); // Call the admin poll creation function
      } else {
        await createPoll(ipfsHash); // Call the user poll creation function
      }
      alert("Poll created successfully!");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll.");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="create-poll-button"
      onClick={handleCreatePoll}
    >
      + Create a new poll
    </motion.button>
  );
};

const App: React.FC = () => {
  const [account, setAccount] = useState<string>("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask or use WalletConnect.");
    }
  };

  return (
    <Router>
      <Auth0Provider
      domain="dev-eibwnehpajd0cl2p.us.auth0.com"
      clientId="ziq7R7rCUVahOpfaevqLgrycK54bi80y"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/verified",
      }}
    >
        <div className="app-container">
          <Sidebar />
          <Routes>
            <Route
              path="/verified"
              element={
                <VerifiedPage />
              }
            />
            <Route
              path="/community"
              element={
                <CommunityPage />
              }
            />
            <Route
              path="/poll/:id"
              element={<div className="content">This is a dedicated poll page.</div>}
            />
          </Routes>
        </div>
    </Auth0Provider>
      <div className="app-container">
        <Sidebar />
        <div className="wallet-connection">
          <button onClick={connectWallet}>
            {account
              ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>
        <Routes>
          <Route path="/verified" element={<VerifiedPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/poll/:id"
            element={
              <div className="content">This is a dedicated poll page.</div>
            }
          />
        </Routes>
      </div>
    </Router>

  );
};

export default App;
