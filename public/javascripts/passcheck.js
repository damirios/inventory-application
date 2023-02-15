// const forms = document.querySelectorAll("form.form-pass");

// forms.forEach(form => {
//     form.addEventListener("submit", (e) => {
//         e.preventDefault();
//         if (form.dataset.pass === "false") {
//             createPassForm(form);
//         }
//     });

// });

// function createPassForm(form) {
//     console.log('submit!');
//     const passForm = document.createElement('form');
//     passForm.classList.add("form-pass__password-check-form");

//     const passInput = document.createElement('input');
//     passInput.type = "password";
//     passInput.name = 'pass';
//     passForm.appendChild(passInput);

//     const passSubmit = document.createElement('button');
//     passSubmit.type = "submit";
//     passSubmit.textContent = "Подтвердить пароль";
//     passForm.appendChild(passSubmit);

//     form.appendChild(passForm);
    
//     passForm.addEventListener("submit", checkPassword);

//     function checkPassword(e) {
//         e.preventDefault();
//         const writtenPass = passInput.value.trim();
//         if (writtenPass === "акулие сомы") {
//             console.log('da');
//             passForm.removeEventListener("submit", checkPassword);
//             form.removeChild(passForm);
//         } else {
//             console.log('net');
//         }
//     }
// }

