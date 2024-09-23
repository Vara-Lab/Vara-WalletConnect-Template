import { useWalletConnect } from "@/app/wallet-connect/hooks/useWalletConnect";
import { useSignAndSendTransfer } from "@/app/wallet-connect/hooks/useSignAndSendTransfer";
import { useSignAndSendMessage } from "@/app/wallet-connect/hooks/useSignAndSendMessage";
import { Center, VStack, Image } from "@chakra-ui/react";
import { Heading } from "@/components/ui/heading";
import { Button as VaraButton } from "@/components/ui/button";


function Landing() {
  // Using the hook to connect to WalletConnect
  const { enableWalletConnect, connected, accounts, signTransaction } =
    useWalletConnect();

  // Hook to sign and send a transfer
  const { signAndSendTransfer, txHash, isSigning, error } =
    useSignAndSendTransfer(accounts, signTransaction);

  // Recipient address and amount to send
  const recipient = "kGggpCH2Rgzp5VcpBei9MS2B2PiJn9Kg92XK19mMwc7zZBcVG"; // Add Recipient address
  const amount = 3000000000000; // Add Amount

  const sendTransaction = () => {
    signAndSendTransfer(recipient, amount);
  };


  // Hook to sign and send a message
  const { signAndSendSendMessage } =
    useSignAndSendMessage(accounts, signTransaction);

  // Message parameters
  const programID =
    "0xd5d1eb08af166ac3bb210bac52814324a0e33501edb8c57e9102e81c820c09a2"; // Program ID
  const payload = "Green"; // Message payload
  const meta = "00020000000100000000010100000000000000000102000000750424000808696f48547261666669634c69676874416374696f6e00010c14477265656e0000001859656c6c6f770001000c52656400020000040808696f44547261666669634c696768744576656e7400010c14477265656e0000001859656c6c6f770001000c52656400020000080808696f4c496f547261666669634c696768745374617465000008013463757272656e745f6c696768740c0118537472696e67000124616c6c5f75736572731001585665633c284163746f7249642c20537472696e67293e00000c00000502001000000214001400000408180c001810106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001c01205b75383b2033325d00001c000003200000002000200000050300"; // Optional metadata
  const gasLimit = 98998192450; // Gas limit
  const value = 0; // Value in units

  const sendMessage = () => {
    signAndSendSendMessage(programID, payload, meta, gasLimit, value);
  };




  return (
    <Center>
      <VStack>
        <Center>
          <VStack>
            {connected ? (
              <></>
            ) : (
              <>
                <Image
                  src="https://www.nuget.org/profiles/WalletConnect/avatar?imageSize=512"
                  w="120px"
                  h="120px"
                />
                <VaraButton onClick={enableWalletConnect}>
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                </VaraButton>
              </>
            )}
            {connected && (
              <>
                <VStack>
                  <Heading size="xs">
                    Accounts: {accounts.map((acc) => acc.address).join(", ")}
                  </Heading>
                  <VaraButton
                    onClick={() => sendTransaction()}
                    disabled={isSigning}
                  >
                    {isSigning ? "Signing Transaction..." : "Send Transaction"}
                  </VaraButton>
                  <VaraButton
                    onClick={() => sendMessage()}
                    disabled={isSigning}
                  >
                    {isSigning ? "Signing Transaction..." : "Send Message"}
                  </VaraButton>
                  <Heading size="xs">
                    {txHash && <div>Transaction Id: {txHash}</div>}
                    {error && <div>Error: {error}</div>}
                  </Heading>
                </VStack>
              </>
            )}
          </VStack>
        </Center>
      </VStack>
    </Center>
  );
}

export { Landing };
