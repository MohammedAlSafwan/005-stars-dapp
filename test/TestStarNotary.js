const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;
var tokenName = "SmokedCutPotato";
var tokenSymble = "SCP";

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("can Create a Star", async () => {
  let tokenId = 1;
  let instance = await StarNotary.deployed();
  await instance.createStar("Awesome Star!", tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Awesome Star!");
});

it("lets user1 put up their star for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it("lets user1 get the funds after the sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 3;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value: balance });
  let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
  let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
  let value2 = Number(balanceOfUser1AfterTransaction);
  assert.equal(value1, value2);
});

it("lets user2 buy a star, if it is put up for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 4;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it("lets user2 buy a star and decreases its balance in ether", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
  let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
  assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it("can add the star name and star symbol properly", async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed();
  let starId = 6;
  let user1 = accounts[1];
  await instance.createStar("blue", starId, { from: user1 });
  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided

  assert.equal(await instance.name(), tokenName);
  assert.equal(await instance.symbol(), tokenSymble);
  assert.equal(await instance.lookUptokenIdToStarInfo(starId), "blue");
});

it("lets 2 users exchange stars", async () => {
    let instance = await StarNotary.deployed();
    // 1. create 2 Stars with different tokenId
    user1 = accounts[0]
    user2 = accounts[2]
    starId1 = 5;
    starId2 = 6;
    await instance.createStar('blue', starId1, {from: user1});
    await instance.createStar('red', starId2, {from: user2});
    let owner_1 = await instance.ownerOf.call(starId1);
    assert.equal(owner_1, user1);
    let owner_2 = await instance.ownerOf.call(starId2);
    assert.equal(owner_2, user2);
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starId1, starId2);
    // 3. Verify that the owners changed
    let new_owner_1 = await instance.ownerOf.call(starId1);
    assert.equal(new_owner_1, user2);
    let new_owner_2 = await instance.ownerOf.call(starId2);
    assert.equal(new_owner_2, user1);
});

it("lets a user transfer a star", async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed();
  let tokenId = 9;
  let user1 = accounts[2];
  let user2 = account[3]
  await instance.createStar("blue", tokenId, { from: user2 });
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(user1, tokenId, { from: user2 });
  // 3. Verify the star owner changed.
  assert.equal(await instance.ownerOf.call(tokenId), user2);
});

it("lookUptokenIdToStarInfo test", async () => {
  let instance = await StarNotary.deployed();
  let tokenId = 50;
  // 1. create a Star with different tokenId
  await instance.createStar("blue", tokenId, { from: accounts[4] });
  // 2. Call your method lookUptokenIdToStarInfo
  // 3. Verify if you Star name is the same
  assert.equal(await instance.lookUptokenIdToStarInfo(tokenId), "blue");
});
