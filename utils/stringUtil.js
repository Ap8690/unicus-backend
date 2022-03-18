const convertToLowercase=(name)=>{
  return name.replace(/\s+/g, "-").toLowerCase();
}
const isReservedWord=(name)=>{
  const reservedWord =["marketplace", "nft", "one", "unicus", "admin", "info", "home", "explore"]
  return reservedWord.some(word=> name == word) || name.includes("unicus")
}

module.exports={
  convertToLowercase,
  isReservedWord
}