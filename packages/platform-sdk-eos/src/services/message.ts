import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import ecc from "eosjs-ecc";

export class MessageService implements Contracts.MessageService {
	public static async construct(config: Coins.Config): Promise<MessageService> {
		return new MessageService();
	}

	public async destruct(): Promise<void> {
		//
	}

	public async sign(input: Contracts.MessageInput): Promise<Contracts.SignedMessage> {
		const passphrase: string = BIP39.normalize(input.passphrase);

		return {
			message: input.message,
			signer: ecc.privateToPublic(passphrase),
			signature: ecc.sign(input.message, passphrase),
		};
	}

	public async verify(input: Contracts.SignedMessage): Promise<boolean> {
		return ecc.verify(input.signature, input.message, input.signer);
	}
}
