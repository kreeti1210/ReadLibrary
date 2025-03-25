let page = 1;
let limit = 10;
let books = [];
let view = "grid";
let searchby = "title";
let bookFound = [];
let sort="title";

async function fetchbookdetails(page, limit) {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=${limit}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const allBooks = data.data.data;
    const filteredRes = allBooks.map((books) => ({
      title: books.volumeInfo.title,
      author: books.volumeInfo.authors,
      image: books.volumeInfo.imageLinks.thumbnail,
      publisher: books.volumeInfo.publisher,
      publishedDate: books.volumeInfo.publishedDate,
      link : books.volumeInfo.infoLink,
    }));

    books = [...books, ...filteredRes];
    handleView(books);
  } catch (error) {
    console.error(error);
  }
}
fetchbookdetails(page, limit);

function handleView() {
  const selectElement = document.getElementById("view");
  const selectedValue = selectElement.value;
  if (selectedValue === "list") {
    view = "list";
    listView(books);
  } else if (selectedValue === "grid") {
    view = "grid";
    GridView(books);
  }
}
function listView(books) {
  const container = document.querySelector(".book-list");
  container.innerHTML = "";
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    const limitedAuthors = Array.isArray(book.author)
      ? book.author.slice(0, 2).join(", ")
      : book.author;
    bookCard.classList.add("list-book-card");
    bookCard.innerHTML = `
  <div class="content">
    <ul id='title-li'>
      <li><h3>${book.title}</h3></li>
      <li id='author'>${limitedAuthors}</li>
      <li id='publisher'>${book.publisher}</li>
      <li id='publishedDate'>${book.publishedDate}</li>
    </ul>
  </div>
  <div class="image">
  <a href="${book.link} target="_blank">
    <img src="${book.image}" alt="Book Image" /> 
    </a>
  </div>`;
    container.appendChild(bookCard);
  });
}

function GridView(books) {
  const container = document.querySelector(".book-list");

  container.innerHTML = "";
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    const limitedAuthors = Array.isArray(book.author)
      ? book.author.slice(0, 2).join(", ")
      : book.author;

    bookCard.classList.add("grid-book-card");
    bookCard.innerHTML =
      "<h3 id='title'>" +
      book.title +
      "</h3>" +
      "<h4 id='author'>" +
      limitedAuthors +
      "</h4>" +
      "<br>" +
      "<a href='"+ book.link+"' target='_blank'>"+
      "<img src='" +
      book.image +
      "'/>" +
      "</a>" +
      "<br>" +
      "<p >" +
      book.publisher +
      "</p>" +
      "<p>" +
      book.publishedDate +
      "</p>" +
      "<br>";
    container.appendChild(bookCard);
  });
}

function handleSearch() {
  const selectElement = document.getElementById("filter");
  if (selectElement.value === "author") {
    searchby = "author";
  } else if (selectElement.value === "title") {
    searchby = "title";
  }
}
function search() {

  const selectElement = document.getElementById("search").value.toLowerCase();
  if (searchby === "title") {
    bookFound = books.filter((book) =>
      book.title.toLowerCase().includes(selectElement)
    );
  } else if (searchby === "author") {
    bookFound = books.filter(
      (book) =>
        Array.isArray(book.author) &&
        book.author.some((author) =>
          author.toLowerCase().includes(selectElement)
        )
    );
  }
  if (bookFound.length === 0) {
    const container = document.querySelector(".book-list");
    container.innerHTML = "";
    const bookCard = document.createElement("div");
    bookCard.classList.add("no-result");
    bookCard.innerHTML = "<h3>" + "No books found" + "</h3>";
    container.appendChild(bookCard);
    return;
  }
  if (view === "list") {
    listView(bookFound);
  } else if (view === "grid") {
    GridView(bookFound);
  }
}
function handleSort() {
  const selectElement = document.getElementById("sort");
  if (selectElement.value === "title") {
    sort = "title";
  } else if (selectElement.value === "release-date") {
    sort = "publishedDate";
  }
  sortBooks(books);
}

function sortBooks(books) {  
        if(sort === "title"){
          books.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if(sort === "publishedDate"){ 
          books.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate));
        }
        if (view === "list") {
          listView(books);
        } else if (view === "grid") {    
          GridView(books);
        }
   }
   window.onscroll = () => {
     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

     if (scrollTop + clientHeight >= scrollHeight - 5) {
       page++;
       fetchbookdetails(page, limit);
     }
   };

function clearSearch() {
 document.getElementById("search").value = "";
 if (view === "list") {
    listView(books);
  } else if (view === "grid") {
    GridView(books);
  }
}