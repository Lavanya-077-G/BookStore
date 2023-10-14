import { dataapi, similarbookapi, datafilterbydate } from "./booksapi.js";
let dataArray;
let similarbookarray;
let similartopic;
let booksbydatearray;
let bookbygenrearray;
let loader = document.createElement("h1");
loader.setAttribute("id", "loading");
loader.innerHTML = "Loading...";
const generatebooks = () => {
  document.getElementById("search-value").innerHTML = "";
  const optionall = document.createElement("option");
  optionall.setAttribute("value", "All");
  optionall.innerHTML = "All";
  document.getElementById("search-value").append(optionall);
  document.getElementById("apilink").append(loader);
  dataapi()
    .then((data) => {
      loader.remove();
      document.getElementById("apilink").innerHTML = "";
      dataArray = data.results.lists;
      const { results = {} } = data;
      const { lists = [] } = results;
      dataArray.forEach((item) => {
        let title = createtitle(item.list_name);
        let searchtitle = document.createElement("option");
        searchtitle.setAttribute("value", item.list_name);
        searchtitle.innerHTML = item.list_name;
        document.getElementById("search-value").append(searchtitle);
        let genresContent = document.createElement("div");
        genresContent.setAttribute("class", "overview-content");
        let card = document.createElement("div");
        card.setAttribute("class", "newcard");
        card.setAttribute("id", item.list_name);
        genresContent.append(title, card);
        let bookarray = item.books;
        bookarray.foreach((bookitem, j) => {
          let bookContainer = createbookContainer(bookitem.book_image, j);
          card.append(bookContainer);
          document.getElementById("apilink").append(genresContent);
        });
      });
    })
    .catch((error) => {
      document.getElementById("apilink").innerHTML = "Books not found";
    });
};
generatebooks();

const createtitle = (titlename) => {
  let title = document.createElement("h3");
  title.innerHTML = titlename;
  return title;
};

const createbookContainer = (img, id) => {
  let bookContainer = document.createElement("div");
  bookContainer.setAttribute("id", id);
  bookContainer.setAttribute("class", "book-container");
  let bookcover = document.createElement("img");
  bookcover.setAttribute("class", "image");
  bookcover.setAttribute("src", img);
  bookContainer.append(bookcover);
  return bookContainer;
};

const getbooksbydate = (e) => {
  let filterdate = e.target.value;
  let filtertitle = document.getElementById("search-value");
  document.getElementById("apilink").innerHTML = "";
  document.getElementById("apilink").append(loader);
  datafilterbydate(filterdate, filtertitle)
    .then((data) => {
      loader.remove();
      booksbydatearray = data.results.books;
      if (filterdate) {
        generatebooks();
      } else {
        let title = createtitle(filtertitle);
        document.getElementById("apilink").append(title);
        let card = document.createElement("div");
        card.setAttribute("class", "newcard");
        card.setAttribute("id", filtertitle);
        booksbydatearray.forEach((bookbydate, id) => {
          let bookContainer = createbookContainer(bookbydate.book_image, id);
          card.append(bookContainer);
        });
        document.getElementById("apilink").append(card);
      }
    })
    .catch((error) => {
      document.getElementById("apilink").innerHTML = "Books not found";
    });
};

const getbooksbygenres = (e) => {
  document.getElementById("apilink").innerHTML = "";
  let filterdate;
  let genresvalue = e.target.value;
  if (filterdate === "") {
    filterdate = "current";
  } else {
    filterdate = document.getElementById("filterbydate").value;
  }
  if (genresvalue === "All") {
    generatebooks();
  } else {
    document.getElementById("apilink").append(loader);
    datafilterbydate(filterdate, genresvalue)
      .then((data) => {
        loader.remove();
        let title = createtitle(genresvalue);
        document.getElementById("apilink").append(title);
        let card = document.createElement("div");
        card.setAttribute("class", "newcard");
        card.setAttribute("id", genresvalue);
        bookbygenrearray = data.results.books;
        bookbygenrearray.forEach((bookbygenre, id) => {
          if (id < 5) {
            let bookContainer = createbookContainer(bookbygenre.book_image, id);
            card.append(bookContainer);
          }
        });
        document.getElementById("apilink").append(card);
      })
      .catch((error) => {
        document.getElementById("apilink").innerHTML = "Books not found";
      });
  }
};

const similarbookimages = (listname) => {
  similarbookapi(listname)
    .then((data) => {
      loader.remove();
      similartopic = listname;
      similarbookarray = data.results.books;
      document.getElementById("books").innerHTML = "";
      similarbookarray.forEach((similarbooks, id) => {
        let similarbook = createbookContainer(similarbooks.book_image, id);
        document.getElementById("books").append(similarbook);
      });
    })
    .catch((error) => {
      document.getElementById("apilinks").innerHTML = "Books not found";
    });
};

