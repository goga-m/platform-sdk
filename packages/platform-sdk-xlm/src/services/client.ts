import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import Stellar from "stellar-sdk";

import { DelegateData, TransactionData, WalletData } from "../dto";

export class ClientService implements Contracts.ClientService {
	readonly #client;

	readonly #broadcastErrors: Record<string, string> = {
		op_malformed: "ERR_MALFORMED",
		op_underfunded: "ERR_INSUFFICIENT_FUNDS",
		op_low_reserve: "ERR_LOW_RESERVE",
		op_line_full: "ERR_LINE_FULL",
		op_no_issuer: "ERR_NO_ISSUER",
	};

	private constructor(network: string) {
		this.#client = new Stellar.Server(
			{ live: "https://horizon.stellar.org", test: "https://horizon-testnet.stellar.org" }[network],
		);
	}

	public static async construct(opts: Contracts.KeyValuePair): Promise<ClientService> {
		return new ClientService(opts.network);
	}

	public async destruct(): Promise<void> {
		//
	}

	public async transaction(id: string): Promise<Contracts.TransactionData> {
		const transaction = await this.#client.transactions().transaction(id).call();
		const operations = await transaction.operations();

		return new TransactionData({
			...transaction,
			...{ operation: operations.records[0] },
		});
	}

	public async transactions(
		query: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Contracts.TransactionData>> {
		const { records, next, prev } = await this.#client.transactions().forAccount(query.address).call();

		return {
			meta: {},
			data: records
				.filter((transaction) => transaction.type === "payment")
				.map((transaction) => new TransactionData(transaction)),
		};
	}

	public async wallet(id: string): Promise<Contracts.WalletData> {
		return new WalletData(await this.#client.loadAccount(id));
	}

	public async wallets(query: Contracts.KeyValuePair): Promise<Contracts.CollectionResponse<Contracts.WalletData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "wallets");
	}

	public async delegate(id: string): Promise<Contracts.DelegateData> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegate");
	}

	public async delegates(
		query?: Contracts.KeyValuePair,
	): Promise<Contracts.CollectionResponse<Contracts.DelegateData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "delegates");
	}

	public async votes(id: string): Promise<Contracts.CollectionResponse<Contracts.TransactionData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "votes");
	}

	public async voters(id: string): Promise<Contracts.CollectionResponse<Contracts.WalletData>> {
		throw new Exceptions.NotImplemented(this.constructor.name, "voters");
	}

	public async syncing(): Promise<boolean> {
		throw new Exceptions.NotImplemented(this.constructor.name, "syncing");
	}

	public async broadcast(transactions: Contracts.SignedTransaction[]): Promise<Contracts.BroadcastResponse> {
		const result: Contracts.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			try {
				const { id } = await this.#client.submitTransaction(transaction);

				result.accepted.push(id);
			} catch (err) {
				const { extras } = err.response.data;
				const transactionId: string = extras.envelope_xdr; // todo: get the transaction ID

				result.rejected.push(transactionId);

				if (!Array.isArray(result.errors[transactionId])) {
					result.errors[transactionId] = [];
				}

				for (const [key, value] of Object.entries(this.#broadcastErrors)) {
					for (const operation of extras.result_codes.operations) {
						if (operation.includes(key)) {
							result.errors[transactionId].push(value);
						}
					}
				}
			}
		}

		return result;
	}
}