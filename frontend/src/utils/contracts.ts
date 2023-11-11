import address from './contract-address.json'
import BorrowYourCar from './abis/BorrowYourCar.json'
import CarToken from './abis/CarToken.json'

const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const borrowYourCarAddress = address.BorrowYourCar;
const carTokenAddress = address.CarToken;
const borrowYourCarABI = BorrowYourCar.abi;
const carTokenABI = CarToken.abi;



const borrowYourCarContract = new web3.eth.Contract(borrowYourCarABI, borrowYourCarAddress);
const carTokenContract = new web3.eth.Contract(carTokenABI, carTokenAddress);

export {web3, borrowYourCarContract, carTokenContract}