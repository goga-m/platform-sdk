export const manifest = {
	name: "Stellar",
	networks: {
		mainnet: {
			id: "mainnet",
			name: "Mainnet",
			explorer: "https://steexp.com/",
			currency: {
				ticker: "XLM",
				symbol: "XLM",
			},
			crypto: {
				slip44: 148,
			},
			hosts: ["https://horizon.stellar.org"],
		},
		testnet: {
			id: "testnet",
			name: "Testnet",
			explorer: "https://testnet.steexp.com/",
			currency: {
				ticker: "XLM",
				symbol: "XLM",
			},
			crypto: {
				slip44: 148,
			},
			hosts: ["https://horizon-testnet.stellar.org"],
		},
	},
	abilities: {
		Client: {
			transaction: true,
			transactions: true,
			wallet: true,
			wallets: false,
			delegate: false,
			delegates: false,
			votes: false,
			voters: false,
			configuration: false,
			fees: false,
			syncing: false,
			broadcast: true,
		},
		Fee: {
			all: false,
		},
		Identity: {
			address: {
				passphrase: true,
				multiSignature: false,
				publicKey: false,
				privateKey: false,
				wif: false,
			},
			publicKey: {
				passphrase: true,
				multiSignature: false,
				wif: false,
			},
			privateKey: {
				passphrase: true,
				wif: false,
			},
			wif: {
				passphrase: false,
			},
			keyPair: {
				passphrase: true,
				privateKey: true,
				wif: false,
			},
		},
		Ledger: {
			getVersion: false,
			getPublicKey: false,
			signTransaction: false,
			signMessage: false,
		},
		Link: {
			block: true,
			transaction: true,
			wallet: true,
		},
		Message: {
			sign: true,
			verify: true,
		},
		Peer: {
			search: false,
		},
		Transaction: {
			transfer: true,
			secondSignature: false,
			delegateRegistration: false,
			vote: false,
			multiSignature: false,
			ipfs: false,
			multiPayment: false,
			delegateResignation: false,
			htlcLock: false,
			htlcClaim: false,
			htlcRefund: false,
		},
	},
	signingMethods: {
		passphrase: true,
		privateKey: false,
		wif: false,
	},
};
