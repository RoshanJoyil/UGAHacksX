import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "./App.css"; // Import CSS file for styling

// Sidebar Component
const Sidebar = () => {
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
        <button onClick={() => logout({ returnTo: window.location.origin })} className="sidebar-link">
          Logout
        </button>
      )}
    </div>
  );
};

// PollCard Component
const PollCard = ({ title }) => {
  return (
    <div className="poll-card">
      <h3>{title}</h3>
    </div>
  );
};

// PollGrid Component
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


// Verified Page Component
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

// Community Page Component
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

// Create Poll Button Component
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

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div className="content">You need to log in to access this page.</div>;
  }

  return children;
};

// Main App Component
const App = () => {
  return (
    <Auth0Provider
      domain="dev-eibwnehpajd0cl2p.us.auth0.com"
      clientId="ziq7R7rCUVahOpfaevqLgrycK54bi80y"
      redirectUri={"http://localhost:3000/verified"}
    >
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
    </Auth0Provider>
  );
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        Hello {user.name}{' '}
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log out
        </button>
      </div>
    );
  } else {
    return <button onClick={() => loginWithRedirect()}>Log in</button>;
  }

};

export default App;
