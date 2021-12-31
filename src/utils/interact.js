require('dotenv').config();

var Web3 = require("web3");
let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);       
};


const contractABI = require('../contract-abi.json')
const contractAddress = "0xdd2089833cbf218114add359995954c6622d5a7c";

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
  

export const claimNFT = async(_mintQuantity) => {
  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddress); //loadContract();
  let _totalPrice = await window.contract.methods.price(_mintQuantity).call();

  //console.log(window.contract.options.jsonInterface);

  //sign transaction via Metamask
  try {
    const txHash = await window.contract.methods.mint(_mintQuantity).send({
      from: window.ethereum.selectedAddress,
      value: String(_totalPrice)
    });
    return {
      success: true,
      //status: "✅ Check out your transaction on BSCscan: https://testnet.bscscan.com/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      //status: "😥 Something went wrong: " + error.message
    }
  }
};