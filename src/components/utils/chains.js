export default [
    {
        chainId: "nibiru-localnet-0",
        chainName: "Nibiru (localnet)",
        rpc: "http://localhost:26657",
        rest: "http://localhost:1317",
        stakeCurrency: {
            coinDenom: "NIBI",
            coinMinimalDenom: "unibi",
            coinDecimals: 6,
            coinGeckoId: "nibi",
            coinImageUrl: "https://i.ibb.co/mJ99JLL/Screenshot-2024-04-10-at-8-37-58-PM.png"

        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "nibi",
            bech32PrefixAccPub: "nibipub",
            bech32PrefixValAddr: "nibivaloper",
            bech32PrefixValPub: "nibivaloperpub",
            bech32PrefixConsAddr: "nibivalcons",
            bech32PrefixConsPub: "nibivalconspub",
        },
        currencies: [
            {
                coinDenom: "NIBI",
                coinMinimalDenom: "unibi",
                coinDecimals: 6,
                coinGeckoId: "nibi",
                coinImageUrl: "https://i.ibb.co/mJ99JLL/Screenshot-2024-04-10-at-8-37-58-PM.png"
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "NIBI",
                coinMinimalDenom: "unibi",
                coinDecimals: 6,
                coinGeckoId: "nibi",
                coinImageUrl: "https://i.ibb.co/mJ99JLL/Screenshot-2024-04-10-at-8-37-58-PM.png"
            },
        ],
        coinType: 118,
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
        },
        features: ["ibc-transfer", "ibc-go", "cosmwasm"],
        txExplorer: {
            name: "Local",
            txUrl: "http://localhost:26657/tx?hash={txHash}",
            themeColor: 'white'
        },
    },

    {
        chainId: "test",
        chainName: "Comdex (localnet)",
        rpc: "http://localhost:26657",
        rest: "http://localhost:1317",
        stakeCurrency: {
            coinDenom: "STAKE",
            coinMinimalDenom: "stake",
            coinDecimals: 6,
            coinGeckoId: "hypersign-identity-token",
            coinImageUrl: "https://i.ibb.co/p09jvKm/Screenshot-2024-04-11-at-11-05-29-AM.png"

        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "comdex",
            bech32PrefixAccPub: "comdexpub",
            bech32PrefixValAddr: "comdexvaloper",
            bech32PrefixValPub: "comdexvaloperpub",
            bech32PrefixConsAddr: "comdexvalcons",
            bech32PrefixConsPub: "comdexvalconspub",
        },
        currencies: [
            {
                coinDenom: "STAKE",
                coinMinimalDenom: "stake",
                coinDecimals: 6,
                coinGeckoId: "hypersign-identity-token",
                coinImageUrl: "https://i.ibb.co/p09jvKm/Screenshot-2024-04-11-at-11-05-29-AM.png"
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "STAKE",
                coinMinimalDenom: "stake",
                coinDecimals: 6,
                coinGeckoId: "hypersign-identity-token",
                coinImageUrl: "https://i.ibb.co/p09jvKm/Screenshot-2024-04-11-at-11-05-29-AM.png"
            },
        ],
        coinType: 118,
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
        },
        features: ["ibc-transfer", "ibc-go", "cosmwasm"],
        txExplorer: {
            name: "Local",
            txUrl: "http://localhost:26657/tx?hash={txHash}",
            themeColor: 'black'
        },
    }]

