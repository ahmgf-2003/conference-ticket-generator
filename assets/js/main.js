// Get file input & img element, img drag text span, buttons div in file input 
const file = document.getElementById("img"),
    img = document.querySelector(".form-input-image img"),
    span = document.querySelector(".form-input-image span"),
    buttons = document.querySelector(".form-input-image .buttons");

// check file size and change 
file.addEventListener("change", (e) => {
    let image = e.target.files[0], reader = new FileReader();
    // make sure image is less than 500KB and format is jpg or png
    if (image.size > 500 * 1000) {
        e.target.value = null;
        throw new Error("Big file size"); 
    } else if (!image.type.match(/image\/png|jpeg/)) {
        e.target.value = null;
        throw new Error("file should be png or jpg image only"); 
    }

    // get the relative path for the image
    reader.onload = () => {
        img.src = reader.result;
        span.classList.add("hidden");
        buttons.classList.remove("hidden")
    }

    reader.readAsDataURL(image);
}) 

// Get Form Element 
const form = document.forms[0];

// check form input on submit (valdation)
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const userImg = formData.get("user-img");
    const userName = formData.get("user-name");
    const userEmail = formData.get("user-email");
    const userGithub = formData.get("user-github");
})