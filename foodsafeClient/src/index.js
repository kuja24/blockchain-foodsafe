const Web3 = require('web3');
CryptoJS = require('crypto-js');

var web3 = new Web3(Web3.givenProvider())

var foodSafeABI, foodSafeContract,account;   // ABI - application binary inteface

window.App = {
    start: function()
    {
        web3.eth.getAccounts(function(err,accounts){
            account = accounts[0];
            web3.eth.defaultAccount = account;
        })
        const Http = new XMLHttpRequest();
        const url = 'http://localhost:3000';
        Http.open('GET',url);
        Http.send();

        Http.onreadystatechange = function(){
            if(this.readyState==4 && this.status==200)
            {
                var output = JSON.parse(this.response);
                foodSafeCode = output.contracts[":FoodSafe"].bytecode;
                var metadata = JSON.parse( output.contracts[":FoodSafe"].metadata);
                foodSafeABI = metadata.output.abi;
                foodSafeContract = new web3.eth.Contract(foodSafeABI);
            }
        }
    },
    createContract: function()
    {
        foodSafeContract.deploy({data:foodSafeCode}).send({from:account,data:foodSafeCode,gas:3000000})
        .on('confirmation',function(confirmationNumber,receipt){ })
        .then(function(newContractInstance){
            deployedContract = newContractInstance;
            document.getElementById("contractAddress").value = deployedContract.options.address;
        })

    },
    addNewLocation: function()
    {
        var contractAddress = document.getElementById("contractAddress").value;
        var deployedFoodSafe = new web3.eth.Contract(foodSafeABI,contractAddress,{from:account,gas:3000000});
        var locationId = document.getElementById("locationId").value;
        var locationName = document.getElementById("locationName").value;
        var locationSecret = document.getElementById("locationSecret").value;
        var passPhrase = document.getElementById("passphrase").value;
        var encryptedSecret = CryptoJS.AES.encrypt(locationSecret,passPhrase).toString;
        deployedFoodSafe.methods.AddNewLocation(locationId,locationName,encryptedSecret).send({from:account});
    },
    getCurrentLocation: function()
    {
        var contractAddress = document.getElementById("contractAddress").value;
        var deployedFoodSafe = new web3.eth.Contract(foodSafeABI,contractAddress,
            {from:web3.eth.defaultAccount,gas:3000000});
        var passPhrase = document.getElementById("passphrase").value;
        deployedFoodSafe.methods.GetTrailCount.call().then(function(trailCount){
            deployedFoodSafe.methods.GetLocation(trailCount-1).call().then(function(retval){
                document.getElementById("locationName").value = retval[0];
                document.getElementById("locationId").value = retval[1];
                var encryptedSecret = retval[4];
                var decryptedSecret = CryptoJS.AES.decrypt(encryptedSecret,passPhrase).toString(CryptoJS.enc.Utf8);
                document.getElementById("secret").value = decryptedSecret;
            })
        });
    }

}

window.addEventListener('load',function(){
    App.start();
})