// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenBooks is Ownable, ERC721("OpenBooks", "OPB"){
    
    constructor(string memory _baseURI) public{
        _setBaseURI(_baseURI);
    }
    
    function mint(string calldata _tokenURI) external{
        uint tokenId = totalSupply().add(1);
        _safeMint(msg.sender, tokenId, "");
        _setTokenURI(tokenId, _tokenURI);
    }
    
    function burn(uint _tokenId) external{
        _burn(_tokenId);
    }
    
    function exists(uint _tokenId) external view returns(bool){
        return _exists(_tokenId);
    }
    
    function setBaseURI(string calldata _baseURI)  external onlyOwner{
        _setBaseURI(_baseURI);
    }
}