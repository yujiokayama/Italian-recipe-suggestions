import "dotenv/config";
import { VoltAgent, VoltOpsClient } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import { mainAgent } from "./agents/main";


const logger = createPinoLogger({
  name: "italian-recipe-agent",
  level: "info",
});

// 既存の単一エージェント構成を、メイン＋サブの複数エージェントに移行

new VoltAgent({
  agents: {
  "italian-recipe-chef": mainAgent,
  },
  logger,
  voltOpsClient: new VoltOpsClient({
    publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
    secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
  }),
});
