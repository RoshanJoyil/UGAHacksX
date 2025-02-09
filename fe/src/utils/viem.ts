import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contract';
import type { Poll, ContractPoll } from './types';
import WalletConnectProvider from "@walletconnect/web3-provider";

// Create public and wallet clients
export const publicClient = createPublicClient({
  chain: sepolia, // Replace with your deployed chain
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: sepolia, // Replace with your deployed chain
  transport: http(),
});


// Create a poll with an IPFS hash (Admin-only)
export async function createAdminPoll(ipfsHash: string): Promise<`0x${string}`> {
  const [account] = await walletClient.requestAddresses();
  return await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "createAdminPoll",
    args: [ipfsHash],
    account,
  });
}

// Create a poll with an IPFS hash (User-level)

export async function createPoll(ipfsHash: string): Promise<`0x${string}`> {
  const [account] = await walletClient.requestAddresses();
  return await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "createPoll",
    args: [ipfsHash],
    account,
  });
}

// Vote on a poll
export async function voteOnPoll(
  pollId: number,
  optionIndex: number
): Promise<`0x${string}`> {
  const [account] = await walletClient.requestAddresses(); // Fetch the connected account
  return await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "vote",
    args: [pollId, optionIndex], // Pass the poll ID and option index
    account, // Specify the connected account
  });
}

// Close a poll (Admin only)

export async function closePoll(pollId: number): Promise<`0x${string}`> {
  const [account] = await walletClient.requestAddresses(); // Fetch the connected account
  return await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "closePoll",
    args: [pollId], // Pass the poll ID
    account, // Specify the connected account
  });
}

// Get the results of a poll

export async function getPollResults(pollId: number): Promise<number[]> {
  return (await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getResults",
    args: [pollId],
  })) as number[];
}

// Get the IPFS hash of a poll

export async function getPollIPFSHash(pollId: number): Promise<string> {
  return (await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPollIPFSHash",
    args: [pollId],
  })) as string;
}

// Get the total number of polls
export async function getPollCount(): Promise<number> {
  return Number(
    await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "pollCount",
    })
  );
}