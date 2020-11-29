// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./OpenBooks.sol";
import "./EnumerablePrices.sol";

//Pausable Contract
/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event WithdrawPaused(address account);
    event BuyPaused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event WithdrawUnpaused(address account);
    event BuyUnpaused(address account);
    
    bool private _buyPaused;
    bool private _withdrawPaused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor () internal {
        _buyPaused = false;
        _withdrawPaused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function withdrawPaused() public view returns (bool) {
        return _withdrawPaused;
    }
    
    function buyPaused() public view returns (bool) {
        return _buyPaused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenBuyNotPaused() {
        require(!_buyPaused, "Pausable: Buy paused");
        _;
    }
    
    modifier whenWithdrawNotPaused() {
        require(!_withdrawPaused, "Pausable: Withdraw paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenBuyPaused() {
        require(_buyPaused, "Pausable: Buy not paused");
        _;
    }
    
    modifier whenWithdrawPaused() {
        require(_withdrawPaused, "Pausable: Withdraw not paused");
        _;
    }

       /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pauseBuy() internal virtual whenBuyNotPaused {
        _buyPaused = true;
        emit BuyPaused(_msgSender());
    }
    
    function _pauseWithdraw() internal virtual whenWithdrawNotPaused {
        _withdrawPaused = true;
        emit WithdrawPaused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unPauseWithdraw() internal virtual whenWithdrawPaused {
        _withdrawPaused = false;
        emit WithdrawUnpaused(_msgSender());
    }
    
    function _unPauseBuy() internal virtual whenBuyPaused {
        _buyPaused = false;
        emit BuyUnpaused(_msgSender());
    }
}



//BookShop Contract

/// @title A BookShop
/// @author Ifebhor Odion Nonse
/// A marketplace for selling books on the OpenBooks contract
/// @dev communicates with the OpenBook contract for ownership proof,
/// keeps a record of books for sale and does not transfer books, buyers download
contract BookShop is Ownable, Pausable{
    
    /// activate Libraties
    using SafeMath for uint256;
    using EnumerablePrices for EnumerablePrices.UintToUintMap;
    
    /// state variables
    OpenBooks private openBooks;
    /// An enumarable list of book ids mapped to their prices
    EnumerablePrices.UintToUintMap prices;
    /// @return the number of books owned by an address
    mapping(address => uint) public balances;
    
    
    /// modifiers
    modifier isOwner(uint _bookId){
        require(openBooks.ownerOf(_bookId) == _msgSender(), "BookShop: Not owner of book");
        _;    
    }
    modifier onSale(uint _bookId){
        require(prices.contains(_bookId), "BookShop: Not Listed");
        _;
    }
    
    /// events
    event List(address indexed owner, uint indexed bookId, uint price);
    event DeList(address indexed owner, uint indexed bookId);
    event Buy(address indexed owner, address indexed buyer, uint indexed bookId, uint price);
    event Withdraw(address indexed sender, uint indexed amount);
    
    
    /// Initializes the contract 
    /// @dev stores the address of the contract holding the books
    /// @param _openBooks the address of the contract holding the books, 
    /// it cannot be zero
    constructor(OpenBooks _openBooks) public{
        require(address(_openBooks) != address(0));
        openBooks = _openBooks;
    }

    /// Used to get the address of the contract holding the books
    function getOpenBooks() external view onlyOwner returns(address){
        return address(openBooks);
    }
    
    /// Used to put a book up for sale
    /// @dev the book's id and its price are added to the enumerable prices
    /// @param _bookId the id of the book to be listed
    /// @param _price the price to be sold for, it cannot be zero
    function list(uint _bookId, uint _price) external isOwner(_bookId){
        _list(_bookId, _price);
    }
    
    function _list(uint _bookId, uint _price) private {
        require(_price != 0, "BookShop: Price cannot be zero");
        prices.set(_bookId, _price);
        emit List(_msgSender(), _bookId, _price);
    }
    
    /// Used to remove a book from sale
    /// @dev removes a book's id from the enumerable prices list
    /// @param _bookId the id of the book to be removed from sale, it must be on sale
    function deList(uint _bookId)external isOwner(_bookId) onSale(_bookId){
        prices.remove(_bookId);
        emit DeList(_msgSender(), _bookId);   
    }
    
    /// Lets a buyer pay for the book with at least the specified price
    /// @dev lets a buyer download the book after successful payment
    /// the transaction's value must not be less than the books price
    /// @param _bookId the bookId to be bought
    function buy(uint _bookId) external payable onSale(_bookId) whenBuyNotPaused{
        uint price = prices.get(_bookId);
        require( msg.value >= price, "BookShop: Price is higher");
        address owner = openBooks.ownerOf(_bookId);
        balances[owner] += price;
        
        emit Buy(owner, _msgSender(), _bookId, price);
    }
    
    /// Allows anyone withthdraw their proceeds from book sales
    /// @dev can be called by anyone and they are given all of their 
    /// balance in balances withdrawals must not be paused 
    function withdraw() external whenWithdrawNotPaused{
        address sender = _msgSender();
        uint balance = balances[sender];
        balances[sender] = 0;
        (bool success, ) = payable(address(sender)).call.value(balance)("");
        require(success);
        emit Withdraw(sender, balance);
    }
    
    /// Used to get the price of a book on sale
    /// @param _bookId the book's price needed
    /// @return price the price of the book on sale, it's zero if the book is not on sale
    function getPrice(uint _bookId) public view returns(uint price){
        price = prices.contains(_bookId) ? prices.get(_bookId) : 0;
    }
    
    /// Gets the price of a list of book ids
    /// @param _bookIds an array of bookids
    /// @return bookPrices an array of the price of each book in its corresponding index in _bookIds
    function getPrices(uint[] memory _bookIds) public view returns(uint[] memory bookPrices){
        bookPrices = new uint[](_bookIds.length);

        for(uint i=0; i < _bookIds.length; i++){
            uint bookId = _bookIds[i];
            (openBooks.exists(bookId) && prices.contains(bookId)) ? 
                bookPrices[i] = prices.get(bookId) : 
                bookPrices[i] = 0;
        }        
    }
    
    /// Gets the URIs of a list of books
    /// @param _bookIds an array of bookids
    /// @return URIs a string of URIs with each URI separated by a " "
    function getBookURIs(uint[] memory _bookIds) public view returns(string memory URIs){
        for(uint i; i < _bookIds.length; i++){
            URIs = string(abi.encodePacked(URIs, " ", openBooks.tokenURI(_bookIds[i])));
        }
    }
    
    /// Gets the URI and price of a book
    /// @param _bookId the id of the book whose information is needed
    /// @return URI the URI of _bookId
    /// @return price the price of _bookId
    function getBookInfo(uint _bookId) public view returns(string memory URI, uint price){
        price = getPrice(_bookId);
        URI = openBooks.tokenURI(_bookId);
    }

    /// Gets the URI and the price of a list of books
    /// @dev calls getPrices and getBookURIs
    /// @param _bookIds the ids of the books which their information is needed
    /// @return bookPrices an array of the price of each book in it's corresponding index in _bookIds
    /// @return URIs a string of URIs with each URI separated by a " "
    function getBooksInfo(uint[] memory _bookIds) public view returns(uint[] memory bookPrices, string memory URIs){
        bookPrices = getPrices(_bookIds);
        URIs = getBookURIs(_bookIds);
    }
    
    /// Gets all the bookIds, bookPrices, and URIs of books owned by an address
    /// Each index in the return values except URIs contain the information of a single book
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
    
    /// Gets all the books on sale
    /// @dev iterates through prices to get all the books
    /// @return bookIds the ids of all books on sale
    /// @return bookPrices the prices of all books on sale
    /// @return URIs the URIs of all the books on sale 
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

    /// Pauses the buy function and is only callable by the contract owner
    function pauseBuy() onlyOwner external{
        _pauseBuy();
    }
    
    /// Pauses the withdraw function and is only callable by the contract owner
    function pauseWithdraw() onlyOwner external{
        _pauseWithdraw();
    }
    
    /// Unpauses the buy function and is only callable by the contract owner
    function unPauseBuy() onlyOwner external{
        _unPauseBuy();
    }
    
    /// Unpauses the withdraw function and is only callable by the contract owner
    function unPauseWithdraw() onlyOwner external{
        _unPauseWithdraw();
    }
}