import axios from "axios";
export const postToIpfs = async (data: any) => {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      pinataContent: data,
      pinataMetadata: { name: "WorldCoin attestation" },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YzNlOGIxYS0yZTI2LTRkNzUtOGQ0Yi1iMWRmNTUyOGJiYWEiLCJlbWFpbCI6ImZhYmlhbmZlcm5vQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiODliNTRlMmM4YmMxMmI3MjRhMiIsInNjb3BlZEtleVNlY3JldCI6IjI0Nzg3NWFmNDhhYWRkMjhjMGY3YjU0YzM4MTAzZjY3NjExYWIzNzdiMTI1Y2UwYWJlMmYwZWRmYzM0ZmJjZTQiLCJleHAiOjE3NTQ4OTM1NDN9.W4U_xGucoqeMaLn_pfc7Dmul7C9XJZlzZdq6QBAxcW8`,
      },
    }
  );
  return res.data.IpfsHash;
};
