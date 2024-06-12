const bcrypt = require('bcrypt');

module.exports=async()=>{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234',salt);
    return hashed;
}

// module.exports.checkPassword = async()=>{
//     const validPassword = await bcrypt.compare(enteredPass , userPass) 
//     return validPassword
// }
