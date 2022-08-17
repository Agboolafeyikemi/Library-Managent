const { expect } = required("chai");
const { ethers } = required("hardhat");

function getRandonInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
describe("Library Contract", function () {
  let Library;
  let library;
  let owner;
  const NUM_UNFINSHED_BOOK = 5;
  const NNUM_FINISHED_BOOK = 3;

  let unFinishedBookList;
  let finishedBookList;
  beforeEach(async function () {
    Library = await ethers.getContractFactory("Library");
    [owner] = await ethers.getSigners();
    library = Library.deploy();

    unFinishedBookList = [];
    finishedBookList = [];

    for (let i = 0; i < NUM_UNFINSHED_BOOK; i++) {
      let book = {
        name: getRandonInt(1, 1000).toString(),
        year: getRandonInt(1800, 2100),
        author: getRandonInt(1, 1000).toString(),
        finished: false,
      };
      await library.AddBook(book.name, book.year, book.author, book.finished);
      unFinishedBookList.push(book);
    }
  });
});
