// api/notarize.js

import { ThorClient, VechainProvider } from "@vechain/sdk-network";
import { buildErrorResponse, buildSuccessResponse } from "../_utils/response-builder";
import { TransactionHandler, secp256k1 } from "@vechain/sdk-core";

// Load private key from environment variables
const privateKey = process.env.VECHAIN_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("VECHAIN_PRIVATE_KEY is not set in environment variables.");
}
const account = secp256k1.deriveKey(Buffer.from(privateKey, 'hex')).deriveAddress();

// Initialize ThorClient to connect to the VeChain testnet
const thorClient = new ThorClient(process.env.VECHAIN_NODE_URL || "https://testnet.vechain.org/" );
const provider = new VechainProvider(thorClient, undefined, false); // Fee delegation disabled

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return buildErrorResponse(res, 405, 'Method Not Allowed');
  }

  try {
    const { hash } = req.body;

    if (!hash || typeof hash !== 'string' || !hash.startsWith('0x')) {
      return buildErrorResponse(res, 400, 'Invalid or missing hash parameter.');
    }

    // 1. Build the transaction clauses
    const clauses = [{
      to: account, // Send to self
      value: 0,
      data: hash,
    }];

    // 2. Estimate gas and get block info
    const gasResult = await thorClient.gas.estimateGas(clauses, account);
    const blockRef = thorClient.blocks.getBestBlockRef();
    const chainTag = thorClient.thor.getChainTag();
    
    const body = {
        clauses,
        gas: gasResult.totalGas,
        blockRef: await blockRef,
        chainTag: await chainTag,
        gasPriceCoef: 128,
        expiration: 32,
        dependsOn: null,
        nonce: Date.now(),
    };

    // 3. Sign and send the transaction
    const rawTransaction = TransactionHandler.encode(body, false);
    const signature = secp256k1.sign(TransactionHandler.signingHash(body), Buffer.from(privateKey, 'hex'));
    const signedTx = {
        raw: rawTransaction,
        signature: signature,
        origin: account
    };

    const sentTx = await provider.sendTransaction(signedTx);

    // 4. Respond with the transaction ID
    return buildSuccessResponse(res, {
      message: "Transaction sent successfully!",
      transactionId: sentTx.id
    });

  } catch (error) {
    console.error("Vechain SDK Error:", error);
    return buildErrorResponse(res, 500, 'Internal Server Error', error.message);
  }
}
