const CrowdSaleTemplate = artifacts.require('./CrowdSaleTemplate');
const MintableTokenTemplate = artifacts.require('./MintableTokenTemplate');

// const GustavoCoin = artifacts.require('./GustavoCoin.sol');

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
  };

module.exports = function(deployer, network, accounts) {
    const timeNow = Math.floor(Date.now() / 1000);
    const openingTime = timeNow  + duration.seconds(30);
    const closingTime = timeNow  + duration.years(1);
    const rate = 1000;
    const wallet = accounts[1];
    const cap = 1000000000;

    const name = 'TEST TOKEN'
    const symbol = 'TTT'
    const decimals = 0
    const totalSupply = 1000000

    return deployer
        .then(() => {
            return deployer.deploy(
                MintableTokenTemplate, 
                // name,
                // symbol,
                // decimals,
                // totalSupply
                )
        })
        .then(() => {
            return deployer.deploy(
                CrowdSaleTemplate,
                rate,
                wallet,
                openingTime,
                closingTime,
                cap,
                MintableTokenTemplate.address
            );
        });
};