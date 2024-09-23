# Vara-WalletConnect Template

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The **Vara WalletConnect Library** is a powerful tool designed to simplify the integration of **WalletConnect** with the **Vara Network** (a Substrate-based blockchain). This library enables developers to easily connect, sign, and send transactions through WalletConnect, allowing for a seamless user experience when interacting with decentralized applications (dApps) on the Vara network.

Whether you're building DeFi solutions, NFTs, or any blockchain-based dApp, this library provides an easy-to-use API to securely interact with users' wallets.

## Features

- **Easy Integration with WalletConnect**: Quickly connect with users' wallets using WalletConnect for signing and sending transactions on the Vara Network.
- **Transaction Signing**: Enables users to sign payloads and submit transactions to the Vara Network.
- **Support for Custom Transactions**: Allows developers to create and send custom extrinsics.
- **Modular Design**: Clear separation between connection management, transaction signing, and status tracking.

## Getting Started

To get started with the **Vara WalletConnect Library**, follow the instructions below for installation and setup. You can then explore the examples provided to see how easy it is to connect to a wallet and sign transactions.

## Prerequisites

Before installing the library, ensure you have the following prerequisites:

- **Node.js** (version 14.x or higher)
- **npm** or **yarn** for package management
- **Vara Network RPC Endpoint**: A WebSocket endpoint to connect to the Vara network. Example: `wss://rpc.vara.network` or `wss://testnet.vara.network`.

## Installation

###  Use the Vara-WalletConnect-Template

1. **Clone the template:**:

```bash
   git clone https://github.com/Vara-Lab/Vara-WalletConnect-Template.git
   cd Vara-WalletConnect-Template
```

2. **Add your Project ID**:

  - Register and create a project at https://cloud.reown.com/sign-in.

  - Add your Project ID to the .env file.


3. **Install the necessary dependencies:**:

Alternatively, you can clone and use the Chakra-UI-Vite-Sails-Template as a starting point. This template comes pre-configured with Chakra UI, Vite, and Sails, making it easy to integrate with this library.

```bash
 yarn install
```

4. **Run**:

```bash
  yarn dev

```

## Examples

### Send Transactions

This example demonstrates how to connect a wallet using WalletConnect, sign, and send a transaction on the Vara Network. We use the useWalletConnect hook to manage the wallet connection and the useSignAndSendTransfer hook to handle signing and sending the transaction.

```typescript
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/app/wallet-connect/hooks/useWalletConnect";
import { useSignAndSendTransfer } from "@/app/wallet-connect/hooks/useSignAndSendTransfer";
import { Center, VStack, Image } from "@chakra-ui/react";
import { Heading } from "@/components/ui/heading";

function Home() {
  // Using the hook to connect to WalletConnect
  const { enableWalletConnect, connected, accounts, signTransaction } =
    useWalletConnect();

  // Hook to sign and send a transfer
  const { signAndSendTransfer, txHash, isSigning, error } =
    useSignAndSendTransfer(accounts, signTransaction);

  // Recipient address and amount to send
  const recipient = "kGggpCH2Rgzp5VcpBei9MS2B2PiJn9Kg92XK19mMwc7zZBcVG";
  const amount = 3000000000000;

  const sendTransaction = () => {
    signAndSendTransfer(recipient, amount);
  };

  return (
    <Center>
      <VStack>
        {connected ? (
          <></>
        ) : (
          <>
            <Image
              src="https://walletconnect.com/static/favicon.png"
              w="70px"
              h="70px"
            />
            <Button onClick={enableWalletConnect}>
              {connected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </>
        )}
        {connected && (
          <>
            <VStack>
              <Heading size="xs">
                Accounts: {accounts.map((acc) => acc.address).join(", ")}
              </Heading>
              <Button onClick={() => sendTransaction()} disabled={isSigning}>
                {isSigning ? "Signing Transaction..." : "Sign Transaction"}
              </Button>
              <Heading size="xs">
                {txHash && <div>Transaction Id: {txHash}</div>}
                {error && <div>Error: {error}</div>}
              </Heading>
            </VStack>
          </>
        )}
      </VStack>
    </Center>
  );
}

export { Home };
```

### Send Message

This example demonstrates how to send a message to a smart contract on the Vara Network using WalletConnect. The useSignAndSendMessage hook is used to sign and send the message, with all necessary details such as the payload, meta, gas limit, and value.

```typescript
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/app/wallet-connect/hooks/useWalletConnect";
import { useSignAndSendMessage } from "@/app/wallet-connect/hooks/useSignAndSendMessage";
import { Center, VStack, Image } from "@chakra-ui/react";
import { Heading } from "@/components/ui/heading";

function Home() {
  // Using the hook to connect to WalletConnect
  const { enableWalletConnect, connected, accounts, signTransaction } =
    useWalletConnect();

  // Hook to sign and send a message
  const { signAndSendSendMessage, txHash, isSigning, error } =
    useSignAndSendMessage(accounts, signTransaction);

  // Message parameters
  const programID =
    "0xd5d1eb08af166ac3bb210bac52814324a0e33501edb8c57e9102e81c820c09a2"; // Contract ID
  const payload = "message_payload"; // Message payload
  const meta = "meta_data"; // Optional metadata
  const gasLimit = 98998192450; // Gas limit
  const value = 0; // Value in units

  const sendMessage = () => {
    signAndSendSendMessage(programID, payload, meta, gasLimit, value);
  };

  return (
    <Center>
      <VStack>
        {connected ? (
          <></>
        ) : (
          <>
            <Image
              src="https://walletconnect.com/static/favicon.png"
              w="70px"
              h="70px"
            />
            <Button onClick={enableWalletConnect}>
              {connected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </>
        )}
        {connected && (
          <>
            <VStack>
              <Heading size="xs">
                Accounts: {accounts.map((acc) => acc.address).join(", ")}
              </Heading>
              <Button onClick={() => sendMessage()} disabled={isSigning}>
                {isSigning ? "Signing Transaction..." : "Sign Transaction"}
              </Button>
              <Heading size="xs">
                {txHash && <div>Transaction Id: {txHash}</div>}
                {error && <div>Error: {error}</div>}
              </Heading>
            </VStack>
          </>
        )}
      </VStack>
    </Center>
  );
}

export { Home };
```

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow these guidelines:

1. **Fork the Repository**:  
   Click on the "Fork" button at the top of this repository to create your own copy.

2. **Create a Feature Branch**:  
   Create a new branch for your feature or bugfix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Submit a Pull Request**:  
   Once your changes are ready, submit a pull request to the `main` branch. Be sure to include a detailed description of your changes and the problem they solve.

## License

This project is licensed under the MIT License. See the LICENSE file for details.