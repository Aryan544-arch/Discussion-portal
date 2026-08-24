let questions = [];
let count = 1;
let selectedQuestionId = null;
let responseID = 1;

function displayQuestionsInOutputBox(
  questionArray = questions,
  searchValue = "",
) {
  let outputBox = document.getElementById("output-box");

  while (outputBox.firstChild) {
    outputBox.removeChild(outputBox.firstChild);
  }

  if (questionArray.length === 0) {
    let message = document.createElement("p");
    message.innerText = "No Such Question is Present";
    outputBox.appendChild(message);
    return;
  }

  let sortedQuestions = [...questionArray];
  sortedQuestions.sort((a, b) => {
    return Number(b.favourite) - Number(a.favourite);
  });

  sortedQuestions.forEach((elements) => {
    if (elements.resolved === false) {
      let section = document.createElement("div");
      section.setAttribute("data-question-id", elements.id);

      let titleBox = document.createElement("h3");
      highlightSearchText(titleBox, elements.title, searchValue);

      let descriptionBox = document.createElement("p");
      highlightSearchText(descriptionBox, elements.description, searchValue);

      let timeBox = document.createElement("p");
      timeBox.setAttribute("date-time-id",elements.id);
      timeBox.innerText = getQuestionTime(elements.createdAt);

      let createFovourite = document.createElement("div");
      createFovourite.classList.add("favourite-button");

      if (elements.favourite === false) {
        createFovourite.innerHTML = `
    <i class="fa-regular fa-star"
       style="color: rgb(255, 212, 59); height: 20px; width: 15px;">
    </i>
  `;
      } else {
        createFovourite.innerHTML = `
    <i class="fa-solid fa-star"
       style="color: rgb(255, 212, 59); height: 20px; width: 15px;">
    </i>
  `;
      }

      section.appendChild(titleBox);
      section.appendChild(descriptionBox);
      section.appendChild(timeBox);
      section.appendChild(createFovourite);

      outputBox.appendChild(section);
    }
  });
}

function storeDataInQuestions(title, description, id) {
  questions.push({
    id: id,
    title: title,
    description: description,
    favourite: false,
    responses: [],
    resolved: false,
    createdAt: Date.now(),
  });
  saveQuestion();
}

let leftSide = document.querySelector(".apply-border");
leftSide.addEventListener("click", (event) => {
  if (event.target.closest("#new-form")) {
    document.getElementById("div-2").style.display = "none";
    document.getElementById("div-1").style.display = "block";
    return;
  }
  let favourite = event.target.closest(".favourite-button");
  if (favourite) {
    toggleFavourite(favourite);
    return;
  }

  let questionElement = event.target.closest("[data-question-id]");
  if (questionElement) {
    let id = Number(questionElement.getAttribute("data-question-id"));
    selectedQuestionId = id;
    let selectedQuestion = questions.find((element) => element.id === id);
    document.getElementById("question-title").innerText =
      selectedQuestion.title;
    document.getElementById("question-description").innerText =
      selectedQuestion.description;
    displayResponse();
    document.getElementById("div-1").style.display = "none";
    document.getElementById("div-2").style.display = "block";

    return;
  }
});

leftSide.addEventListener("input", (event) => {
  if (event.target.id !== "search-question") {
    return;
  }
  let searchValue = event.target.value.trim().toLowerCase();
  if (searchValue === "") {
    displayQuestionsInOutputBox();
    return;
  }
  let filteredArray = questions.filter((element) => {
    return (
      element.title.toLowerCase().includes(searchValue) ||
      element.description.toLowerCase().includes(searchValue)
    );
  });
  displayQuestionsInOutputBox(filteredArray, searchValue);
});

function displayResponse() {
  let responseList = document.getElementById("response-list");
  while (responseList.firstChild) {
    responseList.removeChild(responseList.firstChild);
  }

  let selectedQuestion = questions.find((elements) => {
    return elements.id === selectedQuestionId;
  });

  let sortedResponses = [...selectedQuestion.responses];
  sortedResponses.sort((a, b) => {
    return b.likes - a.likes;
  });
  sortedResponses.forEach((element) => {
    let container = document.createElement("div");
    container.setAttribute("data-response-id", element.id);

    let title = document.createElement("h3");
    let response = document.createElement("p");

    let likeButton = document.createElement("button");
    likeButton.innerText = `Like ${element.likes}`;
    likeButton.classList.add("like-button");

    let dislikeButton = document.createElement("button");
    dislikeButton.innerText = `Dislike ${element.dislikes}`;
    dislikeButton.classList.add("dislike-button");

    title.innerText = element.name;
    response.innerText = element.response;
    container.appendChild(title);
    container.appendChild(response);
    container.appendChild(likeButton);
    container.appendChild(dislikeButton);

    responseList.appendChild(container);
  });
}

