pragma solidity ^0.8.0;

contract Polling {
    struct Poll {
        string question;
        string[] options;
        mapping(uint => uint) votes;
        mapping(address => bool) hasVoted;
        bool exists;
        bool closed;
        bool createdByAdmin;
    }

    mapping(uint => Poll) public polls;
    uint public pollCount;
    address public admin;

    event PollCreated(uint pollId, string question, string[] options);
    event VoteCast(uint pollId, uint optionIndex, address voter);
    event PollClosed(uint pollId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the deployer as admin
    }

    function createPoll(string memory _question, string[] memory _options) public onlyAdmin {
        require(_options.length > 1, "Poll must have at least two options");
        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.exists = true;
        newPoll.createdByAdmin = true; // Mark as admin-created
        emit PollCreated(pollCount, _question, _options);
    }

    function createUserPoll(string memory _question, string[] memory _options) public {
        require(_options.length > 1, "Poll must have at least two options");
        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.exists = true;
        newPoll.createdByAdmin = false; // Mark as user-created
        emit PollCreated(pollCount, _question, _options);
    }

    function vote(uint _pollId, uint _optionIndex) public {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!polls[_pollId].closed, "Poll is closed");
        require(!polls[_pollId].hasVoted[msg.sender], "Already voted");
        require(_optionIndex < polls[_pollId].options.length, "Invalid option");
        
        polls[_pollId].votes[_optionIndex]++;
        polls[_pollId].hasVoted[msg.sender] = true;
        emit VoteCast(_pollId, _optionIndex, msg.sender);
    }

    function closePoll(uint _pollId) public onlyAdmin {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!polls[_pollId].closed, "Poll is already closed");

        polls[_pollId].closed = true;
        emit PollClosed(_pollId);
    }

    function getResults(uint _pollId) public view returns (uint[] memory) {
        require(polls[_pollId].exists, "Poll does not exist");

        uint[] memory results = new uint[](polls[_pollId].options.length);
        for (uint i = 0; i < polls[_pollId].options.length; i++) {
            results[i] = polls[_pollId].votes[i];
        }
        return results;
    }
    function getAdminPolls() public view returns (uint[] memory) {
    uint[] memory adminPolls = new uint[](pollCount);
    uint count = 0;
    for (uint i = 1; i <= pollCount; i++) {
        if (polls[i].createdByAdmin) {
            adminPolls[count] = i;
            count++;
        }
    }
    return adminPolls;
}

    function getUserPolls() public view returns (uint[] memory) {
        uint[] memory userPolls = new uint[](pollCount);
        uint count = 0;
        for (uint i = 1; i <= pollCount; i++) {
            if (!polls[i].createdByAdmin) {
                userPolls[count] = i;
                count++;
            }
        }
        return userPolls;
    }

}
