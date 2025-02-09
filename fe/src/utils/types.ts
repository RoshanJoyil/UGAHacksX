import 'viem/window';

export interface PollingContract {
  createAdminPoll: (ipfsHash: string) => Promise<`0x${string}`>;
  createPoll: (ipfsHash: string) => Promise<`0x${string}`>;
  vote: (pollId: number, optionIndex: number) => Promise<`0x${string}`>;
  closePoll: (pollId: number) => Promise<`0x${string}`>;
  getResults: (pollId: number) => Promise<number[]>;
  getPollIPFSHash: (pollId: number) => Promise<string>;
  pollCount: () => Promise<bigint>;
}

export interface ContractPoll {
  pollId: number;
  ipfsHash: string;
  closed: boolean;
  createdByAdmin: boolean;
  voteCounts: number[]; // Votes for each option
  hasVoted: boolean; // Whether the current address has voted
}

export interface Poll {
  pollId: number;
  ipfsHash: string;
  closed: boolean;
  createdByAdmin: boolean;
  voteCounts: number[]; // Votes for each option
  options: string[]; // Human-readable options for the poll
  question: string; // Human-readable question for the poll
  userHasVoted: boolean; // Whether the current user has voted
}
