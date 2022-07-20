import { StargateClient, IndexedTx } from "@cosmjs/stargate"
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"

const rpc = "https://rpc.sentry-01.theta-testnet.polypore.xyz"
const aliceAddress = "cosmos17tvd4hcszq7lcxuwzrqkepuau9fye3dal606zf"
const txId = "540484BDD342702F196F84C2FD42D63FA77F74B26A8D7383FAA5AB46E4114A9B"

const runAll = async (): Promise<void> => {
  const client = await StargateClient.connect(rpc);
  console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());
  console.log(
    "Alice balances:",
    await client.getAllBalances(aliceAddress),
  );
  const faucetTx: IndexedTx = (await client.getTx(txId))!;
  console.log("Faucet Tx:", faucetTx)

  const decodedTx: Tx = Tx.decode(faucetTx.tx)
  console.log("DecodedTx:", decodedTx)
  console.log("Decoded messages:", decodedTx.body!.messages)

  const sendMessage: MsgSend = MsgSend.decode(decodedTx.body!.messages[0].value);
  console.log("Sent message:", sendMessage);

  const faucet: string = sendMessage.fromAddress;
  console.log("Faucet balances:", await client.getAllBalances(faucet));

  {
    const rawLog = JSON.parse(faucetTx.rawLog);
    console.log("Raw log:", JSON.stringify(rawLog, null, 4));

    const faucet: string = rawLog[0].events
      .find((eventEl: any) => eventEl.type === "coin_spent")
      .attributes.find((attribute: any) => attribute.key === "spender").value;
    console.log("Faucet address from raw log:", faucet);
  }
}

runAll();
