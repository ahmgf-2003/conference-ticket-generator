window.addEventListener("popstate", () => {
    console.log(location.pathname)
    history.pushState({}, "", "/")
    location.reload();
})

// Get file input & img element, img drag text span, buttons div and note span in file input
const file = document.getElementById("img"),
    img = document.querySelector(".form-input-image img"),
    span = document.querySelector(".form-input-image span"),
    buttons = document.querySelector(".form-input-image .buttons"),
    imgNote = document.querySelector(".form-input-image .note");

// get the default text for note span
const imgNoteDefaultText = imgNote.textContent;

// Get the svg info icon
const icon = imgNote.children[0];

// Get image default src
const uploadImgSrc = img.src;

// check file size and change
file.addEventListener("change", (e) => {
    let image = e.target.files[0],
        reader = new FileReader();

    // make sure image is less than 500KB and format is jpg or png
    if (image.size > 500 * 1000) {
        e.target.value = null;
        imgNote.classList.add("error");
        imgNote.textContent = "Image size should be less than 500KB";
        imgNote.prepend(icon);
        throw new Error("Big file size");
    } else if (!image.type.match(/image\/png|jpeg/)) {
        e.target.value = null;
        imgNote.classList.add("error");
        imgNote.textContent = "file should be an image with jpg/png format only";
        imgNote.prepend(icon);
        throw new Error("file should be png or jpg image only");
    }

    // get the relative path for the image
    reader.onload = () => {
        img.src = reader.result;
        span.classList.add("hidden");
        buttons.classList.remove("hidden");
        imgNote.classList.remove("error");
        imgNote.textContent = imgNoteDefaultText;
        imgNote.prepend(icon);
    };

    reader.readAsDataURL(image);
});

// Get the remove and change button on file input
const inputImgButtons = document.querySelectorAll(
    ".form-input-image .buttons button"
);

// Remove image when user click remove image button
inputImgButtons[0].addEventListener("click", (e) => {
    e.stopPropagation();
    file.value = null;
    img.src = uploadImgSrc;
    buttons.classList.add("hidden");
    span.classList.remove("hidden");
});
inputImgButtons[1].addEventListener("click", (e) => {
    e.stopPropagation();
    file.click();
});

// Get Form Element
const form = document.forms[0];

// check form input on submit (valdation)
form.addEventListener("submit", (e) => {
    let submit = true;
    e.preventDefault();

    const formData = new FormData(form);
    const userImg = formData.get("user-img");
    // Check the user uploaded an image
    if (userImg.size === 0) {
        Error("whattt!!!");
        imgNote.textContent = "Upload a image first";
        imgNote.prepend(icon);
        imgNote.classList.add("error");
        submit = false;
    }

    if (submit) {
        history.pushState({}, "", "/genrated-ticket")
    }

    const userName = formData.get("user-name");
    // Check user typed his name & word are more than 2 with length more than 3 for each
    let userNameArr = userName.split(" ");
    if (
        userNameArr.length < 2 ||
        userNameArr[0].length < 3 ||
        userNameArr[1].length < 3
    ) {
        Error("whattt!!!")
    }

    const userEmail = formData.get("user-email");
    // Check if email is valid
    if (!(/\w+@\w+\.\w/g).test(userEmail)) {
        Error("what form email")
    }

    const userGithub = formData.get("user-github");
    // Check user github name is valid github user
    if (!userGithub) {
        Error("what form github")
    }
    let githubUsername = userGithub.split("@").slice(-1).join("");
});
