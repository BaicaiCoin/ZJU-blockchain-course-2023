// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./CarToken.sol";

contract BorrowYourCar {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint32 carTokenId, address borrower, uint256 startTime, uint256 duration);

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information
    // ...
    // TODO add any variables if you want
    uint256 public carNum = 10;
    CarToken public carToken;

    constructor() {
        carToken = new CarToken();
        cars[0].owner = 0x390B4c4cd89f590a7B112F7447901A84B9Bf99C5;
        cars[1].owner = 0x390B4c4cd89f590a7B112F7447901A84B9Bf99C5;
        cars[2].owner = 0x390B4c4cd89f590a7B112F7447901A84B9Bf99C5;
        cars[3].owner = 0xc8d4f226ec00Fa7794E86fa4B9913e4515ca08cA;
        cars[4].owner = 0xc8d4f226ec00Fa7794E86fa4B9913e4515ca08cA;
        cars[5].owner = 0xc8d4f226ec00Fa7794E86fa4B9913e4515ca08cA;
        cars[6].owner = 0xc8d4f226ec00Fa7794E86fa4B9913e4515ca08cA;
        cars[7].owner = 0x6385585f59A32867568C42127cC8c620a7A64228;
        cars[8].owner = 0x6385585f59A32867568C42127cC8c620a7A64228;
        cars[9].owner = 0x6385585f59A32867568C42127cC8c620a7A64228;
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    function borrowCar(uint32 carTokenId, address borrower, uint256 duration, uint256 price) public payable {
        require(borrower != cars[carTokenId].owner, "You can't borrow your own car!");
        require(cars[carTokenId].borrower == address(0) || cars[carTokenId].borrowUntil < block.timestamp, "The car can't be borrowed");
        cars[carTokenId].borrower = borrower;
        uint256 startTime = block.timestamp;
        cars[carTokenId].borrowUntil = startTime + duration;
        emit CarBorrowed(carTokenId, borrower, startTime, duration);
        carToken.transferFrom(msg.sender, cars[carTokenId].owner, price);
    }

    function getBorrower(uint32 carTokenId) public view virtual returns(address) {
        if(cars[carTokenId].borrowUntil >= block.timestamp) {
            return cars[carTokenId].borrower;
        }
        else return address (0);
    }

    function getUserBorrowUntil(uint32 carTokenId) public view virtual returns(uint256) {
        return cars[carTokenId].borrowUntil;
    }

    function getOwner(uint32 carTokenId) public view virtual returns(address) {
        return cars[carTokenId].owner;
    }

    function getOwnedCar(address owner) public view virtual returns(uint32[] memory, uint256) {
        uint32[] memory ownedCar = new uint32[](carNum);
        uint256 ownedCarNum = 0;
        for(uint32 i=0;i<carNum;i++) {
            if(cars[i].owner == owner) {
                ownedCar[ownedCarNum] = i;
                ownedCarNum++;
            }
        }
        return (ownedCar, ownedCarNum);
    }

    function getAvailableCar() public view virtual returns(uint32[] memory, uint256) {
        uint32[] memory availableCar = new uint32[](carNum);
        uint256 availableCarNum = 0;
        for(uint32 i=0;i<carNum;i++) {
            if(cars[i].borrower == address(0) || cars[i].borrowUntil < block.timestamp) {
                availableCar[availableCarNum] = i;
                availableCarNum++;
            }
        }
        return (availableCar, availableCarNum);
    }

    function getCarInfo(uint32 carTokenId) public view virtual returns(address, address, uint256) {
        return (cars[carTokenId].owner, cars[carTokenId].borrower, cars[carTokenId].borrowUntil);
    }
}