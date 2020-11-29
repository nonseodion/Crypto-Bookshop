// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A storage for book rights
/// @author Ifebhor Odion Nonse
/// @notice This contract is used to mint the rights to a book 
/// in form of a token which can then be sold on a marketplace
/// @dev this is an ERC721 token
contract OpenBooks is Ownable, ERC721("OpenBooks", "OPB"){

    /// @notice Initializes the contract
    /// @dev sets the _baseURI
    /// @param _baseURI the string to be stored as _baseURI.  
    constructor(string memory _baseURI) public{
        _setBaseURI(_baseURI);
    }

    /// @notice Creates a new book 
    /// @dev mints a book with a unique a id
    /// @param _tokenURI the URI of the books image
    function mint(string calldata _tokenURI) external{
        uint tokenId = totalSupply().add(1);
        _safeMint(msg.sender, tokenId, "");
        _setTokenURI(tokenId, _tokenURI);
    }
    
    /// @notice Destroys a book
    /// @dev removes the books id from the list and sends to a zero address
    /// @param _tokenId the id of the book to be burnt
    function burn(uint _tokenId) external{
        _burn(_tokenId);
    }
    
    /// @notice Used to check if a book  with an id exists
    /// @param _tokenId the id of the book to be checked
    /// @return a boolean, "true" if it exists and "false" if it doesn't
    function exists(uint _tokenId) external view returns(bool){
        return _exists(_tokenId);
    }

    /// @notice Changes the _baseURI to one supplied
    /// @dev can only be called by the contract's owner    
    /// @param _baseURI the new _baseURI
    function setBaseURI(string calldata _baseURI)  external onlyOwner{
        _setBaseURI(_baseURI);
    }
}