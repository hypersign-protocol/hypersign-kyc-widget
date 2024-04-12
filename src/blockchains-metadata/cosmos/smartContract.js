export async function smartContractCodeInstantiateRPC(
    client,
    coinDenom,
    userAddress,
    codeId,
    instantiateMsg,
    smartContractlabel,
) {
    // Set the inital fee
    const fee = {
        amount: [
            {
                denom: coinDenom,
                amount: "4000",
            },
        ],
        gas: "200000",
    };

    // Instantitate the smart contract code
    try {
        const txResult = await client.instantiate(
            userAddress,
            parseInt(codeId),
            instantiateMsg,
            smartContractlabel,
            fee
        )
        console.log("Transaction hash: ", txResult["transactionHash"]);
        alert("Transaction Successful: " + txResult["transactionHash"]);
        const contractAddress = txResult["contractAddress"]
        return contractAddress
    } catch (err) {
        console.log(err.message)
        alert("Transaction has failed, Error Log below \n\n " + err.message)
        return null
    }
}

export async function smartContractExecuteRPC(
    client,
    coinDenom,
    userAddress,
    contractAddress,
    executeMsg,
) {
    // Set the inital fee
    const fee = {
        amount: [
            {
                denom: coinDenom,
                amount: "4000",
            },
        ],
        gas: "200000",
    };

    const txResult = await client.execute(
        userAddress,
        contractAddress,
        executeMsg,
        fee
    )

    return txResult
}

export async function smartContractQueryRPC(
    client,
    contractAddress,
    queryMsg,
) {
    if (!client) {
        throw new Error('Connect your wallet to proceed')
    }
    // Exectute the contract message
    const queryResult = await client.queryContractSmart(
        contractAddress,
        queryMsg,
    );
    return queryResult;
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
