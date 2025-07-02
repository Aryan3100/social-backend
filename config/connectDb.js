const mongooes = require('mongoose');

async function connectdb(url) {
    try{
      return  await  mongooes.connect(url).then(console.log('db connect sucesses'))
    }catch(err){
        console.log(err)
    }
}

module.exports = connectdb; 