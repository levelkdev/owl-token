const GNO_LOCK_PERIOD_IN_HOURS = 30 * 24 // 30 days

function migrate ({
  artifacts,
  deployer,
  network,
  accounts,
  web3,
  gnoLockEndTime = _getDefaultLockEndTime()
}) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')
  const { SafeMath, TokenGNO } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => SafeMath.deployed())
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then(() => TokenOWLProxy.deployed())
    .then(() => deployer.link(SafeMath, [ OWLAirdrop ]))
    .then(() => {
      const owlProxyAddress = TokenOWLProxy.address
      const gnoAddress = TokenGNO.address

      console.log('Deploy AirDrop:')
      console.log('\t OWL proxy address: %s', owlProxyAddress)
      console.log('\t GNO address: %s', gnoAddress)
      console.log('\t End time: %s', gnoLockEndTime)

      return deployer.deploy(
        OWLAirdrop,
        owlProxyAddress,
        gnoAddress,
        gnoLockEndTime.getTime() / 1000
      )
    })
}

function _getDefaultLockEndTime () {
  const now = new Date()
  return new Date(now.getTime() + GNO_LOCK_PERIOD_IN_HOURS * 60 * 60 * 1000)
}

function _getDependencies (artifacts, network, deployer) {
  let SafeMath, TokenGNO
  if (network === 'development') {
    SafeMath = artifacts.require('SafeMath')
    TokenGNO = artifacts.require('TokenGNO')
  } else {
    const contract = require('truffle-contract')
    SafeMath = contract(require('openzeppelin-solidity/contracts/math/SafeMath'))
    SafeMath.setProvider(deployer.provider)
    TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
    TokenGNO.setProvider(deployer.provider)
  }

  return {
    SafeMath,
    TokenGNO
  }
}

module.exports = migrate
