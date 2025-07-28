// api/lookup.js

import { ThorClient } from "@vechain/sdk-network";
import { buildErrorResponse, buildSuccessResponse } from "../_utils/response-builder";

export default async function handler(req, res) {
    // Check for secrets immediately to fail fast with a clear error
    if (!process.env.VECHAIN_NODE_URL) {
        return buildErrorResponse(res, 500, 'Server Configuration Error', 'VECHAIN_NODE_URL is not defined on the server.');
    }
    if (!process.env.VECHAIN_FROM_ADDRESS) {
        return buildErrorResponse(res, 500, 'Server Configuration Error', 'VECHAIN_FROM_ADDRESS is not defined on the server.');
    }

    const thorClient = new ThorClient(process.env.VECHAIN_NODE_URL);
    const fromAddress = process.env.VECHAIN_FROM_ADDRESS;

    if (req.method !== 'GET') {
        return buildErrorResponse(res, 405, 'Method Not Allowed');
    }

    const { query } = req.query;
    if (!query || !query.startsWith('0x')) {
        return buildErrorResponse(res, 400, 'Invalid query. Must be a hash or TX ID starting with 0x.');
    }

    try {
        let transactions = [];
        // Check if it's a transaction ID
        if (query.length === 66) {
            const tx = await thorClient.transactions.getTransaction(query);
            if (tx) {
                transactions.push(tx);
            }
        } else { // Assume it's a document hash
            const response = await thorClient.transactions.getTransactions({
                range: { unit: 'block', from: 0, to: (await thorClient.blocks.getBestBlock()).number },
                criteriaSet: [{ sender: fromAddress, data: query }],
                order: 'desc',
            });
            if (response && response.transactions) {
                transactions = response.transactions;
            }
        }

        if (transactions.length === 0) {
            return buildSuccessResponse(res, []);
        }

        // Format the results consistently
        const formattedTxs = transactions.map(tx => ({
            id: tx.id,
            hash: tx.clauses[0]?.data || 'N/A',
            timestamp: tx.blockTimestamp,
            blockNumber: tx.blockNumber,
            origin: tx.origin,
        }));

        return buildSuccessResponse(res, formattedTxs);

    } catch (error) {
        // This is the new, improved error handling.
        // It will send the exact error message to the frontend.
        console.error("Lookup API Runtime Error:", error);
        const errorMessage = error.message || 'An unknown error occurred.';
        const errorStack = error.stack || 'No stack trace available.';
        return buildErrorResponse(res, 500, 'API execution failed.', { message: errorMessage, stack: errorStack });
    }
}
