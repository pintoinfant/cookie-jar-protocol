const { contractAddresses } = require("../util/contract-addresses");

module.exports = async ({ getNamedAccounts, deployments, ethers, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const CookieJarProtocol = await ethers.getContractFactory(
    "CookieJarProtocol"
  );

  const args = [
    // IEAS eas, bytes32 _cookieJarSchemaEAS
    contractAddresses.EAS,
    "0xee7ffacde8a58a8e892d0becf595845ac78d8bc4823b4f96b2b939bce70c5804",
  ];

  const contract = await deploy("CookieJarProtocol", {
    from: deployer,
    args: args,
    log: true,
  });

  log(`CookieJarProtocol deployed at : ${contract.address}`);
};

module.exports.tags = ["cookiejarprotocol"];
