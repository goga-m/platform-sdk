import { Coins } from "@arkecosystem/platform-sdk";

import { manifest } from "../src/manifest";
import { schema } from "../src/schema";
import { HttpClient } from "./services/stubs/client";

export const createConfig = (options?: object) => {
	const config = new Coins.Config(
		{ ...(options || { network: "cosmos.testnet" }), ...{ httpClient: new HttpClient() } },
		schema,
	);

	config.set("network", manifest.networks["cosmos.testnet"]);

	return config;
};
