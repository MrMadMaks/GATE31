const getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
};

let arrElem = [];
getResource("https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7")
    .then((data) => (arrElem = data))
    .then((data) => createCards(data))
    .catch((err) => console.error(err));

const createCards = (data) => {
    data.forEach((item) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <h2 class = 'title'>${item.title}</h2>
        <p class = 'text'>${item.body}</p>
        <input class = 'check' type="checkbox"/>
        `;
        document.querySelector(".app").appendChild(card);
    });

    let app = document.querySelector(".app");

    app.addEventListener("click", function (ev) {
        if (ev.target.tagName === "INPUT") {
            if (ev.target.checked) {
                ev.target.parentNode.classList.add("checked");
            } else {
                ev.target.parentNode.classList.remove("checked");
            }
        }
    });
};

let inputState = "";
let input = document.querySelector(".inputState");
let button = document.querySelector(".searchButton");

input.addEventListener("change", (ev) => {
    inputState = ev.target.value;
});

button.addEventListener("click", (e) => {
    e.preventDefault()
    const res = arrElem.filter((el) => el.title.includes(inputState));

    //delete old card => render new
    const cards = document.querySelectorAll(".card");

    cards.forEach((box) => {
        box.remove();
    });

    createCards(res);

    let queryParams = new URLSearchParams(window.location.search);

    queryParams.set("search", inputState);

    history.pushState(null, null, "?" + queryParams.toString());
});
