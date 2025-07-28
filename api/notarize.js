// api/notarize.js - DECODING VERSION
import { ThorClient } from "@vechain/sdk-network";
import { buildErrorResponse, buildSuccessResponse } from "../_utils/response-builder";
import { TransactionHandler, cry } from "@vechain/sdk-core";

export default async function handler(req, res) {
    try {
        // --- THE FIX IS HERE: DECODE THE KEY ---
        const encodedKey = process.env.VECHAIN_PRIVATE_KEY_B64;
        if (!encodedKey) {
            return buildErrorResponse(res, 500, 'Server Config Error', 'VECHAIN_PRIVATE_KEY_B68 is not set.');
        }
        // Decode the Base64 string back to the original mnemonic phrase
        const mnemonicString = Buffer.from(encodedKey, 'base64').toString('ascii');
        
        const privateKeyBytes = cry.mnemonic.toPrivateKey(mnemonicString.split(' '));
        const account = cry.secp256k1.deriveAddress(privateKeyBytes);
        
        const thorClient = new ThorClient(process.env.VECHAIN_NODE_URL);
        const { hash } = req.body;
        if (!hash || !hash.startsWith('0x')) {
            return buildErrorResponse(res, 400, 'Invalid hash parameter.');
        }

        const clauses = [{ to: account, value: '0x0', data: hash }];
        const gasResult = await thorClient.gas.estimateGas(clauses, account);
        const blockRef = await thorClient.blocks.getBestBlockRef();
        const chainTag = await thorClient.thor.getChainTag();
        
        const body = { clauses, gas: gasResult.totalGas, blockRef, chainTag, gasPriceCoef: 128, expiration: 32, nonce: Date.now() };
        const signature = cry.secp256k1.sign(TransactionHandler.signingHash(body), privateKeyBytes);
        const { id } = await thorClient.transactions.sendTransaction({ raw: TransactionHandler.encode(body, false), signature, origin: account });

        return buildSuccessResponse(res, { transactionId: id });
    } catch (error) {
        return buildErrorResponse(res, 500, 'API execution failed.', { message: error.message });
    }
}

