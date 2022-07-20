import { StargateClient } from "@cosmjs/stargate"
const rpc = "https://rpc.sentry-01.theta-testnet.polypore.xyz"
const aliceAddress = "cosmos17tvd4hcszq7lcxuwzrqkepuau9fye3dal606zf"

const runAll = async (): Promise<void> => {
  const client = await StargateClient.connect(rpc);
  console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());
  console.log(
    "Alice balances:",
    await client.getAllBalances(aliceAddress),
  );
}

runAll();