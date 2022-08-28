/* eslint-disable require-jsdoc */

import { Wallet } from "../wallet/Wallet";

import { RpcError } from "eosjs";
import ecc from "eosjs-ecc";
import { consts } from "../../../consts";

export class FuelTransaction {
    wallet: Wallet;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
    }

    async send(txData: any): Promise<any> {
        const newTxData = JSON.parse(JSON.stringify(txData));
        const signers = txData.actions[0].authorization; // executor array

        // select the executor of the transaction which is usually the second element of the array depending on the presence of the cosign
        const signer = signers.length > 1 ? signers[1] : signers[0];

        // add it to transaction data
        newTxData.actions[0].authorization = [signer];

        try {
            // Generate the desired unsigned transaction
            const transaction = await this.wallet.api.transact(newTxData, {
                useLastIrreversible: true,
                expireSeconds: 300,
                broadcast: false,
                sign: false,
            });

            // Deserialize the transaction
            const deserializedTransaction =
                this.wallet.api.deserializeTransaction(
                    transaction.serializedTransaction
                );

            // Submit the transaction to the resource provider endpoint
            const cosigned = await this.wallet.rpc.fetchBuiltin(
                consts.RESOURCE_PROVIDER_ENDPOINT,
                {
                    body: JSON.stringify({
                        signer: signer,
                        transaction: deserializedTransaction,
                    }),
                    method: "POST",
                }
            );

            // Interpret the resulting JSON
            const json = await cosigned.json();

            console.log(
                `\nResponse (${json.code}) from resource provider api...`
            );

            console.log(json);

            // Pull the modified transaction from the API response
            const { data } = json;

            /*
                    Based on the response code, perform different functions
                    200 = Signature provided, no fee required (a free transaction)
                    400 = Resource Provider refused to provide a signature (for any reason)
                    402 = Signature provided, but a fee is required (fee-based transaction)
            */
            switch (json.code) {
                case 402: {
                    const [, modifiedTransaction] = data.request;

                    console.log(
                        `\n\nResource Provider provided signature in exchange for a fee\n`
                    );

                    // Ensure the modifed transaction is what the application expects
                    // These validation methods will throw an exception if invalid data exists
                    await this.validateTransaction(
                        signer,
                        modifiedTransaction,
                        deserializedTransaction,
                        data.costs
                    );

                    // Sign the modified transaction
                    const signedTransaction =
                        await this.signModifiedTransaction(modifiedTransaction);

                    // Merge signatures from the user and the cosigned responsetab
                    signedTransaction.signatures = [
                        ...signedTransaction.signatures,
                        ...data.signatures,
                    ];
                    console.log(
                        `\n\nSigned transaction using both cosigner and specified account\n`
                    );

                    // Broadcast the signed transaction to the blockchain
                    try {
                        const response =
                            await this.wallet.api.pushSignedTransaction(
                                signedTransaction
                            );
                        console.log(`\n\nBroadcast response from API:\n`);
                        console.log(response);
                        return [response, undefined];
                    } catch (error) {
                        return [undefined, error];
                    }
                }

                case 200: {
                    const [, modifiedTransaction] = data.request;

                    console.log(
                        `\n\nResource Provider provided signature for free\n`
                    );

                    // Ensure the modifed transaction is what the application expects
                    // These validation methods will throw an exception if invalid data exists
                    await this.validateTransaction(
                        signer,
                        modifiedTransaction,
                        deserializedTransaction,
                        data.costs
                    );

                    // Sign the modified transaction
                    const signedTransaction =
                        await this.signModifiedTransaction(modifiedTransaction);

                    // Merge signatures from the user and the cosigned responsetab
                    signedTransaction.signatures = [
                        ...signedTransaction.signatures,
                        ...data.signatures,
                    ];
                    console.log(
                        `\n\nSigned transaction using both cosigner and specified account\n`
                    );
                    console.log(signedTransaction);

                    // Broadcast the signed transaction to the blockchain
                    const response =
                        await this.wallet.api.pushSignedTransaction(
                            signedTransaction
                        );

                    console.log(`\n\nBroadcast response from API:\n`);
                    console.log(response);
                    return [response, undefined];
                }

                // Request Refused
                case 400: {
                    console.log(
                        `\nResource Provider refused to sign the transaction\n`
                    );

                    return [null, "Refused"];
                }
            }
        } catch (error: any) {
            if (error instanceof RpcError) {
                console.log("Fuel error", error.details[0].message);
                return [undefined, String(error.details[0].message)];
            }

            return [undefined, String(error)];
        }
    }

    async signModifiedTransaction(modifiedTransaction: any) {
        const publicKey = ecc.privateToPublic(this.wallet.executorPrivateKey);
        const abis = await this.wallet.api.getTransactionAbis(
            modifiedTransaction
        );

        const serializedContextFreeData =
            this.wallet.api.serializeContextFreeData(
                modifiedTransaction.context_free_data
            );

        const serializedTransaction = this.wallet.api.serializeTransaction({
            ...modifiedTransaction,
            context_free_actions: await this.wallet.api.serializeActions(
                modifiedTransaction.context_free_actions || []
            ),
            actions: modifiedTransaction.actions,
        });

        const signedTransaction = await this.wallet.api.signatureProvider.sign({
            chainId: consts.CHAIN_ID,
            requiredKeys: [publicKey],
            serializedTransaction,
            serializedContextFreeData,
            abis,
        });

        return signedTransaction;
    }

    // Validate the transaction
    async validateTransaction(
        signer: any,
        modifiedTransaction: any,
        serializedTransaction: any,
        costs = false
    ) {
        // Ensure the first action is the `greymassnoop:noop`
        this.validateNoop(modifiedTransaction);

        // Ensure the actions within the transaction match what was provided
        await this.validateActions(
            signer,
            modifiedTransaction,
            serializedTransaction,
            costs
        );
    }

    // Validate the actions of the modified transaction vs the original transaction
    async validateActions(
        signer: any,
        modifiedTransaction: any,
        deserializedTransaction: any,
        costs: any
    ) {
        // Determine how many actions we expect to have been added to the transaction based on the costs
        const expectedNewActions = this.determineExpectedActionsLength(costs);

        // Ensure the proper number of actions was returned
        this.validateActionsLength(
            expectedNewActions,
            modifiedTransaction,
            deserializedTransaction
        );

        // Ensure the appended actions were expected
        await this.validateActionsContent(
            signer,
            expectedNewActions,
            modifiedTransaction,
            deserializedTransaction
        );
    }

    // Validate the number of actions is the number expected
    determineExpectedActionsLength(costs: any) {
        // By default, 1 new action is appended (noop)
        let expectedNewActions = 1;

        // If there are costs associated with this transaction, 1 new actions is added (the fee)
        if (costs) {
            expectedNewActions += 1;
            // If there is a RAM cost associated with this transaction, 1 new actio is added (the ram purchase)
            console.log(costs);
            if (costs.ram !== "0.0000 EOS") {
                expectedNewActions += 1;
            }
        }

        return expectedNewActions;
    }

    // Validate the contents of each action
    async validateActionsContent(
        signer: any,
        expectedNewActions: any,
        modifiedTransaction: any,
        deserializedTransaction: any
    ) {
        // Make sure the originally requested actions are still intact and unmodified
        this.validateActionsOriginalContent(
            expectedNewActions,
            modifiedTransaction,
            deserializedTransaction
        );

        // If a fee has been added, ensure the fee is set properly
        if (expectedNewActions > 1) {
            await this.validateActionsFeeContent(signer, modifiedTransaction);
            // If a ram purchase has been added, ensure the purchase was set properly
            if (expectedNewActions > 2) {
                await this.validateActionsRamContent(
                    signer,
                    modifiedTransaction
                );
            }
        }
    }

    // Ensure the transaction fee transfer is valid
    async validateActionsFeeContent(signer: any, modifiedTransaction: any) {
        const maxFee = 0;

        const [feeAction] = await this.wallet.api.deserializeActions([
            modifiedTransaction.actions[1],
        ]);
        const amount = parseFloat(feeAction.data.quantity.split(" ")[0]);
        if (amount > maxFee) {
            throw new Error(
                `Fee of ${amount} exceeds the maximum fee of ${maxFee}.`
            );
        }
        if (
            feeAction.account !== "eosio.token" ||
            feeAction.name !== "transfer" ||
            feeAction.data.to !== "fuel.gm"
        ) {
            throw new Error("Fee action was deemed invalid.");
        }
    }

    // Ensure the RAM purchasing action is valid
    async validateActionsRamContent(signer: any, modifiedTransaction: any) {
        const [ramAction] = await this.wallet.api.deserializeActions([
            modifiedTransaction.actions[2],
        ]);
        if (
            ramAction.account !== "eosio" ||
            !["buyram", "buyrambytes"].includes(ramAction.name) ||
            ramAction.data.payer !== "greymassfuel" ||
            ramAction.data.receiver !== signer.actor
        ) {
            throw new Error("RAM action was deemed invalid.");
        }
    }

    // Make sure the actions returned in the API response match what was submitted
    validateActionsOriginalContent(
        expectedNewActions: any,
        modifiedTransaction: any,
        deserializedTransaction: any
    ) {
        for (const [i] of modifiedTransaction.actions.entries()) {
            // Skip the expected new actions
            if (i < expectedNewActions) continue;
            // Compare each action to the originally generated actions
            if (
                !modifiedTransaction.actions[i] ||
                modifiedTransaction.actions[i].account !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .account ||
                modifiedTransaction.actions[i].name !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .name ||
                modifiedTransaction.actions[i].authorization.length !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization.length ||
                modifiedTransaction.actions[i].authorization[0].actor !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization[0].actor ||
                modifiedTransaction.actions[i].authorization[0].permission !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization[0].permission ||
                modifiedTransaction.actions[i].data.toLowerCase() !==
                    deserializedTransaction.actions[
                        i - expectedNewActions
                    ].data.toLowerCase()
            ) {
                const { account, name } =
                    deserializedTransaction.actions[i - expectedNewActions];
                throw new Error(
                    `Transaction returned by API has non-matching action at index ${i} (${account}:${name})`
                );
            }
        }
    }

    // Ensure no unexpected actions were appended in the response
    validateActionsLength(
        expectedNewActions: any,
        modifiedTransaction: any,
        deserializedTransaction: any
    ) {
        if (
            modifiedTransaction.actions.length !==
            deserializedTransaction.actions.length + expectedNewActions
        ) {
            throw new Error(
                "Transaction returned contains additional actions."
            );
        }
    }

    // Make sure the first action is the greymassnoop:noop and properly defined
    validateNoop(modifiedTransaction: any) {
        if (
            modifiedTransaction.actions[0].account !== "greymassnoop" ||
            modifiedTransaction.actions[0].name !== "noop" ||
            modifiedTransaction.actions[0].authorization[0].actor !==
                "greymassfuel" ||
            modifiedTransaction.actions[0].authorization[0].permission !==
                "cosign" ||
            modifiedTransaction.actions[0].data !== ""
        ) {
            throw new Error(
                "First action within transaction response is not valid greymassnoop:noop."
            );
        }
    }
}
