import { LibraryContractAddress } from "../config.js";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
// import NextPage from "next/app";

import Library from "../utils/Library.json";

import Book from "./components/Books";
declare var window: any;
const Home: React.FC = () => {
  // declare var window: any;
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const [txError, setTxError] = useState(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [bookName, setBookName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookFinished, setBookFinished] = useState("");

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const rinkebyChainId = "0x4";

      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  }, []);

  useEffect(() => {
    getBooks;
  }, [books]);

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    const rinkebyChainId = "0x4";

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  const getBooks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let booksFinished = await LibraryContract.getFinishedBook();

        let booksUnFinished = await LibraryContract.getUnFinishedBook();

        console.log(booksUnFinished);
        console.log("Books:- ");
        console.log(booksFinished);

        let books = booksFinished.concat(booksUnFinished);
        setBooks(books);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      console.log(error);
      setTxError(error.message);
    }
  };

  const clickBookFinished = async (id: number) => {
    console.log(id);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await LibraryContract.setFinished(id, true);

        console.log(libraryTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      console.log("Error Submitting new Book", error);
      setTxError(error.message);
    }
  };

  const submitBook = async () => {
    console.log("su--");
    let book: Book = {
      name: bookName,
      year: bookYear,
      author: bookAuthor,
      finished: bookFinished == "yes" ? true : false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await LibraryContract.addBook(
          book.name,
          book.year,
          book.author,
          book.finished
        );

        console.log(libraryTx);
        // setBooks();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      console.log("Error Submitting new Book", error);
      setTxError(error.message);
    } finally {
      setBookFinished("");
      setBookAuthor("");
      setBookName("");
      setBookYear("");
      setBooks([
        {
          name: bookName,
          year: bookYear,
          author: bookAuthor,
          finished: bookFinished == "yes" ? true : false,
        },
      ]);
    }
  };
  interface Book {
    id?: string;
    name: string;
    year: string;
    author: string;
    clickBookFinished?: () => void;
    finished: boolean;
  }
  return (
    <div className="flex flex-col items-center bg-[#f3f6f4] text-[#6a50aa] min-h-screen">
      <div className="trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out"></div>
      <h2 className="text-3xl font-bold mb-10 mt-12">
        Manage your Library Catalog
      </h2>
      {currentAccount === "" && (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
      {correctNetwork && (
        <h4 className="text-3xl font-bold mb-20 mt-12">Wallet Connected</h4>
      )}
      {!correctNetwork && currentAccount && (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
      <div className="w-2/4 text-xl font-semibold mb-20 mt-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            placeholder="username"
          >
            Name
          </label>
          <input
            className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Book Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            placeholder="username"
          >
            Author
          </label>
          <input
            className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Book Author"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            placeholder="username"
          >
            Year
          </label>
          <input
            className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Book Year"
            value={bookYear}
            onChange={(e) => setBookYear(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            placeholder="countries"
            className="mt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Have you Finished reading this book?
          </label>
          <select
            value={bookFinished}
            onChange={(e) => setBookFinished(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>NO</option>
            <option value="US">YES</option>
          </select>
        </div>
        <button
          className="mt-5 text-xl font-bold py-3 px-12 bg-[#f1c232] block rounded-lg  hover:scale-105 transition duration-500 ease-in-out"
          onClick={submitBook}
        >
          Add Book
        </button>
      </div>
      <div className="mt-10 mb-10 w-2/4">
        <button
          className="text-xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-2 hover:scale-105 transition duration-500 ease-in-out"
          onClick={getBooks}
        >
          Get Books
        </button>
        <div className="border-b-2 border-grey-500 "></div>
      </div>
      {books.length > 0 && (
        <div className="font-semibold text-lg text-center mb-4">Books List</div>
      )}
      {
        <div className="flex flex-row flex-wrap justify-center items-center w-2/4 text-xl font-semibold mb-20 mt-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {books.map((book: Book, index) => (
            <Book
              key={book.id}
              id={index}
              name={book.name}
              year={parseInt(book.year).toString()}
              author={book.author}
              finished={book.finished.toString()}
              clickBookFinished={clickBookFinished}
            />
          ))}
        </div>
      }
    </div>
  );
};

export default Home;
