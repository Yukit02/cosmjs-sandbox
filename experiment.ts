import { StargateClient, IndexedTx } from "@cosmjs/stargate"
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
}

runAll();