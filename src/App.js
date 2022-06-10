import { useState, useEffect } from 'react'
import './App.css';
import { NftProvider, useNft } from "use-nft"
import { ethers } from "ethers"
import ABI from './abi.json'
import { client, mattProfile } from './api.js'
import lens from './lens.svg'

const NODE_URL = "https://polygon-mainnet.infura.io/v3/16d61f60c62c4eb299702b36db84e499";
const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

function App() {
  // set state
  const [currentAccount, setCurrentAccount] = useState('');
  const [isStani, setIsStani] = useState(false);
  const [profile, setProfile] = useState([])
  const stani = "0x2E21f5d32841cf8C7da805185A041400bF15f21A";
  // const stani = "0x8F952F26d6F256661b86d822648fe62B59c4E691";
  const staniLower = stani.toLowerCase();

  const { id } = '0x2880';

  useEffect(() => {
    fetchProfile()
  })

  async function fetchProfile(){
    try {
      const response = await client.query(mattProfile, { id }).toPromise()
      console.log(response)
      setProfile(response.data.profiles.items[0])
    } catch (err) {
      console.log('error fetching profile', err)
    }
  }

  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      const account = accounts[0];
      const accountLower = account.toLowerCase();
      setCurrentAccount(accountLower);
      if (accounts[0] === staniLower) {
        setIsStani(true)
      } else {
        console.log("They don't match")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Users can have multiple authorized accounts, we grab the first one.
    if (accounts.length !== 0) {
      const account = accounts[0];
      const accountLower = account.toLowerCase();
      console.log('Found an authorized account:', account);
      setCurrentAccount(accountLower);
      if (accounts[0] === staniLower) {
        setIsStani(true)
      } else {
        console.log("They don't match")
      }
    } else {
      console.log('No authorized account found');
    }
  };

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className='profile-box contents-container'>
      <img src={lens} alt="lens" style={{
                width: 60,
                height: 100,
            }}/>
      <p className='profile-text info'>If you think you are Stani, and are the owner of Stani's Lens profile, sign in with Polygon Mainnet.</p>
      <button onClick={connectWallet} className='cta-button mint-button'>
        Connect Wallet
      </button>
      <p className='profile-text info'>If you have issues reading the message (and think you are Stani), please reach out @<a href="https://t.me/mattbrc" target="_blank">mattbrc</a> on telegram</p>
    </div>
  );

  const renderWelcome = () => (
    <div className='profile-image profile-box contents-container'>
      <a href="https://www.lensfrens.xyz/mattbrc.lens" className='profile-button'>
          <button className='cta-button mint-button'>
            @{profile.handle}
          </button>
        </a> 
      {
        profile.picture && profile.picture.original ? (
            <img src={profile.picture.original.url} alt="" style={{
                width: 105,
                height: 150,
                borderRadius: 25,
            }}/>
        ) : (
            <div style={{ width: '200px', height: '200px', backgroundColor: 'black' }}/>
        )
      }
      <div className='profile-box contents-container'>
        <p className='profile-text info'>{profile.bio}</p>
        <p className='profile-text info'>#{profile.id}</p>
        <p className='profile-text info'>Stani, welcome. Only you can view this as it is tied to your public key and Lens NFT Token ID</p>
        <p className='profile-text info'>The above information has been queried using the Lens Social Graph from my Lens account when you connected your wallet</p>
        <p className='profile-text info'>I would love to discuss the DevRel role with you more! Please reach out to me @<a href="https://t.me/mattbrc" target="_blank">mattbrc</a> on telegram or on twitter @<a href="https://twitter.com/matt_brc" target="_blank">matt_brc</a>. 
        You can find more about me on <a href="https://github.com/mattbrc" target="_blank">Github</a>⚡️</p>
      </div>
    </div>
  );

  const renderNotWelcome = () => (
    <div className='profile-box contents-container'>
      <p className='profile-text info'>You are not Stani</p>
      <p className='profile-text info'>If you think you are Stani, please ensure you logged in with Polygon mainnet and the account you hold your Lens NFT for the account @stani.lens</p>
      <p className='profile-text info'>If you continue to have issues (and think you are Stani), please reach out to me @<a href="https://t.me/mattbrc" target="_blank">mattbrc</a> on telegram</p>
    </div>
  );

  function Nft() {
    const { loading, error, nft } = useNft(
      "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
      "10368"
    )
    // nft.loading is true during load.
    if (loading) return <>Loading…</>
    // nft.error is an Error instance in case of error.
    if (error || !nft) return <>Error.</>
    // You can now display the NFT metadata.
    return (
      <section>
        <h1>{nft.name}</h1>
        <img src={nft.image} alt="" />
        <p>{nft.description}</p>
        <p>Owner: {nft.owner}</p>
        <p>{nft.metadataUrl}</p>
      </section>
    )
  }
// 0x01fc = 508
  function HexToDec() {
    const hexString = "0x01fc"
    const dec = parseInt(hexString, 16);
    return (
      <div>
        <p>{ dec }</p>
      </div>
    )
  }

   // This runs our function when the page loads.
   useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {!currentAccount && renderNotConnectedContainer()}
        {isStani && renderWelcome()}
      </header>
    </div>
  );
}

export default App;
