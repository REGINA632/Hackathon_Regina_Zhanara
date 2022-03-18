// ! Вход
let inpLogin = document.querySelector("#exampleInputEmail1");
let inpPassword = document.querySelector("#exampleInputPassword1");
let btn = document.querySelector(".btn-ent");

btn.addEventListener("click", () => {
  let login = inpLogin.value;
  let pass = inpPassword.value;
  // console.log(login, pass);

  if (login == "admin") {
    if (pass == "nimda") {
      window.open(
        "file:///C:/Users/ASUS/Desktop/Hackathon_Regina_Zhanara/index.html"
      );
    } else {
      alert("Неверный пароль");
    }
  } else {
    alert("Неверный логин");
  }
  return false;
});
