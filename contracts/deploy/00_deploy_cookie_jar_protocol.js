const contractAddresses = {
  optimism_sepolia: {
    easContract: "0x4200000000000000000000000000000000000021",
  },
};

module.exports = async ({ getNamedAccounts, deployments, ethers, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const CookieJarProtocol = await ethers.getContractFactory(
    "CookieJarProtocol"
  );

  const args = [
    // IEAS eas, bytes32 _cookieJarSchemaEAS
    contractAddresses[network.name].easContract,
    "0x99f9fd4bdbcb8bc87353725f28afbbfb4299b6ad0c67471077e089d8e4c6f25d",
    "0x77FC2336f8d077Fa42BDBF8a11cfe0d0F5330c69",
  ];

  const contract = await deploy("CookieJarProtocol", {
    from: deployer,
    args: args,
    log: true,
  });

  log(`CookieJarProtocol deployed at : ${contract.address}`);
};

module.exports.tags = ["cookiejarprotocol"];
