import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export async function createAttestation(firstAttestationUID: string, upvoted: boolean) {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask!');
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();
    // Check if the user is on the correct network (Optimism Sepolia)
    const network = await provider.getNetwork();
    const optimismSepoliaChainId = 11155420;

    if (BigInt(network.chainId) !== BigInt(optimismSepoliaChainId)) {
      alert('Please switch to the Optimism Sepolia network.');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toBeHex(optimismSepoliaChainId) }],
      });
    }

    const eas = new EAS("0x4200000000000000000000000000000000000021"); 
    eas.connect(signer);

    const schemaUID = '0x761a985431e4d67486c6595e4a5c220fc99e84f76d9525ee3e8f776580894ccd';
    const schemaEncoder = new SchemaEncoder('bool upvoted');
    const encodedData = schemaEncoder.encodeData([
      { name: 'upvoted', value: upvoted, type: 'bool' }
    ]);

    const transaction = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: walletAddress,
        expirationTime: BigInt(0),
        revocable: true,
        refUID: firstAttestationUID,
        data: encodedData
      }
    });

    const receipt = await transaction.wait();
    console.log('Second attestation UID:', receipt);

    alert(`Attestation successful! Transaction Hash: ${receipt}`);
  } catch (error) {
    console.error('Error creating attestation:', error);
    alert('Failed to create attestation.');
  }
}
