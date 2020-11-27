// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./OpenBooks.sol";
import "./EnumerablePrices.sol";

contract BookShop is Ownable{
    using EnumerablePrices for EnumerablePrices.UintToUintMap;
    
    //activate Libraties
    using SafeMath for uint256;
    
    //state variables
    OpenBooks private openBooks;
    EnumerablePrices.UintToUintMap prices;
    mapping(address => uint) public balances;
    
    
    //modifiers
    modifier isOwner(uint _bookId){
        require(openBooks.ownerOf(_bookId) == _msgSender(), "BookShop: Not owner of book");
        _;    
    }
    modifier onSale(uint _bookId){
        require(prices.contains(_bookId), "BookShop: Not Listed");
        _;
    }
    
    //events
    event List(address owner, uint bookId, uint price);
    event DeList(address owner, uint bookId);
    event Buy(address owner, address buyer, uint bookId, uint price);
    event Withdraw(address sender, uint amount);
    
    
    constructor(OpenBooks _openBooks) public{
        require(address(_openBooks) != address(0));
        openBooks = _openBooks;
    }

    function getOpenBooks() external view onlyOwner returns(address){
        return address(openBooks);
    }
    
    function list(uint _bookId, uint _price) external isOwner(_bookId){
        _list(_bookId, _price);
    }
    
    function _list(uint _bookId, uint _price) private {
        require(_price != 0, "BookShop: Price cannot be zero");
        prices.set(_bookId, _price);
        emit List(_msgSender(), _bookId, _price);
    }
    
    function deList(uint _bookId)external isOwner(_bookId) onSale(_bookId){
        prices.remove(_bookId);
        emit DeList(_msgSender(), _bookId);   
    }
    
    
    function buy(uint _bookId) external payable onSale(_bookId){
        uint price = prices.get(_bookId);
        require( msg.value >= price, "BookShop: Price is higher");
        address owner = openBooks.ownerOf(_bookId);
        balances[owner] += price;
        
        emit Buy(owner, _msgSender(), _bookId, price);
    }
    
    
    function withdraw() external{
        address sender = _msgSender();
        uint balance = balances[sender];
        balances[sender] = 0;
        (bool success, ) = payable(address(sender)).call.value(balance)("");
        require(success);
        emit Withdraw(sender, balance);
    }
    
    
    function getPrice(uint _bookId) public view returns(uint price){
        price = prices.contains(_bookId) ? prices.get(_bookId) : 0;
    }
    

    function getPrices(uint[] memory _bookIds) public view returns(uint[] memory bookPrices){
        bookPrices = new uint[](_bookIds.length);

        for(uint i=0; i < _bookIds.length; i++){
            uint bookId = _bookIds[i];
            (openBooks.exists(bookId) && prices.contains(bookId)) ? 
                bookPrices[i] = prices.get(bookId) : 
                bookPrices[i] = 0;
        }        
    }
    
    function getBookURIs(uint[] memory _bookIds) public view returns(string memory URIs){
        for(uint i; i < _bookIds.length; i++){
            URIs = string(abi.encodePacked(URIs, " ", openBooks.tokenURI(_bookIds[i])));
        }
    }
    
    function getBookInfo(uint _bookId) public view returns(string memory URI, uint price){
        price = getPrice(_bookId);
        URI = openBooks.tokenURI(_bookId);
    }
    
    function getBooksInfo(uint[] memory _bookIds) public view returns(uint[] memory bookPrices, string memory URIs){
        bookPrices = getPrices(_bookIds);
        URIs = getBookURIs(_bookIds);
    }
    
    
    function getBooks(address _address) public view returns(
        uint[] memory bookIds,
        uint[] memory bookPrices,
        string memory URIs
    )
        {
        uint length = openBooks.balanceOf(_address);
        bookIds = new uint[](length);
        bookPrices = new uint[](length);
        for(uint i; i < length; i++){
            bookIds[i] = openBooks.tokenOfOwnerByIndex(_address, i);
            bookPrices[i] = getPrice(bookIds[i]);
            URIs = string(abi.encodePacked(URIs, " ", openBooks.tokenURI(bookIds[i])));
        }
    }
    
    
    function getAllBooksOnSale() public view returns(
        uint[] memory bookIds, 
        uint[] memory bookPrices,
        string memory URIs
    ){
        uint booksNo = prices.length();
        bookIds = new uint[](booksNo);
        bookPrices = new uint[](booksNo);
        
        for(uint i = 0; i < booksNo; i++){
            (uint bookId, uint price) = prices.at(i);
            (openBooks.exists(bookId)) ? 
                (bookIds[i], bookPrices[i], URIs) = (bookId, price, string(abi.encodePacked(URIs, " ", openBooks.tokenURI(bookId))) )  : 
                (bookIds[i], bookPrices[i], URIs) = (0, 0, string(abi.encodePacked(URIs, " ", "0" ))) ;
        }
    }
}