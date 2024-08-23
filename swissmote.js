import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setProvider(provider);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } else {
      alert("Please install MetaMask!");
    }
  };

  return { provider, balance, connectWallet };
}

import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

export function useSolanaWallet() {
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const wallet = await window.solana.connect();
      const publicKey = new PublicKey(wallet.publicKey.toString());
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // convert to SOL
    } else {
      alert("Please install Phantom Wallet!");
    }
  };

  return { balance, connectWallet };
}

import { Button, Box, Text, VStack } from "@chakra-ui/react";
import { useWallet } from "../hooks/useWallet";
import { useSolanaWallet } from "../hooks/useSolanaWallet";

export default function Home() {
  const ethWallet = useWallet();
  const solWallet = useSolanaWallet();

  return (
    <Box p={5} textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Connect Your Crypto Wallet</Text>
        
        <Button onClick={ethWallet.connectWallet} colorScheme="teal">
          Connect Ethereum Wallet
        </Button>
        {ethWallet.balance && (
          <Text>ETH Balance: {ethWallet.balance} ETH</Text>
        )}

        <Button onClick={solWallet.connectWallet} colorScheme="purple">
          Connect Solana Wallet
        </Button>
        {solWallet.balance && (
          <Text>SOL Balance: {solWallet.balance} SOL</Text>
        )}
      </VStack>
    </Box>
  );
}