const popup = (
  bookimage,
  booktitle,
  bookauthor,
  bookcontributor,
  bookdescription,
  bookpublisher,
  listname,
  buylinks
) => {
  let detailtopic = [
    "title",
    "author",
    "contributor",
    "description",
    "publisher",
    "buylinks",
  ];
  let detailarray = [
    booktitle,
    bookauthor,
    bookcontributor,
    bookdescription,
    bookpublisher,
    "",
  ];
  document.getElementById("similarbook-container").innerHTML = "";
  let similardetails = document.createElement("div");
  similardetails.setAttribute("class", "img-bookdetails");
  let bookimg = document.createElement("img");
  let bookdetails = document.createElement("div");
  bookdetails.setAttribute("id", "book-details");
  bookimg.setAttribute("src", bookimage);
  bookimg.setAttribute("class", "image");
  detailtopic.forEach((topic, i) => {
    let aboutbook = document.createElement("label");
    aboutbook.innerHTML = topic;
    bookdetails.append(aboutbook);
    let detailvalue = document.createElement("h4");
    detailvalue.innerHTML = detailarray[i];
    bookdetails.append(detailvalue);
  });
  buylinks.forEach((links) => {
    let buylinksite = document.createElement("a");
    buylinksite.innerHTML = links.name;
    buylinksite.setAttribute("href", links.url);
    buylinksite.setAttribute("target", "_blank");
    bookdetails.append(buylinksite);
  });
  let similarbooks = document.createElement("div");
  similarbooks.setAttribute("id", "similar-books");
  similarbooks.setAttribute("class", "similarbook");
  let similarbookcontainer = document.createElement("div");
  similarbookcontainer.setAttribute("id", "books");
  let similarbookheader = document.createElement("div");
  similarbookheader.setAttribute("class", "header");
  similarbookheader.innerHTML = "Similar Books";
  similarbooks.append(similarbookheader, similarbookcontainer);
  similarbookimages(listname);
  similardetails.append(bookimg, bookdetails);
  document
    .getElementById("similarbook-container")
    .append(similardetails, similarbooks);
  document.getElementById("pop-up").style.visibility = "visible";
  document.getElementById("body").style.position = "fixed";
  document.getElementById("similar-books").append(loader);
};

const hidepopup = () => {
  document.getElementById("pop-up").style.visibility = "hidden";
  document.getElementById("body").style.position = "static";
};

document.querySelector(".overallbooks").addEventListener("click", (e) => {
  if (e.target.tagName == "IMG") {
    let bookid = e.target.parentElement.id;
    let booktopic = e.target.parentElement.parentElement.id;
    dataArray.forEach((item) => {
      if (item.list_name === booktopic) {
        popup(
          item.books[bookid].book_image,
          item.books[bookid].title,
          item.books[bookid].author,
          item.books[bookid].contributor,
          item.books[bookid].description,
          item.books[bookid].publisher,
          booktopic,
          item.books[bookid].buy_links
        );
      }
    });
  }
});
document.querySelector("#pop-up").addEventListener("click", (e) => {
  if (e.target.tagName == "IMG") {
    let bookid = e.target.parentElement.id;
    popup(
      similarbookarray[bookid].book_image,
      item.books[bookid].title,
      item.books[bookid].author,
      item.books[bookid].contributor,
      item.books[bookid].description,
      item.books[bookid].publisher,
      similartopic,
      item.books[bookid].buy_links
    );
  }
});

document.querySelector("#apilink").addEventListener("click", (e) => {
  if (e.target.tagName == "IMG") {
    let bookid = e.target.parentElement.id;
    let booktopic = e.target.parentElement.parentElement.id;
    popup(
      booksbydatearray[bookid].book_image,
      booksbydatearray[bookid].title,
      booksbydatearray[bookid].author,
      booksbydatearray[bookid].contributor,
      booksbydatearray[bookid].description,
      booksbydatearray[bookid].publisher,
      booktopic,
      booksbydatearray[bookid].buy_links
    );
  }
});

const checktitle = (book) => {
  if (book.includes(searchvalue)) {
    return book;
  }
};

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

let searchvalue;
let bookarr = [];
const display = () => {
  dataapi().then((data) => {
    let booknamearray = [];
    let booksarray = [];
    let searchdata = data.results.lists;
    searchdata.forEach((item) => {
      item.books.forEach((bookname) => {
        booksarray.push(bookname);
        booknamearray.push(bookname.title);
      });
    });
    booksarray = getUniqueListBy(booksarray, "title");
    booknamearray = [...new set(booknamearray)];
    document.getElementById("apilink").innerHTML = "";
    bookarr = booknamearray.filter(checktitle);
    if (bookarr.length == "0") {
      document.getElementById("apilink").innerHTML = "NO BOOK MATCHES";
    }
    const divbox = document.createElement("div");
    divbox.setAttribute("class", "newcard");
    bookarr.forEach((item) => {
      booksarray.forEach((similarbookobj, id1) => {
        if (item == similarbookobj.title) {
          let bookdiv = createbookContainer(similarbookobj.book_image, id1);
          divbox.append(bookdiv);
          bookdiv.addEventListener("click", () => {
            popup(
              similarbookobj.book_image,
              similarbookobj.title,
              similarbookobj.author,
              similarbookobj.contributor,
              similarbookobj.description,
              similarbookobj.publisher,
              "Combined print and E-Book fiction",
              similarbookobj.buy_links
            );
          });
        }
      });
    });
    document.getElementById("apilink").append(divbox);
  });
};

const debounce = function (fn, d) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      searchvalue = document.getElementById("searchinput").value.toUpperCase();
      if (searchvalue == "") {
        generatebooks();
      } else {
        fn();
      }
    }, d);
  };
};

const searchbooks = debounce(display, 600);
document.getElementById("searchinput").addEventListener("keyup", searchbooks);
const date = document.getElementById("filterbydate");
date.addEventListener("change", (e) => getbooksbydate(e));
document
  .querySelector("#search-value")
  .addEventListener("change", (e) => getbooksbygenres(e));
document.querySelector("#close-button").addEventListener("click", hidepopup);
