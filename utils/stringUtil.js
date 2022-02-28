const convertToLowercase=(name)=>{
  return name.replace(/\s+/g, "-").toLowerCase();
}

module.exports={
  convertToLowercase
}