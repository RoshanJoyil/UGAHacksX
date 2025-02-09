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

interface Poll {
  id: number;
  title: string;
  options: string[];
  results: number[];
  closed: boolean;
  createdByAdmin: boolean;
}

// Sidebar Component with Authentication Logic
const Sidebar: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

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
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()} className="sidebar-link">
          Login
        </button>
      ) : (
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
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

const PollCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="poll-card">
      <h3>{title}</h3>
    </div>
  );
};

const PollGrid: React.FC<{ polls: Poll[] }> = ({ polls }) => {
  return (
    <div className="poll-grid">
      {polls.map((poll, index) => (
        <Link to={`/poll/${poll.id}`} key={index}>
          <PollCard title={poll.title} />
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
        const pollCount = await getPollCount();
        const fetchedPolls: Poll[] = [];
        for (let pollId = 1; pollId <= pollCount; pollId++) {
          const ipfsHash = await getPollIPFSHash(pollId);
          const results = await getPollResults(pollId);
          const ipfsResponse = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
          const metadata = await ipfsResponse.json();

          if (metadata.createdByAdmin) {
            fetchedPolls.push({
              id: pollId,
              title: metadata.title,
              options: metadata.options,
              results,
              closed: metadata.closed,
              createdByAdmin: true,
            });
          }
        }
        setPolls(fetchedPolls);
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
        const pollCount = await getPollCount();
        const fetchedPolls: Poll[] = [];
        for (let pollId = 1; pollId <= pollCount; pollId++) {
          const ipfsHash = await getPollIPFSHash(pollId);
          const results = await getPollResults(pollId);
          const ipfsResponse = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
          const metadata = await ipfsResponse.json();

          if (!metadata.createdByAdmin) {
            fetchedPolls.push({
              id: pollId,
              title: metadata.title,
              options: metadata.options,
              results,
              closed: metadata.closed,
              createdByAdmin: false,
            });
          }
        }
        setPolls(fetchedPolls);
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
      <PollGrid polls={polls} />
      <CreatePollButton isAdmin={false} />
    </div>
  );
};

const CreatePollButton: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const handleCreatePoll = async () => {
    const title = prompt("Enter poll title:");
    if (!title) return;

    const optionsString = prompt(
      "Enter poll options separated by commas (e.g., Option1,Option2,Option3):"
    );
    if (!optionsString) return;

    const options = optionsString.split(",").map((option) => option.trim());
    const metadata = { title, options, closed: false, createdByAdmin: isAdmin };

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
  return (
    <Auth0Provider
      domain="dev-eibwnehpajd0cl2p.us.auth0.com"
      clientId="ziq7R7rCUVahOpfaevqLgrycK54bi80y"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/verified",
      }}
    >
      <Router>
        <div className="app-container">
          <Sidebar />
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
    </Auth0Provider>
  );
};

export default App;
