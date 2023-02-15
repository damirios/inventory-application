let switcherInput = document.querySelector(".switch input");
let imageSelector = document.querySelector(".form-image");
const input = imageSelector.querySelector("input");

switcherInput.addEventListener("change", () => {
    if (switcherInput.checked) {
        imageSelector.classList.remove("hide");
    } else {
        imageSelector.classList.add("hide");
        input.value = '';
    }
});


let switcher = document.querySelector(".item-form__switch");
let checkbox = document.querySelector(".item-form__checkbox");

if (checkbox) {
    checkbox.addEventListener("change", () => {
        console.log('change!');
        if (checkbox.checked) {
            switcher.classList.add("hide");
            imageSelector.classList.add("hide");
            switcherInput.checked = false;
            input.value = '';
        } else {
            switcher.classList.remove("hide");
        }
    });
}
