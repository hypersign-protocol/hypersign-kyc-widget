import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export async function getUserAddressFromOfflineSigner(offlineSigner) {
    const accounts = await offlineSigner.getAccounts();
    const userAddress = accounts[0].address;
    return userAddress
}

export async function createClient(rpcUrl, offlineSigner) {
    const client = SigningCosmWasmClient.connectWithSigner(
        rpcUrl,
        offlineSigner
    )
    return client
}

export async function createNonSigningClient(rpcUrl) {
    const client = CosmWasmClient.connect(rpcUrl)

    return client
}
