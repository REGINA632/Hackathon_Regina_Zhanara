const API = "http://localhost:8000/post";

// add post
let inpTitle = document.querySelector("#title");
let inpDescript = document.querySelector("#descript");
let inpImg = document.querySelector("#img");
let btnSave = document.querySelector("#btn-save");
let modal = document.querySelector("#exampleModal");
let list = document.querySelector("#list");

// edit part
let editInpTitle = document.querySelector("#edit-title");
let editInpDescript = document.querySelector("#edit-descript");
let editInpImg = document.querySelector("#edit-img");
let editBtnSave = document.querySelector("#edit-btn-save");
let editModal = document.querySelector("#editModal");

// search
let searchInp = document.querySelector("#search");
let searchVal = "";

// PAGINATION
let paginationList = document.querySelector("#pagination-list");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let currentPage = 1;
let pageCount = 1;

// ! add post
btnSave.addEventListener("click", () => {
  let title = inpTitle.value;
  let descript = inpDescript.value;
  let img = inpImg.value;
  console.log(title, img);

  if (!title || !img || !descript) {
    alert("Заполните поля");
    return;
  }

  let obj = {
    title: title,
    descript: descript,
    img: img,
  };
  postNew(obj);
});

// ! add new post
function postNew(newPost) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newPost),
  })
    .then(() => {
      modal.click();
      inpTitle.value = "";
      inpDescript.value = "";
      inpImg.value = "";
      render();
      showAlert("success", "Успешно создан");
    })
    .catch((err) => console.log(err));
}

// ! READ
function render() {
  fetch(`${API}?q=${searchVal}&_limit=6&_page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";
      data.forEach((item) => {
        let card = drawCard(item);
        list.innerHTML += card;
      });
      drawPagBtns();
    });
}
render();

function drawCard(obj) {
  return `
  <div class="card border border-4 rounded m-3" style="width: 18rem;">
  <img src="${obj.img}" class="card-img-top" alt="${obj.title}">
  <div class="card-body">
    <h5 class="card-title fw-bold">${obj.title}</h5>
    <p class="card-text">${obj.descript}</p>
    <button id="btn-like" type="button" class="btn btn-light btn-like">❤️</button>
    <button type="button" class="btn btn-light btn-com">💬</button>
    <button class="btn btn-light">↪️</button>
    
    <button id="${obj.id}" class="btn btn-light btn-del">🗑️</button>
    <button id="${obj.id}" class="btn btn-light btn-edit" data-bs-toggle="modal" data-bs-target="#editModal">📝</button>
  </div>
</div>

  `;
}

document.addEventListener("click", (e) => {
  let bt = [...e.target.classList];
  console.log(bt);
  let bn = document.querySelector(".btn-like");
  if (bt.includes("btn-like") === "btn-like") {
    bn.style.backgroundColor = "danger";
  } else if (bn == "black") {
    bn.addEventListener("click", () => {
      bn.style.backgroundColor = "danger";
    });
  }
});

// ! DELETE
document.addEventListener("click", (e) => {
  // console.log(e.target.classList);
  let arr = [...e.target.classList];
  // console.log(arr.includes("btn-del"));
  if (arr.includes("btn-del")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then((res) => {
      render();
      showAlert("danger", "Успешно удален");
    });
  }
});

// ! EDIT
document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpTitle.value = data.title;
        editInpDescript.value = data.descript;
        editInpImg.value = data.img;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let answer = confirm("Are you sure?");
  if (!answer) {
    return;
  }
  let title = editInpTitle.value;
  let descript = editInpDescript.value;
  let img = editInpImg.value;

  let obj = {
    title: title,
    descript: descript,
    img: img,
  };
  console.log(obj);
  editProduct(obj, editBtnSave.id);
});

function editProduct(obj, editId) {
  fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  })
    .then(() => {
      editModal.click();
      render();
    })
    .catch((err) => console.log(err));
}

// ! Search ПОИСК
searchInp.addEventListener("input", (e) => {
  searchVal = e.target.value;
  currentPage = 1;
  render();
});

// ! PAGINATION
function drawPagBtns() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageCount = Math.ceil(data.length / 6);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageCount; i++) {
        paginationList.innerHTML += `
        <li class="page-item ${
          i == currentPage ? "active" : null
        }"><a class="page-link page-number" href="#">${i}</a></li>
        `;
      }
    });
}
// drawPagBtns();

next.addEventListener("click", () => {
  if (currentPage >= pageCount) return;
  currentPage++;
  render();
});

prev.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  render();
});

document.addEventListener("click", (e) => {
  let classes = e.target.classList;
  if (classes.contains("page-number")) {
    currentPage = e.target.innerText;
    render();
  }
});

// ! alert
let alertContainer = document.querySelector(".alert-cont");
function showAlert(type, text) {
  let alert = `

    <div class="alert alert-${type} d-flex align-items-center" role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
  <div>
  ${text}
  </div>
</div>
  `;
  alertContainer.innerHTML = "";
  alertContainer.innerHTML = alert;
  alertContainer.style.display = "block";
  setTimeout(function () {
    alertContainer.style.display = "none";
  }, 4000);
}