function toggleFavourite(favourite) {
  let questionElement = favourite.closest("[data-question-id]");
  let questionId = Number(questionElement.getAttribute("data-question-id"));

  let question = questions.find((element) => {
    return element.id === questionId;
  });
  question.favourite = !question.favourite;
  displayQuestionsInOutputBox();
  saveQuestion();
}

function saveQuestion() {
  localStorage.setItem("Key", JSON.stringify(questions));
}

function loadQuestion() {
  if (JSON.parse(localStorage.getItem("Key")) === null) return;
  questions = JSON.parse(localStorage.getItem("Key"));
  count = questions.length + 1;

  questions.forEach((question) => {
    question.responses.forEach((response) => {
      if (response.id >= responseID) responseID = response.id + 1;
    });
  });
}

(function called() {
  loadQuestion();
  displayQuestionsInOutputBox();
})();

let rightSide = document.getElementById("right-side");
rightSide.addEventListener("click", (event) => {
  if (event.target.closest("#resolve")) {
    let selectedQuestion = questions.find((element) => {
      return element.id === selectedQuestionId;
    });

    selectedQuestion.resolved = true;

    displayQuestionsInOutputBox();
    saveQuestion();

    return;
  }
  if (event.target.closest("#submit")) {
    let titleBox = document.getElementById("title-box");
    let descriptionBox = document.getElementById("description-box");
    if (titleBox.value.trim() === "" || descriptionBox.value.trim() === "") {
      alert("Enter Data");
      return;
    }
    storeDataInQuestions(
      titleBox.value.trim(),
      descriptionBox.value.trim(),
      count++,
    );
    titleBox.value = "";
    descriptionBox.value = "";
    displayQuestionsInOutputBox();
    saveQuestion();
  }
  if (event.target.closest("#submit-response")) {
    let responserName = document.getElementById("responser-name");
    let responserDescription = document.getElementById("user-response");

    if (
      responserName.value.trim() === "" ||
      responserDescription.value.trim() === ""
    ) {
      alert("Enter Data");
      return;
    }

    let selectedQuestion = questions.find((element) => {
      return element.id === selectedQuestionId;
    });

    selectedQuestion.responses.push({
      id: responseID++,
      name: responserName.value.trim(),
      response: responserDescription.value.trim(),
      likes: 0,
      dislikes: 0,
    });
    responserName.value = "";
    responserDescription.value = "";
    displayResponse();
    saveQuestion();

    return;
  }
  let likeButton = event.target.closest(".like-button");
  let dislikeButton = event.target.closest(".dislike-button");
  if (!likeButton && !dislikeButton) {
    return;
  }
  let responseElement = event.target.closest("[data-response-id]");
  let responseId = Number(responseElement.getAttribute("data-response-id"));
  let selectedQuestion = questions.find((element) => {
    return element.id === selectedQuestionId;
  });
  let selectedResponse = selectedQuestion.responses.find((element) => {
    return element.id === responseId;
  });
  if (likeButton) {
    selectedResponse.likes++;
  }
  if (dislikeButton) {
    selectedResponse.dislikes++;
  }
  saveQuestion();
  displayResponse();
});

function highlightSearchText(element, text, searchValue) {
  if (searchValue === "") {
    element.innerText = text;
    return;
  }

  let regex = new RegExp(searchValue, "gi");
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    let beforeMatch = text.substring(lastIndex, match.index);
    let beforeTextNode = document.createTextNode(beforeMatch);

    let markElement = document.createElement("mark");
    let matchedTextNode = document.createTextNode(match[0]);

    markElement.appendChild(matchedTextNode);

    element.appendChild(beforeTextNode);
    element.appendChild(markElement);

    lastIndex = match.index + match[0].length;
  }

  let afterMatch = text.substring(lastIndex);
  let afterTextNode = document.createTextNode(afterMatch);

  element.appendChild(afterTextNode);
}

function getQuestionTime(createdAt) {
  let elapsedTime = Date.now() - createdAt;
  let elapsedSeconds = Math.floor(elapsedTime / 1000);

  if (elapsedSeconds < 10) {
    return "few moments ago";
  }

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} seconds ago`;
  }

  let elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minutes ago`;
  }

  let elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours} hours ago`;
  }

  let elapsedDays = Math.floor(elapsedHours / 24);

  return `${elapsedDays} days ago`;
}

setInterval(()=>{
  questions.forEach((question)=>{
    let timeBox=document.querySelector(`[date-time-id="${question.id}"]`);
    if(timeBox){
      timeBox.innerText=getQuestionTime(question.createdAt);
    }
  });
},1000);