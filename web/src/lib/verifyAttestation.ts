import {
  OffchainAttestationVersion,
  Offchain,
  OffchainConfig,
  EAS,
} from "@ethereum-attestation-service/eas-sdk";

function convertStringToBigInt(
  obj: any,
  keysToConvert: string[] = [],
  fileName: string = "",
  lineNumber: number = 0
): any {
  // Check if the current object is an array
  if (Array.isArray(obj)) {
    return obj.map((item: any) =>
      convertStringToBigInt(item, keysToConvert, fileName, lineNumber)
    );
  }
  // Check if the current object is an object
  else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (keysToConvert.includes(key) && typeof value === "string") {
          return [key, BigInt(value)];
        } else {
          return [
            key,
            convertStringToBigInt(value, keysToConvert, fileName, lineNumber),
          ];
        }
      })
    );
  }
  // Return the value if it is neither an object, an array, nor a relevant string
  else {
    return obj;
  }
}

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0x8af15e65888f2e3b487e536a4922e277dcfe85b4b18187b0cf9afdb802ba6bb6";
const eas = new EAS(easContractAddress);

export const verifyOffchainAttestation = async (attestation: any) => {
  try {
    const EAS_CONFIG: OffchainConfig = {
      address: attestation.sig.domain.verifyingContract,
      version: attestation.sig.domain.version,
      chainId: BigInt(attestation.sig.domain.chainId),
    };
    const offchain = new Offchain(
      EAS_CONFIG,
      OffchainAttestationVersion.Version2,
      eas
    );
    const isValidAttestation = offchain.verifyOffchainAttestationSignature(
      attestation.signer,
      convertStringToBigInt(attestation.sig)
    );
    console.log(isValidAttestation);
    return isValidAttestation;
  } catch (error) {
    console.log(error);
  }
};
