import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css"; // Import CSS file for styling

const Sidebar = () => {
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
    </div>
  );
};

const PollCard = ({ title }) => {
  return (
    <div className="poll-card">
      <h3>{title}</h3>
    </div>
  );
};

const PollGrid = ({ polls }) => {
  return (
    <div className="poll-grid">
      {polls.map((poll, index) => (
        <Link to={`/poll/${index}`} key={index}>
          <PollCard title={poll.title} />
        </Link>
      ))}
    </div>
  );
};

const VerifiedPage = () => {
  const polls = [
    { title: "Poll 1" },
    { title: "Poll 2" },
    { title: "Poll 3" },
  ];

  return (
    <div className="content">
      <PollGrid polls={polls} />
      <CreatePollButton />
    </div>
  );
};

const CommunityPage = () => {
  const polls = [
    { title: "Community Poll 1" },
    { title: "Community Poll 2" },
    { title: "Community Poll 3" },
  ];

  return (
    <div className="content">
      <PollGrid polls={polls} />
      <CreatePollButton />
    </div>
  );
};

const CreatePollButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="create-poll-button"
    >
      + Create a new poll
    </motion.button>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/verified" element={<VerifiedPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/poll/:id"
            element={<div className="content">This is a dedicated poll page.</div>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
