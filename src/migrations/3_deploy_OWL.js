function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const { SafeMath } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => SafeMath.deployed())
    .then(() => deployer.link(SafeMath, [ TokenOWL, TokenOWLProxy ]))
    .then(() => deployer.deploy(TokenOWL))
    .then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}

function _getDependencies (artifacts, network, deployer) {
  let SafeMath
  if (network === 'development') {
    SafeMath = artifacts.require('SafeMath')
  } else {
    const contract = require('truffle-contract')
    SafeMath = contract(require('openzeppelin-solidity/contracts/math/SafeMath'))
    SafeMath.setProvider(deployer.provider)
  }

  return {
    SafeMath
  }
}

module.exports = migrate
