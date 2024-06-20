import * as bip39 from 'bip39';
import { Bip39, Slip10, Slip10RawIndex, Slip10Curve } from '@cosmjs/crypto';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

export function generateMnemonicForWallet() {
    return bip39.generateMnemonic()
}

function makeSSIWalletPath(minHardIndex) {
    return [
        Slip10RawIndex.hardened(118),
        Slip10RawIndex.hardened(128),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.hardened(minHardIndex),
    ];
}

export async function generateMnemonicToHDSeed(mnemonic, minHardIndex = 0) {
    console.log(mnemonic)

    minHardIndex = minHardIndex + 1;
    const seed = Bip39.decode(mnemonic)
    const slipPathKeys = Slip10.derivePath(Slip10Curve.Ed25519, seed, makeSSIWalletPath(minHardIndex))
    const seedHD = slipPathKeys.privkey
    return seedHD;
}
