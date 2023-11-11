import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x97c735041e1ddb1b14e02b3b608859047283137739fe7f9024486a4f6f6f5e54',
        '0x8059368eb0cf7085e0cac84cebcc2b9848bf89130f407f90aa173e24c7ad1c9f',
        '0x3085f745889521497d6096316e1cd1fc04c5749fc28342b5e31aeaade8cc27f2',
        '0x847929f7a4689415233cd8481c9de071026c12cf22556fae815d3980b4b1ecd1',
        '0xc9c7a253d67e3f9927cbdd9fd3eca4e742ae5922a9cc37024680411fa04efa1c',
        '0x85fe24c7d38bf557670138895434764a9f87925dead7af90adf9bb46f74583fd',
        '0x08cbc0036c3ca8c71520ba16f4463ca5887623e4dd9d208c5f2460a3357128db',
        '0x91c5c20ae09d16fa1a4fdf3cf7b521cc19283aa0b8e1d74cb9f5054e51177ca9',
        '0xf1d5b62b775b7d2c8a65cf7ae2ff4b39e184765e31b9374ae68a56b4759cc45c',
        '0x9040392c222b1d924807ceac6d1fdd261572332c2d22cb87b722fbeeb52318c9'

      ]
    },
  },
};

export default config;
