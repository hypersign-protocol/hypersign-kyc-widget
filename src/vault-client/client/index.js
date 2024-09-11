const { HypersignEdvClientEd25519VerificationKey2020 } = require("@hypersign-protocol/hypersign-vault-client");

export class VaultClient {
    constructor(vaultWallet, { edvId, edvUrl } = {}) {
        if (!vaultWallet) {
            throw new Error('VaultWallet is required')
        }

        this.vaultWallet = vaultWallet;
        this.didDocument = this.vaultWallet.didDocument;
        this.keyResolver = this.vaultWallet.keyResolver;

        if (edvId) {
            this.edvId = edvId;
        } else {
            // this.edvId = randomString();
        }

        if (edvUrl) {
            this.edvUrl = edvUrl;
        } else {
            this.edvUrl = 'https://edv.hypersign.id'
        }

    }

    async Init() {
        const ed25519 = this.vaultWallet.ed25519Signer;
        const x25519 = this.vaultWallet.ed25519Signer;
        const keyAgreementKey = this.vaultWallet.keyAgreementKey;

        this.recipient = [
            {
                ...keyAgreementKey,
                publicKeyMultibase: x25519.publicKeyMultibase,
            },
        ];

        this.vault = new HypersignEdvClientEd25519VerificationKey2020({
            keyResolver: this.keyResolver,
            url: this.edvUrl,
            ed25519VerificationKey2020: ed25519,
            x25519KeyAgreementKey2020: x25519,
        });

        const config = {
            url: this.edvUrl,
            keyAgreementKey,
            controller: this.vaultWallet.authenticationKey.id,
            edvId: this.edvId
                ? this.edvId
                : 'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66',
        };

        await this.vault.registerEdv(config);
    }

    PrepareEdvDocument(
        content,
        indexes,
        recipients = null,
    ) {
        const document = {
            document: { content },
            edvId: this.edvId,
            indexs: indexes,
            recipients: recipients ? recipients : this.recipient,
        };
        return document;
    }

    async CreateDocument({ preparedDoc }) {
        if (preparedDoc['recipients'].length == 0) {
            preparedDoc['recipients'] = this.recipient;
        }
        console.log(preparedDoc)
        const resp = await this.vault.insertDoc({ ...preparedDoc });
        if (resp && resp['statusCode'] && resp['statusCode'] === 500) {
            throw new Error(JSON.stringify(resp['message']));
        }

        return {
            id: resp?.document.id,
            sizeInBytes: resp?.document.sizeInbytes,
        };
    }

    async GetDocument(id) {
        const resp = await this.vault.fetchDoc({
            edvId: this.edvId,
            documentId: id,
        });
        return resp;
    }

    async GetDecryptedDocument(id) {
        const doc = await this.GetDocument(id);
        if (!doc.document) {
            throw new Error(doc.message);
        }
        let decryptedObject;
        decryptedObject = await this.vault.decryptObject({
            keyAgreementKey: this.vaultWallet.x25519Signer,
            jwe: doc.document.jwe,
        });

        if (!decryptedObject) {
            throw new Error('Unable to decrypt document for id ' + id);
        }
        const { content } = decryptedObject;
        return content;
    }

    async Query({
        equals,
        has
    }) {
        const resp = await this.vault.Query({
            edvId: this.edvId,
            equals: equals,
            has: has,
        });
        return resp;
    }

    async Delete() {
        return await this.vault.deleteVaultData({ edvId: this.edvId })
    }

}




