import { StargateClient, SigningStargateClient, IndexedTx } from "@cosmjs/stargate"
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"
import { readFile } from "fs/promises"
import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing"

const rpc = "https://rpc.sentry-01.theta-testnet.polypore.xyz"
const aliceAddress = "cosmos17tvd4hcszq7lcxuwzrqkepuau9fye3dal606zf"
const txId = "540484BDD342702F196F84C2FD42D63FA77F74B26A8D7383FAA5AB46E4114A9B"
const testnetAliceMnemonicKeyFilePath = "./testnet.alice.mnemonic.key"

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic((await readFile(testnetAliceMnemonicKeyFilePath)).toString(), { prefix: "cosmos" });
}

const runAll = async (): Promise<void> => {
  const client = await StargateClient.connect(rpc);
  // console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());
  // console.log(
  //   "Alice balances:",
  //   await client.getAllBalances(aliceAddress),
  // );
  const faucetTx: IndexedTx = (await client.getTx(txId))!;
  // console.log("Faucet Tx:", faucetTx);

  const decodedTx: Tx = Tx.decode(faucetTx.tx);
  // console.log("DecodedTx:", decodedTx);
  // console.log("Decoded messages:", decodedTx.body!.messages);

  const sendMessage: MsgSend = MsgSend.decode(decodedTx.body!.messages[0].value);
  // console.log("Sent message:", sendMessage);

  const faucet: string = sendMessage.fromAddress;
  // console.log("Faucet balances:", await client.getAllBalances(faucet));

  const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
  const alice = (await aliceSigner.getAccounts())[0].address
  // console.log("Alice's address from signer", alice)
  const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner)
  // console.log("signingClient is", signingClient)
  /* console.log(
    "With signing client, chain id:",
    await signingClient.getChainId(),
    ", height:",
    await signingClient.getHeight()
  ) */

  // console.log("Alice balance before:", await client.getAllBalances(alice))
  // console.log("Faucet balance before:", await client.getAllBalances(faucet))
  const result = await signingClient.sendTokens(alice, faucet, [{ denom: "uatom", amount: "100000" }], {
      amount: [{ denom: "uatom", amount: "500" }],
      gas: "200000",
  })
  // console.log("Transfer result:", result)
}

runAll();
