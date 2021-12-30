//import styled from "styled-components";

// import {pinJSONToIPFS} from './pinata.js'
require('dotenv').config();
var Web3 = require("web3");
// //const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// //const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// //const web3 = createAlchemyWeb3(alchemyKey);


// //let web3;
// //if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
// //  //window.web3 = new Web3(window.ethereum);
// //  web3 = new Web3(window.web3.currentProvider);
// //}
let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);       
};


const contractABI = require('../contract-abi.json')
const contractAddress = "0x1661A42c6FFFe067783cf7513e2E02F9Aebf5cEA";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        address: addressArray[0],
        status: "👆🏽 Write a message in the text-field above.",
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
           🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
     if (window.ethereum) {
       try {
         const addressArray = await window.ethereum.request({
           method: "eth_accounts",
         });
         if (addressArray.length > 0) {
           return {
             address: addressArray[0],
             status: "👆🏽 Write a message in the text-field above.",
           };
         } else {
           return {
             address: "",
             status: "🦊 Connect to Metamask using the top right button.",
           };
         }
       } catch (err) {
         return {
           address: "",
           status: "😥 " + err.message,
         };
       }
     } else {
       return {
         address: "",
         status: (
           <span>
             <p>
               {" "}
               🦊{" "}
               <a target="_blank" href={`https://metamask.io/download.html`}>
                 You must install Metamask, a virtual Ethereum wallet, in your
                 browser.
               </a>
             </p>
           </span>
         ),
       };
     }
};

//   export const mintNFT = async(url, name, description) => {

//     //error handling
//     if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) { 
//         return {
//             success: false,
//             status: "❗Please make sure all fields are completed before minting.",
//         }
//     }

//     //make metadata
//     const metadata = new Object();
//     metadata.name = name;
//     metadata.image = url;
//     metadata.description = description;

//     //pinata pin request
//     const pinataResponse = await pinJSONToIPFS(metadata);
//     if (!pinataResponse.success) {
//         return {
//             success: false,
//             status: "😢 Something went wrong while uploading your tokenURI.",
//         }
//     } 
//     const tokenURI = pinataResponse.pinataUrl;  

//     //load smart contract
//     window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

//     //set up your Ethereum transaction
//     const transactionParameters = {
//         to: contractAddress, // Required except during contract publications.
//         from: window.ethereum.selectedAddress, // must match user's active address.
//         'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
//     };

//     //sign transaction via Metamask
//     try {
//         const txHash = await window.ethereum
//             .request({
//                 method: 'eth_sendTransaction',
//                 params: [transactionParameters],
//             });
//         return {
//             success: true,
//             status: "✅ Check out your transaction on BSCscan: https://bscscan.com/tx/" + txHash
//         }
//     } catch (error) {
//         return {
//             success: false,
//             status: "😥 Something went wrong: " + error.message
//         }
//     }
// }

export const claimNFT = async(_mintAmount) => {
  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddress); //loadContract();

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    //'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
    'data': window.contract.methods.mint(window.ethereum.selectedAddress, _mintAmount).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "✅ Check out your transaction on BSCscan: https://bscscan.com/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
};