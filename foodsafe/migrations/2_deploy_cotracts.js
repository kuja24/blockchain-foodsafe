var Foodsafe= artifacts.require("./FoodSafe.sol");

module.exports = function(deployer){
    deployer.deploy(Foodsafe);
};