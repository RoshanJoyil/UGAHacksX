import axios from "axios";

const PINATA_API_KEY = "b75ab6fa44ee82062f0e";
const PINATA_SECRET_API_KEY = "c1565aa5bf817ad63d6bcee96289f7b0bc6acaf4591025e07feb2216be1d1f93";

interface PollData {
  title: string;
  options: string[];
}

export const uploadToPinata = async (pollData: PollData): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      pollData,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
};