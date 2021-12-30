import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  claimNFT,
//  StyledRoundButton
//  mintNFT
} from "./utils/interact.js";

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;


const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [mintAmount, setMintAmount] = useState(1);  
 
  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setStatus(status);
    setWallet(address);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => { 
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
           setWallet(accounts[0]);
           setStatus("👆🏽 Write a message in the text-field above.");
         } else {
           setWallet("");
           setStatus("🦊 Connect to Metamask using the top right button.");
         }
       });
     } else {
       setStatus(
         <p>
           {" "}
           🦊{" "}
           <a target="_blank" href={`https://metamask.io/download.html`}>
             You must install Metamask, a virtual Ethereum wallet, in your
             browser.
           </a>
         </p>
       );
     }
   }

   const onMintPressed = async () => {
    const { status } = await claimNFT(mintAmount);
    setStatus(status);
  };
  
   const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };
  
  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  return (
     <div className="Minter">
       <button id="walletButton" onClick={connectWalletPressed}>
         {walletAddress.length > 0 ? (
           "Connected: " +
           String(walletAddress).substring(0, 6) +
           "..." +
           String(walletAddress).substring(38)
         ) : (
           <span>Connect Wallet</span>
         )}
       </button>

       <br></br>
       <h1 id="title">WicherVerse NFT Minter</h1>

      <StyledRoundButton
        style={{ lineHeight: 0.4 }}
//                        disabled={claimingNft ? 1 : 0}
        onClick={(e) => {
        e.preventDefault();
        decrementMintAmount();
      }}
      >
        -                  
      </StyledRoundButton>
      <s.SpacerMedium />
      <s.TextDescription
        style={{
          textAlign: "center",
          color: "var(--accent-text)",
        }}
        >
        {mintAmount}
        </s.TextDescription>
      <StyledRoundButton
//                        disabled={claimingNft ? 1 : 0}
        onClick={(e) => {
          e.preventDefault();
          incrementMintAmount();
        }}
        >
          +
        </StyledRoundButton>
        


      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
