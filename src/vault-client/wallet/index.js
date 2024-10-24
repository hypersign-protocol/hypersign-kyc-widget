
const { HypersignDID } = require('hs-ssi-sdk')
const { X25519KeyAgreementKey2020 } = require("@digitalbazaar/x25519-key-agreement-key-2020")
const { Ed25519VerificationKey2020 } = require("@digitalbazaar/ed25519-verification-key-2020")

const bip39 = require("bip39")

// 'rigid tribe noise city fashion industry amazing outside glue tide meadow draw option private north cheese winter exotic shop address million finish aunt ritual'
export class VaultWallet {
    constructor(options = {}) {
        if (options.mnemonic) {
            this.mnemonic = options.mnemonic
        } else {
            this.mnemonic = bip39.generateMnemonic(256)
            console.log(this.mnemonic)
        }
        this.hsDidSdk = new HypersignDID({ namespace: "testnet" })
    }

    async Init() {
        // debugger //eslint-disable-line 
        const seedEntropy = this._getSeedEntropy();
        this.hskeys = [await this.hsDidSdk.generateKeys({
            seed: seedEntropy,
        })]

        this.hskeys.push(
            await this.hsDidSdk.bjjDID.generateKeys({
                mnemonic: this.mnemonic
            })
        )


        this.keys = this.hskeys.find(x => x.type == "Ed25519VerificationKey2020")
        this.bjjKeys = this.hskeys.find(x => x.type == "BabyJubJubKey2021")
        this.didDocument = await this.hsDidSdk.generate({
            publicKeyMultibase: this.keys.publicKeyMultibase,
        });
        this.didDocument = await this.hsDidSdk.addVerificationMethod({
            didDocument: this.didDocument,
            type: "BabyJubJubKey2021", publicKeyMultibase: this.bjjKeys.publicKeyMultibase
            
        })
        delete this.didDocument.alsoKnownAs
        this.authenticationKey = this._getAuthenticationKey(
            this.didDocument.id,
            this.keys.publicKeyMultibase,
            this.keys.privateKeyMultibase,
        );
        this.ed25519Signer = await Ed25519VerificationKey2020.from(
            this.authenticationKey,
        );
        this.x25519Signer =
            await X25519KeyAgreementKey2020.fromEd25519VerificationKey2020({
                keyPair: {
                    publicKeyMultibase: this.keys.publicKeyMultibase,
                    privateKeyMultibase: this.keys.privateKeyMultibase,
                },
            });
        this.x25519Signer.id =
            this.didDocument.id.split('#')[0] +
            '#' +
            this.x25519Signer.publicKeyMultibase;


        this.keyAgreementKey = {
            id:
                this.didDocument.id.split('#')[0] +
                '#' +
                this.x25519Signer.publicKeyMultibase,
            type: 'X25519KeyAgreementKey2020',
            publicKeyMultibase: this.x25519Signer.publicKeyMultibase,
            privateKeyMultibase: this.x25519Signer.privateKeyMultibase,
        };

        this.keyResolver = async () => {
            // Resolve the key from the DID Document or from the blockchain or from any other source
            // sample authentication key after did resolution
            // Caution: This is just a sample snippet (This will cause error). You should resolve the key from the DID Document or from the blockchain or from any other source

            const authenticationKey = {
                '@context': 'https://w3id.org/security/suites/ed25519-2020/v1',
                id:
                    this.didDocument.id.split('#')[0] +
                    '#' +
                    this.keys.publicKeyMultibase,
                controller: this.didDocument.id,
                publicKeyMultibase: this.keys.publicKeyMultibase,
            };
            const ed25519 = await Ed25519VerificationKey2020.from(authenticationKey);
            return ed25519;
        };
        return this;
    }

    _getAuthenticationKey(
        controller,
        publicKeyMultibase,
        privateKeyMultibase,
    ) {
        return {
            '@context': 'https://w3id.org/security/suites/ed25519-2020/v1',
            id: controller.split('#')[0] + '#' + publicKeyMultibase,
            controller,
            publicKeyMultibase,
            privateKeyMultibase,
        };
    }

    _getSeedEntropy() {
        const seed = bip39.mnemonicToEntropy(this.mnemonic);
        const seedBuffer = Buffer.from(seed, 'hex')
        return seedBuffer
    }
}

export class VaultWalletManager {
    static async getWallet(
        mnemonic,
    ) {
        return new VaultWallet({ mnemonic }).Init();
    }
}