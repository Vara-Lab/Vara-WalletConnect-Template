import {
  Code,
  Center,
  VStack,
  HStack,
  Image,
  Input,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Text,
  useClipboard,
  Button,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  useToast,
  ModalCloseButton,
  ModalHeader,
  Heading,
} from "@chakra-ui/react";
import { useWalletConnect } from "@/app/wallet-connect/hooks/useWalletConnect";
import { Button as VaraButton } from "@/components/ui/button";
import { FiSend, FiCopy } from "react-icons/fi";
import { useSignAndSendTransfer } from "@/app/wallet-connect/hooks/useSignAndSendTransfer";
import { useApi } from "@/app/wallet-connect/hooks/useApi";
import { useState, useEffect } from "react";
import { BigNumber } from "@gear-js/react-hooks";

function Landing() {
  const { api } = useApi();

  const { enableWalletConnect, connected, accounts, signTransaction } =
    useWalletConnect();

  const { signAndSendTransfer, txHash, isSigning, error, isReady } =
    useSignAndSendTransfer(accounts, signTransaction);


  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");

  const { onCopy, hasCopied } = useClipboard(txHash || "");

  const sendTransaction = () => {
    if (isReady) {
      signAndSendTransfer(recipient, Number(amount) * 1000000000000);
      setRecipient("");
      setAmount("");
      setOverlay(<OverlayOne />);
      onOpen();
    } else {
      console.error("API is not ready");
    }
  };

  const format = (
    balanceInPlancks: BigNumber | string,
    decimals = 10
  ): string => {
    const divisor = new BigNumber(10).pow(new BigNumber(decimals));
    const balanceInUnits = new BigNumber(balanceInPlancks).div(divisor);

    return (parseFloat(balanceInUnits.toString()) / 1).toFixed(4);
  };

  const balanceAccount = async () => {
    if (isReady) {
      if (accounts && accounts.length > 0) {
        try {
          const { data: balance } = await api.query.system.account(
            accounts[0].address
          );

          const convertedBalance = format(balance.free, 12);

          setBalance(convertedBalance ?? "");
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      } else {
        console.error("No accounts available");
      }
    } else {
      console.error("API is not ready");
    }
  };

  balanceAccount();

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const toast = useToast();

  useEffect(() => {
    if (isSigning) {
      toast({
        title: "Signing Transaction",
        description: "Your transaction is being signed.",
        status: "loading",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [isSigning, toast]);

  useEffect(() => {
    if (txHash) {
      toast({
        title: "Transaction Successful",
        description: `Transaction Hash: ${txHash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [txHash, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (!isReady) {
      toast({
        title: "API is not ready",
        description: "The API is not ready yet.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [isReady, toast]);

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
          <VStack>
            <VStack
              spacing={3}
              p={4}
              bg="gray.50"
              borderRadius="md"
              boxShadow="md"
              alignItems="flex-start"
              w="100%"
              maxW="500px"
              transition="all 0.3s ease"
            >
              <Heading size="sm" fontWeight="bold" color="teal.600">
                Account
              </Heading>
              <Text
                fontSize="md"
                fontWeight="medium"
                bg="gray.100"
                p={3}
                borderRadius="md"
                color="gray.700"
                wordBreak="break-all"
                w="100%"
              >
                {accounts[0].address}
              </Text>
            </VStack>

            <HStack spacing={6}>
              <Card
                w="100%"
                maxW="500px"
                borderRadius="lg"
                boxShadow="lg"
                p={4}
                _hover={{ boxShadow: "2xl" }}
                transition="all 0.3s ease"
              >
                <CardHeader alignItems="center">
                  <Center>
                    <Heading size="md">Transfer</Heading>
                  </Center>
                  <Heading size="xs">Balance: {balance} TVARA</Heading>
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
                    <Button
                      onClick={sendTransaction}
                      disabled={isSigning || !isReady}
                      backgroundColor="#64ffdb"
                      leftIcon={<FiSend />}
                      boxShadow="lg"
                      p={4}
                      _hover={{ boxShadow: "2xl" }}
                      transition="all 0.3s ease"
                    >
                      {isSigning
                        ? "Signing Transaction..."
                        : "Send Transaction"}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
              {isSigning ? (
                "Signing Transaction..."
              ) : (
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                  {overlay}
                  <ModalContent maxW="50%">
                    <ModalHeader>Transaction Id:</ModalHeader>
                    <ModalCloseButton />
                    <Center>
                      <Text size="xs">
                        {txHash && (
                          <VStack
                            spacing={4}
                            p={4}
                            bg="gray.50"
                            borderRadius="md"
                            boxShadow="md"
                            w="100%"
                            alignItems="stretch"
                          >
                            <Text
                              fontSize="md"
                              fontWeight="medium"
                              bg="gray.100"
                              p={2}
                              borderRadius="md"
                              wordBreak="break-all"
                              color="gray.600"
                            >
                              {txHash}
                            </Text>
                            <Button
                              size="md"
                              mt={4}
                              alignSelf="center"
                              onClick={onCopy}
                              colorScheme="teal"
                              variant="solid"
                              leftIcon={<FiCopy />} 
                              width="fit-content"
                            >
                              {hasCopied ? "Copied!" : "Copy Transaction Id"}
                            </Button>
                          </VStack>
                        )}
                      </Text>
                    </Center>
                    <ModalFooter>
                      <Button colorScheme="red" onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}
            </HStack>
          </VStack>
        )}
      </VStack>
    </Center>
  );
}

export { Landing };
