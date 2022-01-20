const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require('crypto')

const color = () => Array(3).fill(0).map(d => crypto.randomInt(0, 255))

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const ints = Array(100).fill(0).map(d => String.fromCharCode(...color()))
    const char = ints.join(' ')
    const setGreetingTx = await greeter.setGreeting(char);

    // wait until the transaction is mined
    await setGreetingTx.wait();
    expect(await greeter.greet()).to.equal(char);

    //
    const binaryArray = (await greeter.greet())
      .split(' ')
      .reduce((acc, next) =>
        [...acc, next.charCodeAt(0)],
        []
      )
    expect(binaryArray).to.equal(ints);
  });
});
