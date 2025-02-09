pragma solidity ^0.8.0;

contract Polling {
    struct Poll {
        string ipfsHash; // IPFS hash of the poll metadata (question and options)
        string[] options; // Array of poll options
        mapping(uint => uint) votes; // Tracks vote counts for each option
        mapping(address => bool) hasVoted; // Tracks whether an address has voted
        bool exists;
        bool closed;
        bool createdByAdmin;
    }

    mapping(uint => Poll) public polls;
    uint public pollCount;
    address public admin;

    event PollCreated(uint pollId, string ipfsHash, bool createdByAdmin);
    event VoteCast(uint pollId, uint optionIndex, address voter);
    event PollClosed(uint pollId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the deployer as admin
    }

    // Create a poll with an IPFS hash (Admin-only)
    function createAdminPoll(string memory _ipfsHash) public onlyAdmin {
        require(bytes(_ipfsHash).length > 0, "IPFS hash is required");
        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.ipfsHash = _ipfsHash;
        newPoll.exists = true;
        newPoll.createdByAdmin = true; // Mark as admin-created
        emit PollCreated(pollCount, _ipfsHash, true);
    }

    // Create a poll with an IPFS hash (User-level)
    function createPoll(string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash is required");
        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.ipfsHash = _ipfsHash;
        newPoll.exists = true;
        newPoll.createdByAdmin = false; // Mark as user-created
        emit PollCreated(pollCount, _ipfsHash, false);
    }

    // Vote on a poll
    function vote(uint _pollId, uint _optionIndex) public {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!polls[_pollId].closed, "Poll is closed");
        require(!polls[_pollId].hasVoted[msg.sender], "Already voted");

        polls[_pollId].votes[_optionIndex]++;
        polls[_pollId].hasVoted[msg.sender] = true;

        emit VoteCast(_pollId, _optionIndex, msg.sender);
    }

    // Close a poll
    function closePoll(uint _pollId) public onlyAdmin {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!polls[_pollId].closed, "Poll is already closed");

        polls[_pollId].closed = true;
        emit PollClosed(_pollId);
    }

    // Get the results of a poll
    function getResults(uint _pollId) public view returns (uint[] memory) {
        require(polls[_pollId].exists, "Poll does not exist");

        uint[] memory results = new uint[](16);
        for (uint i = 0; i < 16; i++) {
            results[i] = polls[_pollId].votes[i];
        }
        return results;
    }

    // Get the IPFS hash of a poll
    function getPollIPFSHash(uint _pollId) public view returns (string memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        return polls[_pollId].ipfsHash;
    }

    function getOptions(uint _pollId) public view returns (string[] memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        return polls[_pollId].options;
    }
}
