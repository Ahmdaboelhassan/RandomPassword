let chararr = "";
let symbol = document.getElementById("Symbol");
let letter = document.getElementById("letter");
let capsm = document.getElementById("capsm");
let Numbers = document.getElementById("Numbers");

document.getElementById("btn").onclick = () => {
  let count = parseInt(document.getElementById("count").value);
  let password = "";
  chararr = "";
  if (symbol.checked) {
    chararr += "!@#$%^&*?";
  }
  if (letter.checked) {
    chararr += "abcdefghijklmnopqrstuvwxyz";
  }
  if (capsm.checked) {
    chararr += "ABCDEFGHIJKLMNOBQRSTUVWXYZ";
  }
  if (Numbers.checked) {
    chararr += "0123456789";
  }
  if (chararr == "") {
    document.getElementById("password").innerHTML = "Please Select The Type";
  } else {
    count > 200 ? (count = 200) : count;
    for (let i = 0; i < count; i++) {
      let random = Math.floor(Math.random() * chararr.length);
      password += chararr[random];
    }
    document.getElementById("password").innerHTML = password;
  }
};
