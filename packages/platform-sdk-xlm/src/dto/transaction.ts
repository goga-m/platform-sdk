import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class TransactionData extends DTO.AbstractTransactionData implements Contracts.TransactionData {
	public id(): string {
		return this.data.transaction_hash || this.data.id;
	}

	public type(): string {
		return "transfer";
	}

	public timestamp(): number | undefined {
		return +new Date(this.data.created_at);
	}

	public confirmations(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "confirmations");
	}

	public sender(): string {
		return this.data.from || this.data.operation.from;
	}

	public recipient(): string {
		return this.data.to || this.data.operation.to;
	}

	public amount(): BigNumber {
		return BigNumber.make((this.data.amount || this.data.operation.amount) * 1e8);
	}

	// todo: with the "transaction" method we get a nonce but with "transactions" it isn't available
	public fee(): BigNumber {
		return BigNumber.make((this.data.fee_charged || 0) * 1e8);
	}

	public memo(): string | undefined {
		return undefined;
	}

	public asset(): object | undefined {
		return {};
	}
}
