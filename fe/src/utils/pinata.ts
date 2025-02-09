import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET;

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