import Joi from "@hapi/joi";

export const schema = Joi.object({
	network: Joi.string().allow("mainnet", "ropsten", "rinkeby", "goerli", "kovan"),
	peer: Joi.string().uri().optional(),
	httpClient: Joi.object(),
	services: Joi.object()
		.keys({ ledger: Joi.object().keys({ transport: Joi.function().class() }) })
		.optional(),
});
