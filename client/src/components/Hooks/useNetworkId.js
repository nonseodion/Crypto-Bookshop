

const useNetworkId = (chainId) => {
  let networkIds = {"3": "3", "1337": "5777"}
  return networkIds[chainId];
};

export default useNetworkId;