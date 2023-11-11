// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarToken is ERC20 {
    mapping(address => bool) isIssue;
    constructor() ERC20("Car Token", "CT") {
    }
    function airdrop() external {
        require(isIssue[msg.sender] == false, "You has already get initial token!");
        isIssue[msg.sender] = true;
        _mint(msg.sender, 10000*(10**decimals()));
    }
}