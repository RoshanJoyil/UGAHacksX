import React, { useState } from "react";

const VotingComponent = () => {
  // Initialize state for upvotes and downvotes
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  // Function to handle upvote
  const handleUpvote = () => {
    setUpvotes(upvotes + 1);
  };

  // Function to handle downvote
  const handleDownvote = () => {
    setDownvotes(downvotes + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-center">What is your opinion on the new feature?</h3>

        <div className="flex justify-around mb-6">
          <button
            onClick={handleUpvote}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Upvote 👍 {upvotes}
          </button>
          <button
            onClick={handleDownvote}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Downvote 👎 {downvotes}
          </button>
        </div>

        <div className="text-center text-lg">
          <p><strong>Upvotes:</strong> {upvotes}</p>
          <p><strong>Downvotes:</strong> {downvotes}</p>
        </div>
      </div>
    </div>
  );
};

export default VotingComponent;
