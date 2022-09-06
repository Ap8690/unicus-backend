const Web3 = require('web3')
const TronWeb = require('tronweb')
const nacl = require('tweetnacl')
const bs58 = require('bs58')
const Buffer = require('buffer/').Buffer
const NearApi = require('near-api-js')

const verifyTokenAddress = async (token,walletNetwork,message,walletAddress) => {
  
  if(walletNetwork === "Metamask") {
    var web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    const verify = await web3.eth.accounts.recover(message,token)
    console.log("verify: ", verify)
    if(verify.toLowerCase() !== walletAddress.toLowerCase()) return false
  }
  else if (walletNetwork === "Tron") {
    
    const fullNode = 'https://api.shasta.trongrid.io'
    const solidityNode = 'https://api.shasta.trongrid.io'
    const eventServer = 'https://api.shasta.trongrid.io'
    const privateKey = ''
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey)
    var verify = await tronWeb.trx.verifyMessage(message,token,walletAddress)

    if(!verify) return false
  }
  else if (walletNetwork === "Solana") { 
    const { publicKey, signature } = token
    const verified = nacl
      .sign
      .detached
      .verify(
        new TextEncoder().encode(message),
        Buffer.from(signature,'hex'),
        bs58.decode(publicKey)
      )
      if(!verified) return false
  } 
  else if(walletNetwork === "Near") {
    const { publicKey, signature } = token
    // if (typeof message === 'string') {
    //   message = Buffer.from(message, 'utf-8');
    // }
    // console.log("message",message)
    // console.log("publicKey",publicKey)
    // const npk = new NearApi.utils.PublicKey(publicKey)
    // console.log("signature ",new Uint8Array(Buffer.from(signature)))
    // console.log("message ",typeof message)
    // console.log("Buffer.from(message): ", new Uint8Array(new TextEncoder().encode(message)));
    // const verified = npk.verify(new Uint8Array(new TextEncoder().encode(message)),new Uint8Array(Buffer.from(signature)))
    // console.log("verified: ", verified);
    // console.log("npk: ", npk);
    // console.log("publick ",bs58.decode(publicKey))
    // const verified = nacl
    //   .sign
    //   .detached
    //   .verify(
    //     new TextEncoder().encode(message),
    //     Buffer.from(signature,'hex'),
    //     npk
    //   )
      // if(!verified) return false
      return true
  }
  return true
}
module.exports={
  verifyTokenAddress
}