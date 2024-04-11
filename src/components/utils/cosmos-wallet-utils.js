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

    //;(await client).queryContractSmart()
    return client
}

export async function createNonSigningClient(rpcUrl) {
    const client = CosmWasmClient.connect(rpcUrl)

    return client
}

// Prepares a message for `create_entry` RPC method
export function constructSBTMintMsg(owner, nftTokenId, nftTokenUri) {
    return {
        "mint": {
            "owner": owner,
            "token_id": nftTokenId,
            "token_uri": nftTokenUri,
        }
    }
}

// Message to get the list of SBT tokens for a user
export function constructQuerySBTTokensMsg() {
    return {
        "all_tokens": {
            "limit": 90,
        }
    }
}

export function constructQueryTokensByOwner(owner) {
    return {
        "tokens": {
            "owner": owner
        }
    }
}

// Message to get the details of an SBT token 
export function constructQuerySBTTokenDetailsMsg(tokenId) {
    return {
        "all_nft_info": {
            "token_id": tokenId
        }
    }
}

// // Return owner for a token
// export function constructQuerySBTTokenOwnerMsg(tokenId) {
//     return {
//         "owner_of": {
//             "token_id": tokenId
//         }
//     }
// }

// Execute SBT Transfer to new owner
export function constructExecuteSBTTransfer(nftTokenId, newOwner) {
    return {
        "transfer_nft": {
            "recipient": newOwner,
            "token_id": nftTokenId
        }
    }
}

// Query the top-level Smart Contract metadata
export function constructQuerySBTContractMetadata() {
    return {
        "contract_info": {}
    }
}
