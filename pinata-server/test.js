import axios from "axios";
import "dotenv/config";

async function uploadPollToPinata(pollData) {
    const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        pollData,
        {
            headers: {
                pinata_api_key: process.env.PINATA_API,
                pinata_secret_api_key: process.env.PINATA_SECRET
            }
        }
    );
    return response.data.IpfsHash; // IPFS hash for the uploaded JSON
}

// Example usage
const pollData = {
    question: "What is your favorite ice cream flavor?",
    options: ["Chocolate", "Vanilla", "Strawberry", "Cookies and Cream"],
    createdBy: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: new Date().toISOString(),
};

async function main() {
    try {
        const ipfsHash = await uploadPollToPinata(pollData);
        console.log("Poll uploaded to IPFS with hash:", ipfsHash);
    } catch (error) {
        console.error("Error uploading poll to Pinata:", error.message);
    }
}

// Call the main function
main();
