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
  const NUM_FINISHED_BOOK = 3;

  let unFinishedBookList;
  let finishedBookList;
  beforeEach(async function () {
    Library = await ethers.getContractFactory("Library");
    [owner] = await ethers.getSigners();
    library = Library.deploy();

    let unFinishedBookList;
    let finishedBookList;
    function verifyBook(booksfromChain, book) {
      expect(book.name).to.equal(booksfromChain.name);
      expect(book.year.toString()).to.equal(booksfromChain.year.toString());
      expect(book.author).to.equal(booksfromChain.author);
    }
    function verifyBookList(booksfromChain, bookList) {
      expect(booksfromChain.length).to.not.equal(0);
      expect(booksfromChain.length).to.equal(bookList.length);

      for (let i = 0; i < NUM_UNFINSHED_BOOK; i++) {
        const bookChain = booksfromChain[i];
        const book = bookList[i];
        verifyBook(bookChain, book);
      }
    }
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

    for (let i = 0; i < NUM_FINISHED_BOOK; i++) {
      let book = {
        name: getRandonInt(1, 1000).toString(),
        year: getRandonInt(1800, 2100),
        author: getRandonInt(1, 1000).toString(),
        finished: false,
      };
      await library.AddBook(book.name, book.year, book.author, book.finished);
      finishedBookList.push(book);
    }
  });
  describe("Add Book", function () {
    it("should emit AddBook event", async () => {
      let book = {
        name: getRandonInt(1, 1000).toString(),
        year: getRandonInt(1800, 2100),
        author: getRandonInt(1, 1000).toString(),
        finished: false,
      };
      await expect(
        await library
          .AddBook(book.name, book.year, book.author, book.finished)
          .to.emit(library, "AddBook")
          .withArgs(owner.address, NUM_FINISHED_BOOK + NUM_UNFINSHED_BOOK)
      );
    });
  });

  describe("Get Book", function () {
    it("should return correct unfinished book", async function () {
      const booksfromChain = await library.getUnfinishedBooks();
      expect(booksfromChain.length).to.equal(NUM_UNFINSHED_BOOK);
      verifyBookList(booksfromChain, unFinishedBookList);
    });

    it("should return correct finished book", async function () {
      const booksfromChain = await library.getFinishedBooks();
      expect(booksfromChain.length).to.equal(NUM_FINISHED_BOOK);
      verifyBookList(booksfromChain, finishedBookList);
    });
  });
  describe("Set Finished", function () {
    it("Should emit SetFinished event", async function () {
      const BOOK_ID = 0;
      const BOOK_FINISHED = true;

      await expect(library.setFinished(BOOK_ID, BOOK_FINISHED))
        .to.emit(library, "SetFinished")
        .withArgs(BOOK_ID, BOOK_FINISHED);
    });
  });
});
