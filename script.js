let datePicker = document.getElementById("dob");
datePicker.max = new Date().toISOString().split("T")[0];
document.getElementById('submit').addEventListener('click', function (e) {
  e.preventDefault(); e.stopPropagation()
});
let nameErr = document.getElementById("name-err-container");
let dobErr = document.getElementById("dob-err-container");
let emailErr = document.getElementById("email-err-container");
const nameReg = /^[a-zA-Z]+$/;
const emailReg = /[a-z0-9+%._\-]+@[a-z0-9.\-]{2,}.[a-z]+$/;
let name, dob, email, phone, gender, hobby, objId = null;
let isFormValid, validName, validDob, validEmail, index, row, dictionary = null;
const employeeForm = document.getElementById('addEmployeeForm');

function employeeValidation(obj) {
  isFormValid = true;
  employeeForm.setAttribute("class", "submitted");
  validName = obj.name;
  validDob = obj.dateOfBirth;
  validEmail = obj.email;
  if (validName == "") {
    nameErr.innerHTML = "Name shouldn't be empty.";
    isFormValid = false;
  } else if (validName.length < 4) {
    nameErr.innerHTML = "Name should contain atleast 4 characters";
    isFormValid = false;
  } else if (nameReg.test(validName) == false) {
    nameErr.innerHTML = "Name should contain only alphabets ";
    isFormValid = false;
  } else {
    nameErr.innerHTML = "";
  }
  if (validDob == "") {
    dobErr.innerHTML = "Date of Birth shouldn't be empty.";
    isFormValid = false;
  }
  else if (validDob > datePicker.max) {
    dobErr.innerHTML = "Date of Birth shouldn't exceed today's date!";
    isFormValid = false;
  } else {
    dobErr.innerHTML = "";
  }
  if (validEmail == "") {
    emailErr.innerHTML = "Email shouldn't be empty.";
    isFormValid = false;
  } else if (emailReg.test(validEmail) == false) {
    emailErr.innerHTML = "Please enter valid email address";
    isFormValid = false;
  } else {
    emailErr.innerHTML = "";
  }
  return isFormValid;
}
function addEmployee() {
  name = document.getElementById("name").value;
  dob = document.getElementById("dob").value;
  email = document.getElementById("email").value;
  phone = document.getElementById("phone").value;
  hobby = document.getElementsByName("hobby");
  gender = document.querySelector('input[name="gender"]:checked').value;
  objId = uuid();
  let hobbies = [];
  for (val in hobby) {
    if (hobby[val].checked) {
      hobbies.push(hobby[val].value);
    }
  }
  let obj = {
    name: name,
    gender: gender,
    dateOfBirth: dob,
    email: email,
    phone: phone,
    hobby: hobbies,
    id: objId
  };
  if (employeeValidation(obj)) {
    emp = getEmpData();
    if (document.getElementById('submit').innerHTML === "Update") {
      id = document.getElementById('index').value;
      index = emp.findIndex(object => object['id'] === id);
      emp[index] = obj;
      setEmpData(emp);
      clearInput();
    } else {
      emp.push(obj);
      setEmpData(emp);
    }
    displayAdvanced(); displayBasic();
  }
}
function getEmpData() {
  emp = localStorage.getItem("employee")
    ? JSON.parse(localStorage.getItem("employee"))
    : [];
  return emp;
}
function setEmpData(emp) {
  localStorage.setItem("employee", JSON.stringify(emp));
}
function edit(id) {
  clearInput();
  dictionary = getDictionary(id);
  name = document.getElementById("name");
  dob = document.getElementById("dob");
  email = document.getElementById("email");
  phone = document.getElementById("phone");
  gender = document.getElementsByName("gender");
  hobby = document.getElementsByName("hobby");

  name.value = dictionary['name'];
  dob.value = dictionary['dateOfBirth'];
  email.value = dictionary['email'];
  phone.value = dictionary['phone'];
  if (dictionary['gender'] == "male") {
    gender[0].checked = true;
  }
  else {
    gender[1].checked = true;
  }
  for (word of hobby) {
    if (dictionary['hobby'].includes(word.value)) {
      word.checked = true;
    }
  }
  const cancel = document.getElementById('cancel');
  cancel.style.display = "inline";
  const subBtn = document.getElementById('submit');
  subBtn.innerHTML = "Update";
  document.getElementById('index').value = id;
}
function deleteEmployee(id) {
  getEmpData();
  const row = emp.findIndex(object => object['id'] === id);
  if (confirm('Are you sure you want to delete this row?') == true) {
    emp.splice(row, 1);
    setEmpData(emp);
    displayAdvanced();
    displayBasic();
  }
}
function getDictionary(id) {
  emp = getEmpData();
  let dictionary = emp.find((dic) => dic['id'] == id);
  return dictionary;
}
function clearInput() {
  employeeForm.reset();
  nameErr.innerHTML, dobErr.innerHTML, emailErr.innerHTML = "";
  employeeForm.removeAttribute("class", "submitted");
  document.getElementById('submit').innerHTML = "Submit";
  document.getElementById('cancel').style.display = "none";
}
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
function displayBasic() {
  getEmpData();
  emp.forEach((element) => {
    let tr = document.createElement('tr');
    Object.keys(element).forEach((key) => {
      let td = document.createElement('td');
      if (key === 'hobby') {
        let hobbiesString = element['hobby'].map(obj => {
          return obj.charAt(0).toUpperCase() + obj.slice(1);
        }).join(', ');
        td.innerHTML = hobbiesString;
      }
      else if (key === 'id') {
        td.innerHTML = `<button class='edit' onclick='edit("${element['id']}")'>Edit</button>
          <button class='delete' onclick='deleteEmployee("${element['id']}")'>Delete</button>`;
      }
      else { td.innerHTML = element[key]; }
      tr.appendChild(td);
      document.getElementById('display').appendChild(tr);
    });
  });
  clearInput();
}
function displayAdvanced() {
  document.getElementById('advanced').innerHTML = '<tr id="0"><th>Name</th></tr>'
    + '<tr id="1"> <th>Gender</th></tr>'
    + '<tr id="2"> <th>Date of Birth</th> </tr>'
    + '<tr id="3"> <th>Email</th> </tr>'
    + '<tr id="4"> <th>Phone</th> </tr>'
    + '<tr id="5">  <th>Hobbies</th></tr>'
    + '<tr id="6"> <th>Action</th> </tr>';
  getEmpData();
  emp.forEach((element) => {
    Object.keys(element).forEach((key, index) => {
      let tr = document.getElementById(index);
      let td = document.createElement('td');
      if (key === 'hobby') {
        let hobbiesString = element['hobby'].map(obj => {
          return obj.charAt(0).toUpperCase() + obj.slice(1);
        }).join(', ');
        td.innerHTML = hobbiesString;
      }
      else if (key === 'id') {
        td.innerHTML = `<button class='edit' onclick='edit("${element['id']}")'>Edit</button>
          <button class='delete' onclick='deleteEmployee("${element['id']}")'>Delete</button>`;
      }
      else { td.innerHTML = element[key]; }
      tr.appendChild(td);
    });
  });
  clearInput();
}
displayAdvanced();
displayBasic();