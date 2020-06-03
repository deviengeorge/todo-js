let todoForm, todoList, inputBox;

window.addEventListener("DOMContentLoaded", initalizeApp);

let todoItems = [];

function setReferences() {
  todoForm = document.querySelector("form");
  todoList = document.querySelector(".list");
  inputBox = document.querySelector("#item");
}

// This function to pull data from local storage and isert it in todoItems variable
function pullFromLocalStorage() {
  const todoItemsFromLocalStorage = JSON.parse(localStorage.items);
  if (todoItemsFromLocalStorage.length) {
    todoItems.push(...todoItemsFromLocalStorage);
    todoList.dispatchEvent(new CustomEvent("itemsModified"));
  } else {
    zeroItemsMessage();
  }
}

function initalizeApp() {
  setReferences();
  console.log("inside the app..");
  doEventBindings();
  pullFromLocalStorage();
}

function handleItemSubmission(event) {
  event.preventDefault();
  console.log("handle item submission..", event);
  const { item } = event.currentTarget;
  console.log(item.value, "here is the item content");

  // Trim function is to remove spaces in the input text
  if (!item.value.trim()) return;
  const todoItem = {
    name: item.value.toLowerCase(),
    id: `v0${todoItems.length + 1}`,
    complete: false,
  };

  todoItems.push(todoItem);
  console.log("There are now", todoItems.length, "items in the state");
  console.log(todoItems);

  // Reset function to reset the html form (input = "")
  todoForm.reset();

  // Create custom event inside dispatchEvent called "itemsModified"
  todoList.dispatchEvent(new CustomEvent("itemsModified"));
}

function zeroItemsMessage() {
  let html = `
    <h1 class="text-xl text-center">Add an item to the Todo List</h1>
  `;
  todoList.innerHTML = html;
}

function renderItems() {
  if (todoItems.length === 0) {
    return zeroItemsMessage();
  }
  const html = todoItems
    .map((item) => {
      return `
      <li class="border-gray-400 flex flex-row mb-2">
        <div class="select-none cursor-pointer bg-gray-200 rounded-md flex flex-1 items-center p-4 transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg">
        
          <div class="flex-1 pl-1 mr-16">
            <div class="font-medium" id="${item.id}">${item.name}</div>
          </div>

          <div class="text-gray-600 text-xs flex">
            <button name="complete-item" aria-label="Mark complete ${item.name}" class="flex no-shrink p-2 ml-3 mr-1 border-2 rounded hover:text-white text-green border-green hover:bg-green hover:shadow-sm">
              &#x2714;
            </button>
            <button name="remove-item" aria-label="Remove ${item.name}" class="flex no-shrink p-2 ml-3 mr-1 border-2 rounded hover:text-white text-red border-red hover:bg-red hover:shadow-sm">
              &#x274C;
            </button>
          </div>

        </div>
      </li>
    `;
    })
    .join("");
  todoList.innerHTML = html;
}

function markForCompletion(itemId) {
  const item = todoItems.find((item) => {
    return item.id === itemId;
  });

  // this will transform boolean value from false to true in both way
  console.log(item.complete);
  item.complete = !item.complete;
  console.log(item.complete);
  todoList.dispatchEvent(new CustomEvent("itemsModified"));
}

function removeItem(itemId) {
  todoItems = todoItems.filter((item) => {
    return item.id !== itemId;
  });
  todoList.dispatchEvent(new CustomEvent("itemsModified"));
}

function handleItemCompletionOrRemoval(event) {
  if (event.target.matches("button")) {
    const itemId =
      event.target.parentElement.previousElementSibling.firstElementChild.id;
    switch (event.target.name) {
      case "remove-item":
        removeItem(itemId);
        break;
      case "complete-item":
        markForCompletion(itemId);
        break;
      default:
        break;
    }
  }
}

function updateLocalStorage() {
  localStorage.items = JSON.stringify(todoItems);
  console.log(localStorage.items);
}

function doEventBindings() {
  console.log("inside the do event bindings call..");
  todoForm.addEventListener("submit", handleItemSubmission);
  todoList.addEventListener("itemsModified", renderItems);
  todoList.addEventListener("click", handleItemCompletionOrRemoval);
  todoList.addEventListener("itemsModified", updateLocalStorage);
}
