const Web3 = require("web3");
const TronWeb = require("tronweb");
const nacl = require("tweetnacl");
const bs58 = require("bs58");
const Buffer = require("buffer/").Buffer;
const NearApi = require("near-api-js");
const js_sha256 = require("js-sha256")

const verifyTokenAddress = async (
    token,
    walletNetwork,
    message,
    walletAddress
) => {
    if (walletNetwork === "Metamask") {
        var web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
        const verify = await web3.eth.accounts.recover(message, token);
        if (verify.toLowerCase() !== walletAddress.toLowerCase()) return false;
    } else if (walletNetwork === "Tron") {
        const fullNode = "https://api.shasta.trongrid.io";
        const solidityNode = "https://api.shasta.trongrid.io";
        const eventServer = "https://api.shasta.trongrid.io";
        const privateKey = "";
        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            privateKey
        );
        var verify = await tronWeb.trx.verifyMessage(
            message,
            token,
            walletAddress
        );

        if (!verify) return false;
    } else if (walletNetwork === "Solana") {
        const { publicKey, signature } = token;
        const verified = nacl.sign.detached.verify(
            new TextEncoder().encode(message),
            Buffer.from(signature, "hex"),
            bs58.decode(publicKey)
        );
        if (!verified) return false;
    } else if (walletNetwork === "Near") {
        let { publicKey, signature } = token;
        let msg = Uint8Array.from(js_sha256.sha256.array(message));
        signature = Uint8Array.from(Object.values(signature));
        publicKey = Uint8Array.from(Object.values(publicKey.data));
        const verified = nacl.sign.detached.verify(msg, signature, publicKey);
        if (!verified) return false;
        return true;
    }
    return true;
};
module.exports = {
    verifyTokenAddress,
};
