import "dotenv/config";
import { VoltAgent, VoltOpsClient } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";
import { BuonoKun } from "./agents/main";


const logger = createPinoLogger({
  name: "buono-kun",
  level: "info",
});

new VoltAgent({
  agents: {
    "buono-kun": BuonoKun,
  },
  logger,
  voltOpsClient: new VoltOpsClient({
    publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
    secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
  }),
});
