let chararr = "";
let symbol = document.getElementById("Symbol");
let letter = document.getElementById("letter");
let capsm = document.getElementById("capsm");
let Numbers = document.getElementById("Numbers");
let docCount = document.getElementById("count");
let copy = document.getElementById("copy");
let docPassword = document.getElementById("password");
let strength = document.getElementById("strength");
let strengthWidth = 0;
document.getElementById("btn").onclick = () => {
  let count = parseInt(docCount.value);
  let password = "";
  strengthWidth = 0;
  chararr = "";
  if (count >= 10) {
    strengthWidth += 20;
  }
  if (symbol.checked) {
    chararr += "!@#$%^&*?";
    strengthWidth += 20;
  }
  if (letter.checked) {
    chararr += "abcdefghijklmnopqrstuvwxyz";
    strengthWidth += 20;
  }
  if (capsm.checked) {
    chararr += "ABCDEFGHIJKLMNOBQRSTUVWXYZ";
    strengthWidth += 20;
  }
  if (Numbers.checked) {
    chararr += "0123456789";
    strengthWidth += 20;
  }
  if (chararr == "") {
    docPassword.innerHTML = "Please Select The Type";
  } else {
    count > 200 ? (count = 200) : count;
    for (let i = 0; i < count; i++) {
      let random = Math.floor(Math.random() * chararr.length);
      password += chararr[random];
    }
    docPassword.innerHTML = password;
    strength.style.width = `${strengthWidth}%`;
    ChangeStrengthColor();
  }
};

copy.addEventListener("click", () => {
  navigator.clipboard.writeText(docPassword.innerHTML);
  docPassword.innerHTML = "Text Coppied Successfully";
});

document.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    document.getElementById("btn").click();
  }
});

function ChangeStrengthColor() {
  if (strengthWidth <= 60) {
    strength.style.backgroundColor = "red";
  } else {
    strength.style.backgroundColor = "green";
  }
}
