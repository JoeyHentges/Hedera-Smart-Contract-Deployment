// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract TestContract {
    address public owner;
    string public message;

    constructor(string memory _message) {
        owner = msg.sender;
        message = _message;
    }

    function setOwner(address newOwner) external {
        require(msg.sender == owner, "FORBIDDEN");
        owner = newOwner;
    }

    function setMessage(string memory _message) external {
        message = _message;
    }
}
