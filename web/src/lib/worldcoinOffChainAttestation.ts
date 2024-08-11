import { SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

// function convertBigIntToString(obj: any): any {
//   // Check if the current object is an array
//   if (Array.isArray(obj)) {
//     return obj.map((item) => convertBigIntToString(item));
//   }
//   // Check if the current object is an object
//   else if (typeof obj === "object" && obj !== null) {
//     return Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [
//         key,
//         convertBigIntToString(value),
//       ])
//     );
//   }
//   // Convert BigInt to string
//   else if (typeof obj === "bigint") {
//     return obj.toString();
//   }
//   // Return the value if it is neither an object, an array, nor a BigInt
//   else {
//     return obj;
//   }
// }

function convertBigIntToString(obj: any, currentKey = ""): any {
  // Check if the current object is an array
  if (Array.isArray(obj)) {
    return obj.map((item, index) =>
      convertBigIntToString(item, `${currentKey}[${index}]`)
    );
  }
  // Check if the current object is an object
  else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value, key),
      ])
    );
  }
  // Convert BigInt to string and log the conversion
  else if (typeof obj === "bigint") {
    console.log(
      `Converting BigInt at key: "${currentKey}" with value: ${obj.toString()}`
    );
    return obj.toString();
  }
  // Return the value if it is neither an object, an array, nor a BigInt
  else {
    return obj;
  }
}

export const offchainAttestation = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask!");
    return;
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();
  // Check if the user is on the correct network (Optimism Sepolia)
  const network = await provider.getNetwork();
  const optimismSepoliaChainId = 84532;

  if (BigInt(network.chainId) !== BigInt(optimismSepoliaChainId)) {
    alert("Please switch to the base Sepolia network.");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.toBeHex(optimismSepoliaChainId) }],
    });
  }

  const easContractAddress = "0x4200000000000000000000000000000000000021";

  const schemaUID =
    "0x8af15e65888f2e3b487e536a4922e277dcfe85b4b18187b0cf9afdb802ba6bb6";
  const eas = new EAS(easContractAddress);
  eas.connect(signer);
  const offchain = await eas.getOffchain();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("bool isHuman");
  const encodedData = schemaEncoder.encodeData([
    { name: "isHuman", value: false, type: "bool" },
  ]);

  const currenttime = Math.floor(Date.now() / 1000);
  //add one min with current time stamp to make it expire in 1 min
  const expirationTime = currenttime + 60;
  console.log(currenttime);

  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      recipient: walletAddress,
      // Unix timestamp of when attestation expires. (0 for no expiration)
      expirationTime: BigInt(0),
      time: BigInt(currenttime),
      revocable: true,
      nonce: BigInt(0),
      schema: schemaUID,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
    },
    signer
  );
  console.log(offchainAttestation);
  const attestation = {
    sig: convertBigIntToString(offchainAttestation),
    signer: walletAddress,
  };
  return attestation;
};
