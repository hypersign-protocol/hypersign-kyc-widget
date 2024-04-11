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

