// WalletContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js'; // Import the BigNumber library


const WalletContext = createContext();


export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
  
  const [connectedWallet, setConnectedWallet] = useState(() => {
    return localStorage.getItem('connectedWallet') || null;
  });

  const connectWallet = (address) => {
    setConnectedWallet(address);
    localStorage.setItem('connectedWallet', address);
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    localStorage.removeItem('connectedWallet');
  };

  const getConnectedWallet = () => {
    return connectedWallet;
  };

  const isWalletConnected = () => {
    return connectedWallet !== null;
  };
  useEffect(() => {
    return () => {
      if (!connectedWallet) {
        localStorage.removeItem('connectedWallet');
      }
    };
  }, [connectedWallet]);

   // Initialize usdtBalance and busdBalance as BigNumber instances
   const [usdtBalance, setUsdtBalance] = useState(new BigNumber(0));
   const [busdBalance, setBusdBalance] = useState(new BigNumber(0));
 
   const updateBalances = (usdt, busd) => {
  setUsdtBalance(new BigNumber(Number(usdt)));
  setBusdBalance(new BigNumber(Number(busd)));

  };
  

  return (
    
    <WalletContext.Provider value={{ usdtBalance, busdBalance, connectWallet, disconnectWallet, updateBalances, connectedWallet,getConnectedWallet,isWalletConnected}}>
     {children}

      </WalletContext.Provider> 
   
  );
};

