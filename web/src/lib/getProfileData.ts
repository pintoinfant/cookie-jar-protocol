import { init, fetchQuery } from "@airstack/node";

export const getProfileData = async (fid: string) => {
  init("1f9e41f9f56744c71a61d1cb98fed31cd");
  const query = `query MyQuery {
  Socials(
    input: {
      filter: { dappName: { _eq: farcaster }, identity: { _eq: "fc_fid:${fid}" } }
      blockchain: ethereum
    }
  ) {
    Social {
      id
      chainId
      blockchain
      dappName
      dappSlug
      dappVersion
      userId
      userAddress
      userCreatedAtBlockTimestamp
      userCreatedAtBlockNumber
      userLastUpdatedAtBlockTimestamp
      userLastUpdatedAtBlockNumber
      userHomeURL
      userRecoveryAddress
      userAssociatedAddresses
      profileBio
      profileDisplayName
      profileImage
      profileUrl
      profileName
      profileTokenId
      profileTokenAddress
      profileCreatedAtBlockTimestamp
      profileCreatedAtBlockNumber
      profileLastUpdatedAtBlockTimestamp
      profileLastUpdatedAtBlockNumber
      profileTokenUri
      isDefault
      identity
      fnames
    }
  }
}
`;

  const { data, error } = await fetchQuery(query);
  if (!error) {
    return data;
  } else {
    return error;
  }
};
