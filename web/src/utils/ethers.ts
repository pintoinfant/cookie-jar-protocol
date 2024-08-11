import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useMemo } from "react";
import {
  createWalletClient,
  type Chain,
  type Client,
  type Transport,
} from "viem";
import { type Config, useClient } from "wagmi";

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  // const client = useClient<Config>({ chainId });
  const account = privateKeyToAccount(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  ) as unknown as `0x${string}`;
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });
  return useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  );
}
function privateKeyToAccount(arg0: string) {
  throw new Error("Function not implemented.");
}
