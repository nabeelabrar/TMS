const taskContainer = document.querySelector(".task__container");
const taskModal = document.querySelector(".task__modal__body");
const imageurl = document.getElementById("imageurl");
const taskTitle = document.getElementById("taskTitle");
const taskType = document.getElementById("taskType");
const taskDescription = document.getElementById("taskDescription");

let globalStore = [];

const generateNewCard = (taskData) => {
    const newCard = `
        <div class="col-md-6 col-lg-4" id=${taskData.id}>
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-success" id=${taskData.id} onClick="editTask.apply(this, arguments)">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" id=${taskData.id} onClick="deleteTask.apply(this, arguments)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                
                <img src=${taskData.imageUrl || `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`} class="card-img-top" alt="card image">
                <div class="card-body">
                    <h4 class="card-title fw-bold">${taskData.taskTitle}</h4>
                    <p class="card-text">${taskData.taskDescription}</p>
                    <a href="#" class="btn btn-primary">${taskData.taskType}</a>
                </div>
                <div class="card-footer">
                    <button type="button" id=${taskData.id} 
                    class="btn btn-outline-primary float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#showTask"
                    onclick="openTask.apply(this, arguments)"
                    >
                    Open Task
                    </button>
                </div>
            </div>
        </div>
    `;
    return newCard;
}

const htmlModalContent = ({ id, taskTitle, taskDescription, imageUrl }) => {
    const date = new Date(parseInt(id));
    return ` <div id=${id}>
    <img
    src=${imageUrl ||
        `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
        }
    alt="bg image"
    class="img-fluid place__holder__image mb-3"
    />
    <h5 class="text-sm text-muted fw-bold">Created on ${date.toDateString()}</h5>
    <h2 class="my-3">${taskTitle}</h2>
    <p class="lead">
    ${taskDescription}
    </p></div>`;
};

const loadInitialCardData = () => {
    const getCardData = localStorage.getItem("tasky");

    const { cards } = JSON.parse(getCardData);

    cards.map((cardObject) => {
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

        globalStore.push(cardObject);
    })
}

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: imageurl.value,
        taskTitle: taskTitle.value,
        taskType: taskType.value,
        taskDescription: taskDescription.value
    };

    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

    globalStore.push(taskData);

    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));
}

const deleteTask = (e) => {
    if (!e) e = window.event;

    const targetId = e.target.id;
    const tagname = e.target.tagName;

    globalStore = globalStore.filter((cardObject) => (cardObject.id) !== targetId);
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

    if (tagname === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
}

const editTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const tagName = e.target.tagName;
    let parentNode;

    if (tagName === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentNode.childNodes[5].childNodes[1];
    let taskType = parentNode.childNodes[5].childNodes[5];
    let taskDescription = parentNode.childNodes[5].childNodes[3];
    let submitButton = parentNode.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
}

const saveEdit = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const tagName = e.target.tagName;
    let parentNode;

    if (tagName === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentNode.childNodes[5].childNodes[1];
    let taskType = parentNode.childNodes[5].childNodes[5];
    let taskDescription = parentNode.childNodes[5].childNodes[3];
    let submitButton = parentNode.childNodes[7].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    globalStore = globalStore.map((task) => {
        if (task.id === targetId) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updateData.taskTitle,
                taskType: updateData.taskType,
                taskDescription: updateData.taskDescription
            }
        }
        return task;
    });

    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
}

const openTask = (e) => {
    if (!e) e = window.event;

    const getTask = globalStore.filter(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask[0]);
};

const searchTask = (e) => {
    if (!e) e = window.event;

    while (taskContainer.firstChild) {
        taskContainer.removeChild(taskContainer.firstChild);
    }

    const resultData = globalStore.filter(({ taskTitle }) => taskTitle.toLowerCase().includes(e.target.value.toLowerCase()))

    resultData.map((cardData) => {
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardData));
    });
}