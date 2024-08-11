export const cookieJarSubgraphUrl = (chainId: number) => {
  if (chainId === 11155420) {
    return "https://api.goldsky.com/api/public/project_clzphgane7fmt01v37dcxbj7t/subgraphs/cookiejar-base-sepolia/1.0.0/gn";
  } else if (chainId === 84532) {
    return "https://api.goldsky.com/api/public/project_clzphgane7fmt01v37dcxbj7t/subgraphs/cookiejar-optimism-sepolia/1.0.0/gn";
  }
  return "https://api.goldsky.com/api/public/project_clzphgane7fmt01v37dcxbj7t/subgraphs/cookiejar-optimism-sepolia/1.0.0/gn";
};

export const cookieJarAbi = [
  {
    inputs: [
      {
        internalType: "contract IEAS",
        name: "eas",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_cookieJarSchemaEAS",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidEAS",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "note",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
    ],
    name: "InitiateCCWithdrawal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
    ],
    name: "JarCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "OperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "sourceChainId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "targetChainId",
        type: "uint32",
      },
    ],
    name: "WithdrawalCCHandled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "note",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
    ],
    name: "WithdrawalCCRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "note",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "attestationUID",
        type: "bytes32",
      },
    ],
    name: "WithdrawalRequest",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "_requester",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "_sourceChainId",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "_targetChainId",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "_jarOwner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_jarBalance",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "_jarId",
            type: "bytes32",
          },
          {
            internalType: "uint16",
            name: "_noOfWithdrawals",
            type: "uint16",
          },
          {
            internalType: "contract IGovernor",
            name: "_daoGovernorAddress",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "_daoTokenAddress",
            type: "address",
          },
          {
            components: [
              {
                internalType: "string",
                name: "note",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "requester",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "attestationUID",
                type: "bytes32",
              },
            ],
            internalType: "struct CookieJarProtocol.CookieJarWithdrawal[]",
            name: "_withdrawals",
            type: "tuple[]",
          },
        ],
        internalType: "struct CookieJarProtocol.CompleteCCWithdrawalCallData",
        name: "_data",
        type: "tuple",
      },
    ],
    name: "completeCCWithdrawal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cookieJarSchemaEAS",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_daoTokenAddress",
        type: "address",
      },
      {
        internalType: "contract IGovernor",
        name: "_daoGovernorAddress",
        type: "address",
      },
    ],
    name: "createJar",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jarId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getJarShareOfUser",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jarId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getJarShareOfUserInPercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jarId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_requester",
        type: "address",
      },
      {
        internalType: "string",
        name: "_note",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "_chainId",
        type: "uint32",
      },
    ],
    name: "initiateCCWithdrawal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "jarIdToCookieJar",
    outputs: [
      {
        internalType: "bytes32",
        name: "jarId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "daoTokenAddress",
        type: "address",
      },
      {
        internalType: "contract IGovernor",
        name: "daoGovernorAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "jarBalance",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "noOfWithdrawals",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockedFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jarId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_note",
        type: "string",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jarId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_note",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "_chainId",
        type: "uint32",
      },
    ],
    name: "withdrawCC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const cookieJarContractAddress = (chainId: number) => {
  if (chainId === 11155420) {
    return "0xA0b3Fa18a089F8bff398Fe8B83B8aC97DFF90548";
  } else if (chainId === 84532) {
    return "0x0810b2d3c23d7207c6b15fb6b3303e99561cb80f";
  }
  return "0x0810b2d3c23d7207c6b15fb6b3303e99561cb80f";
};
