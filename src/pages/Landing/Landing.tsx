import {
  Code,
  Center,
  VStack,
  Image,
  Input,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Text,
  useClipboard,
  Button
} from "@chakra-ui/react";
import { useWalletConnect } from "@/app/wallet-connect/hooks/useWalletConnect";
import { Button as VaraButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useSignAndSendTransfer } from "@/app/wallet-connect/hooks/useSignAndSendTransfer";
import { useState } from "react";

function Landing() {
  const { enableWalletConnect, connected, accounts, signTransaction } =
    useWalletConnect();

  // Hook to sign and send a transfer
  const { signAndSendTransfer, txHash, isSigning, error, isReady } =
    useSignAndSendTransfer(accounts, signTransaction);

  // States for transfer parameters
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Clipboard hook for copying the transaction hash
  const { onCopy, hasCopied } = useClipboard(txHash || "");

  const sendTransaction = () => {
    if (isReady) {
      signAndSendTransfer(recipient, Number(amount) * 1000000000000);
      setRecipient("");
      setAmount("");
    } else {
      console.error("API is not ready");
    }
  };

  return (
    <Center>
      <VStack spacing={4}>
        {!connected && (
          <>
            <Image
              src="https://www.nuget.org/profiles/WalletConnect/avatar?imageSize=512"
              boxSize="120px"
              alt="Wallet Connect Avatar"
            />
            <VaraButton onClick={enableWalletConnect}>
              Connect Wallet
            </VaraButton>
          </>
        )}

        {connected && (
          <VStack spacing={6}>
            {/* Transfer Section */}
            <Card
              w="100%"
              maxW="400px"
              borderRadius="lg"
              boxShadow="lg"
              p={4}
              _hover={{ boxShadow: "2xl" }}
              transition="all 0.3s ease"
            >
              <CardHeader>
                <Heading size="md">Transfer</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Recipient ss58 Address</FormLabel>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter ss58 recipient address"
                      focusBorderColor="teal.500"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      focusBorderColor="teal.500"
                    />
                  </FormControl>
                  <VaraButton
                    onClick={sendTransaction}
                    disabled={isSigning || !isReady}
                  >
                    {isSigning ? "Signing Transaction..." : "Send Transaction"}
                  </VaraButton>
                </VStack>
              </CardBody>
            </Card>
            <Center>
              <Heading size="xs">
                {txHash && (
                  <VStack spacing={2}>
                    <Text>Transaction Id:</Text>
                    <Code p={2} borderRadius="md">
                      {txHash}
                    </Code>
                    <Button size="sm" onClick={onCopy} colorScheme="teal">
                      {hasCopied ? "Copied!" : "Copy Transaction Id"}
                    </Button>
                  </VStack>
                )}
                {error && <div>Error: {error}</div>}
                {!isReady && <div>API is not ready yet.</div>}
              </Heading>
            </Center>
          </VStack>
        )}
      </VStack>
    </Center>
  );
}

export { Landing };
