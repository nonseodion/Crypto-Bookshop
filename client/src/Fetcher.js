import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";

const Fetcher = (library, abi) => (...args) => {
  const [arg1, arg2, ...params] = args;
  
  if(isAddress(arg1)){
    const address = arg1;
    const method = arg2;
    const contract = new Contract(address, abi, library.getSigner());
    return contract[method](...params);
  }

  const method = arg1;
  return library[method](arg2, ...params);
}

export default Fetcher;