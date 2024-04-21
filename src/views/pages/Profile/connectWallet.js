import React, { useEffect, useState,useContext  } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import {
  Button,
  TextField,
  Typography,
  makeStyles,
  InputAdornment,
  DialogTitle,
  DialogActions, // Add this line
} from "@material-ui/core";
import { tokensDetails} from "src/constants";
import BalanceBox from "src/component/BalanceBox";
import { UserContext } from "src/context/User";
import { sortAddress } from "src/utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: theme.spacing(2),
  },
  topBar: {
    marginBottom: theme.spacing(2),
  },
  balanceBox: {
    width: '50%',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  walletConnect: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));
const ConnectWallet = () => {
  const classes = useStyles();
  const { connectedWallet, connectWallet, disconnectWallet } = useWallet();
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [fdusdBalance, setFDusdBalance] = useState(null);
  const [MASBalance, setMASBalance] = useState(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const { updateBalances } = useWallet();
  const [selectedToken, setSelectedToken] = useState(tokensDetails[0]);
  const [availableBalance, setAvailableBalance] = useState({});
  const [chargeDialogOpen, setChargeDialogOpen] = useState(false);
  const [usdtChargeAmount, setUsdtChargeAmount] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  


  const user = useContext(UserContext);
  console.log("usdtBalance:", usdtBalance);
  console.log("fdusdBalance:", fdusdBalance);

  // USDT contract address and ABI on BSC
  const usdtContractAddress = '0x55d398326f99059fF775485246999027B3197955';
  const usdtContractABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]



  // FDUSD contract address and ABI on BSC
  const fdusdContractAddress = '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409';
  const fdusdContractABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
    // Add more functions if needed
  ];
   // Replace with the actual ABI
  const MASContractAddress = '0xe6a18c271ac1cd06a82c00245b6469cf99b851c7';
  const MASContractABI= [{
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "_decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },]
  useEffect(() => {
    // Retrieve wallet connection information from localStorage on component mount
    const storedAccount = localStorage.getItem('connectedAccount');
    const storedProvider = storedAccount ? new ethers.providers.Web3Provider(window.ethereum) : null;

    if (storedAccount && storedProvider) {
      setProvider(storedProvider);
      setAccount(storedAccount);
      setConnected(true);
    }
  }, []);
  useEffect(() => {
    if (provider && account) {
      console.log(`Connected to ${account}`);
      connectWallet(account); // Corrected the function name
      setConnected(true);
      fetchBalances();
      // You can perform additional actions here after connecting
      localStorage.setItem('connectedAccount', account);
    } else {
      setConnected(false);
    }
  }, [provider, account]);
  useEffect(() => {
    setAvailableBalance({
      masBalance: parseFloat(user.userData?.masBalance),
      fdusdBalance: parseFloat(user.userData?.fdusdBalance),
      usdtBalance: parseFloat(user.userData?.usdtBalance),
    });
  }, [user.userData])

  
  const handleConnect = async (selectedWallet) => {
    try {
      let web3Provider;

      if (selectedWallet === 'Metamask') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      } else if (selectedWallet === 'TrustWallet') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      } else if (selectedWallet === 'Vantoum') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        console.error('Invalid wallet selection');
        return;
      }

      const accounts = await web3Provider.listAccounts();

      if (accounts.length > 0) {
        setProvider(web3Provider);
        setAccount(accounts[0]);
        setShowConnectDialog(false);
      } else {
        console.error('No account found');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };
  const handleDisconnect = async () => {
    try {
      // Clear connection information from component state
      setProvider(null);
      setAccount(null);
      setConnected(false);
      setUsdtBalance(null);
      setFDusdBalance(null);
  
      // Disconnect from external wallet management context or service (WalletContext)
      disconnectWallet();
  
      // Disconnect from MetaMask using eth_accounts RPC method
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
  
        if (accounts.length > 0) {
          await window.ethereum.request({
            method: 'eth_requestAccounts',
            params: [{ eth_accounts: {} }],
          });
        }
        console.log('Disconnected from MetaMask');
      } else {
        console.warn('MetaMask not found');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };
  
  const fetchBalances = async () => {
    try {
      const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractABI, provider);
      const fdusdContract = new ethers.Contract(fdusdContractAddress, fdusdContractABI, provider);
      const MASContract = new ethers.Contract(MASContractAddress, MASContractABI, provider);

      const usdtBalance = await usdtContract.balanceOf(account);
      const fdusdBalance = await fdusdContract.balanceOf(account);
      const MASBalance = await MASContract.balanceOf(account);

      setUsdtBalance(ethers.utils.formatUnits(usdtBalance, 18)); // Assuming USDT has 18 decimals
      setFDusdBalance(ethers.utils.formatUnits(fdusdBalance, 18)); // Assuming FDUSD has 18 decimals
      setMASBalance(ethers.utils.formatUnits(MASBalance, 18)); // Assuming FDUSD has 18 decimals

      updateBalances(usdtBalance, fdusdBalance);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (provider && account) {
          console.log(`Connected to ${account}`);
          connectWallet(account);
          setConnected(true);
          await fetchBalances();
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error('Error connecting or fetching balances:', error);
        setConnected(false);
      }
    };
  
    fetchData();
  
    return () => {
      // Cleanup function (if needed)
    };
  }, [provider, account]);

  const handleOpenChargeDialog = () => {
    setChargeDialogOpen(true);
  };
  const handleCloseChargeDialog = () => {
    setChargeDialogOpen(false);
    setUsdtChargeAmount(""); // Clear the input amount when closing the dialog
  };
  const Internalwallet = () => {
    const ethAddress = user?.userData?.ethAccount?.address;
    return ethAddress;
  };
  // Usage
  Internalwallet();
  const walletAddress = Internalwallet();
   console.log(walletAddress); // Use the Ethereum address as needed

   const handleAcceptCharge = async () => {
    try {
      if (window.ethereum) {
        // Requesting user accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
  
        // Check if user approved the request
        if (accounts.length > 0) {
          const selectedAddress = accounts[0];
  
          // Specify the amount you want to send in USDT
          const amountInUsdt = usdtChargeAmount; // Replace with the desired amount
  
          // Prepare the transaction data
          const transactionParameters = {
            from: selectedAddress,
            to: usdtContractAddress, // USDT contract address
            value: '0x0', // Set value to 0 for token transactions
            data: `0xa9059cbb${ethers.utils.defaultAbiCoder.encode(
              ['address', 'uint256'],
              [walletAddress, ethers.utils.parseUnits(amountInUsdt, 18).toString()]
            ).slice(2)}`,
          };
  
          // Open MetaMask window to confirm the transaction
          const result = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          });
  
          console.log('Transaction sent:', result);
  
          // Close the charge dialog
          setChargeDialogOpen(false);
  
          // Show the success dialog
          setSuccessDialogOpen(true);
  
          // Automatically close the success dialog after 2 seconds
          setTimeout(() => {
            setSuccessDialogOpen(false);
          }, 6000);
        } else {
          console.error('User denied account access');
        }
      } else {
        console.warn('MetaMask not found');
      }
    } catch (error) {
      console.error('Error accepting charge:', error);
    } finally {
      // Log whether the success dialog is still open at this point
      console.log('Is success dialog still open?', successDialogOpen);
    }
  };
  

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        {/* Your top bar content goes here */}
      </div>
      <div className={classes.balanceBox}>
        <Typography variant="h5" component="h5">
          YOUR Balance
        </Typography>
        <BalanceBox
          availableBalance={availableBalance}
          tokensDetails={tokensDetails}
          setSelectedToken={setSelectedToken}
        />
      </div>
      <div className={classes.walletConnect}>
  <h2>Wallet Connection</h2>
  {connected ? (
    <div>
      <Button
        onClick={handleDisconnect}
        variant="contained"
        color="secondary"
        className={classes.button}
      >
        {sortAddress(account)}
      </Button>
      <Button
        onClick={handleOpenChargeDialog}
        variant="contained"
        color="secondary"
        className={classes.button}
      >
        Charge Your Account with USDT
      </Button>
            <p>USDT Balance: {usdtBalance} USDT</p>
            <p>FDUSD Balance: {fdusdBalance} FDUSD</p>
            <p>MAS Balance: {MASBalance} MAS</p>
            <p>Wallet is connected!</p>
    </div>
  ) : (
          <>
            <Button
              onClick={() => setShowConnectDialog(true)}
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Connect Wallet
              
            </Button>
            {showConnectDialog && (
              <div>
                <p>Choose a wallet:</p>
                <Button
                  onClick={() => handleConnect('Metamask')}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Metamask
                </Button>
                <Button
                  onClick={() => handleConnect('TrustWallet')}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Trust Wallet
                </Button>
                <Button
                  onClick={() => handleConnect('Vantoum')}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Vantoum
                </Button>
                <Button
                  onClick={() => setShowConnectDialog(false)}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </div>
       {/* Charge Dialog */}
       <Dialog open={chargeDialogOpen} onClose={handleCloseChargeDialog}>
        <DialogTitle>Charge Your Account with USDT</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter USDT Amount"
            type="number"
            value={usdtChargeAmount}
            onChange={(e) => setUsdtChargeAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  USDT
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseChargeDialog}
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAcceptCharge}
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialog for the success message*/}
<Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
  <DialogTitle>The transaction in processing... see your transaction history</DialogTitle>
  <DialogContent>
    
  </DialogContent>
</Dialog>
    </div>
  );
  
};

export default ConnectWallet;



