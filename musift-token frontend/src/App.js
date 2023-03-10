import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import musifyContract from "./faucet";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [faucetContract, setfaucetContract] = useState();

  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transHash, setTransHash] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const accounts = await provider.send("eth_requestAccounts", []);

        setSigner(provider.getSigner());

        setfaucetContract(musifyContract(provider));

        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.reason);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const accounts = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
          setSigner(provider.getSigner());

          setfaucetContract(musifyContract(provider));
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.reason);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getMusicToken = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const faucetContractWithSigner = faucetContract.connect(signer);
      const resp = await faucetContractWithSigner.requestTokens();
      console.log(resp);
      setWithdrawSuccess("Tokens Transferred to your account");
      setTransHash(resp.hash);
    } catch (err) {
      console.error(err.reason);
      setWithdrawError(err.reason);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Musify Token</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button  connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Muscify Faucet</h1>
            <p>Get 1 Music Token / 6 Hours</p>
            <div className="mt-5 popup">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={getMusicToken}
                  >
                    FAUCET
                  </button>
                </div>
              </div>

              <article className="panel is-grey-darker">
                <p className="panel-heading">Hash Data</p>
                <div className="panel-block">
                  <p>{transHash ? `Transaction Hash : ${transHash}` : "--"}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
