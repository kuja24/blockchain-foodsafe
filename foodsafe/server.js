var express = require('express');
var cors = require('cors');
var solc = require('solc');
var fs = require('fs');
var path = require('path');

var app = express();
app.use(cors());

app.listen(3000);

app.get('/',function(req,res){
    const contractPath = path.resolve(__dirname,'contracts','foodsafe.sol');
    var contractSource = fs.readFileSync(contractPath).toString('utf-8');
    var compiledContract = solc.compile(contractSource);
    res.status(200);
    res.send(compiledContract);
})