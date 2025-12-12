// Single page render
function changeUI(element = document.querySelector("#form")) {
    // hide all unwanted elements
    document.querySelectorAll("body > *[id]").forEach((section) => {
        section.classList.add("hidden");
    });

    // display selected UI for user
    element.classList.remove("hidden");

    // get header heaing and subheading
    const heading = document.querySelector(".header h1"),
        subHeading = document.querySelector(".header p");

    // update header if element has ticket id
    if (element.id === "ticket") {
        const userData = JSON.parse(localStorage.getItem("ticket-data"));

        heading.classList.add("ticket");

        let firstName = userData.name.split(" ")[0],
            lastName = userData.name.split(" ")[1];

        heading.innerHTML = `
            Congrats, <span>${firstName}</span> <span>${lastName}</span>! Your ticket is ready.
        `;
        subHeading.innerHTML = `
            We've emailed your ticket to <span>${userData.email}</span> and will send updates in the run up to the event.
        `;
        
        updateTicket({name, image, github } = userData);
    } else {
        heading.innerHTML = `
            Your Journey to Coding Conf 2025 Starts Here!
        `;
        subHeading.innerHTML = `
            Secure your spot at next year's biggest coding conference.
        `
    }
}

if (localStorage.getItem("ticket-data")) {
    changeUI(document.querySelector("#ticket"));
} else {
    changeUI();
}
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

    // make sure image is less than 3MB and format is jpg or png
    if (image.size > 3 * 1024 *  1024) {
        e.target.value = null;
        imgNote.classList.add("error");
        imgNote.textContent = "Image size should be less than 3MB";
        imgNote.prepend(icon);
        throw new Error("Big file size");
    } else if (!image.type.match(/image\/png|jpeg/)) {
        e.target.value = null;
        imgNote.classList.add("error");
        imgNote.textContent =
            "file should be an image with jpg/png format only";
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

document.querySelectorAll(".form-input input").forEach((input) => {
    input.onchange = () => {
        if (input.parentElement.querySelector(".note")) {
            input.parentElement.querySelector(".note").remove();
        }
    };
});

// check form input on submit (valdation)
form.addEventListener("submit", (e) => {
    let submit = true;
    e.preventDefault();

    const formData = new FormData(form);
    const userImg = formData.get("user-img");
    const userName = formData.get("user-name");
    const userEmail = formData.get("user-email");
    const userGithub = formData.get("user-github");

    // Check the user uploaded an image
    if (userImg.size === 0) {
        console.error("Error: Please upload your image");
        updateNote(imgNote, "Upload a image first");
        submit = false;
    }

    // Check user typed his name & word are more than 2 with length more than 3 for each
    let userNameArr = userName.split(" ");
    if (
        userNameArr.length < 2 ||
        userNameArr[0].length < 3 ||
        userNameArr[1].length < 3
    ) {
        console.error("Error: Please type your name correctly");
        updateNote(
            imgNote.cloneNode(false),
            "Please type your first & last name",
            document.querySelector("#name").parentElement
        );
        submit = false;
    }

    // Check if email is valid
    if (!/\w+@\w+\.\w/g.test(userEmail)) {
        console.error("Error: Please type your email correctly");
        updateNote(
            imgNote.cloneNode(false),
            "Please type a valid email",
            document.querySelector("#email").parentElement
        );
        submit = false;
    }

    // Check user github name is valid github user
    if (!userGithub) {
        console.error("Error: Please type your github username correctly");
        updateNote(
            imgNote.cloneNode(false),
            "Type your github username",
            document.querySelector("#github").parentElement
        );
        submit = false;
    }
    let githubUsername = userGithub.split("@").slice(-1).join("");

    if (submit) {
        localStorage.setItem(
            "ticket-data",
            JSON.stringify({
                image: img.src /* the display img src after reading the img user uploaded line 39 */,
                name: userName,
                email: userEmail,
                github: githubUsername,
            })
        );

        changeUI(document.querySelector("#ticket"));
        form.reset();
        // Change the src of the upload file input image to default image
        img.src = "assets/images/icon-upload.svg";
        buttons.classList.add("hidden");
        span.classList.remove("hidden")
    }
});

// Genrate new ticket 
document.querySelector(".ticket button").addEventListener("click", () => {
    changeUI(document.querySelector("#form"));
    localStorage.removeItem("ticket-data")
})

// Create or edit existed note element
function updateNote(note, text, parent) {
    note.textContent = text;
    note.classList.add("error");
    note.prepend(icon.cloneNode(true));

    if (parent) {
        if (parent.querySelector(".note")) {
            parent.querySelector(".note").remove();
        }

        parent.append(note);
    }
}

// Change ticket user info based on data
function updateTicket(user) {
    // Get the elements wher data will be displayed
    const subHeading = document.querySelector(".ticket .ticket-heading p"),
        userImage = document.querySelector(".ticket figure img"),
        userName = document.querySelector(".ticket figcaption h3"),
        userGithub = document.querySelector(".ticket figcaption p"),
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(`${new Date().getFullYear() + 1}`);

    subHeading.innerHTML = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} / Online`;
    userImage.src = user.image;
    userName.textContent = user.name;
    userGithub.textContent = "@" + user.github;
}
