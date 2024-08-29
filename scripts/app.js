"use strict";
const itemsContainer = document.querySelectorAll('.items-container');
//Declare dynamics variables
let actualContainer, actualBtn, actualUl, actualForm, actualTextInput, actualValidation;
//Global function to ADD, DELETE, DRAG&DROP container
//Fonction parent au container qui sertà rajouter tous les listeners
function addContainerListeners(currentContainer) {
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn');
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    // listeners
    deleteBtnListeners(currentContainerDeletionBtn);
    addItemBtnListeners(currentAddItemBtn);
    closingFormBtnListeners(currentCloseFormBtn);
    addFormSubmitListeners(currentForm);
}
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
// DELETE ITEMS CONTAINER
function deleteBtnListeners(btn) {
    btn.addEventListener('click', handleContainerDeletion);
}
function handleContainerDeletion(e) {
    const btn = e.target;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')];
    const containers = [...document.querySelectorAll('.items-container')];
    containers[btnsArray.indexOf(btn)].remove();
    console.log('DELETE CONTAINER');
}
//DISPLAYING FORM INPUT & submit BUTTON
function addItemBtnListeners(btn) {
    btn.addEventListener('click', handleAddItem);
}
function handleAddItem(e) {
    const btn = e.target;
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
}
function toggleForm(btn, form, action) {
    if (!action) {
        form.style.display = 'none';
        btn.style.display = 'block';
    }
    else if (action) {
        form.style.display = 'block';
        btn.style.display = 'none';
    }
}
//CLOSE BTN ITEM ACTION
function closingFormBtnListeners(btn) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}
//ADD FORM SUBMIT
function addFormSubmitListeners(form) {
    form.addEventListener('submit', createNewItem);
}
function createNewItem(e) {
    e.preventDefault();
    //Validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = 'Must be at least 1 character long';
    }
    else {
        actualValidation.textContent = '';
    }
    //Item creation
    const itemContent = actualTextInput.value;
    const li = `<li class="item" draggable="true">
        <p>${itemContent}</p>
        <button>X</button>
    </li>`;
    if (actualTextInput.value.length >= 1) {
        actualUl.insertAdjacentHTML('beforeend', li);
    }
    //DELETE LI ITEM
    const item = actualUl.lastElementChild;
    const liBtn = item.querySelector('button');
    handleItemDeletion(liBtn);
    actualTextInput.value = '';
}
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
//ADD NEW CONTAINER
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-add-list');
const addNewContainer = document.querySelector('.add-new-container');
const containerList = document.querySelector('.main-content');
//TOGGLE FORM: new container
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
    console.log('OPEN NEW CONTAINER');
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
    console.log('CLOSE NEW CONTAINER');
});
//Add item on new container
addContainerForm.addEventListener('submit', createNewContainer);
function createNewContainer(e) {
    e.preventDefault();
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = 'Must be at least 1 character long';
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }
    const itemsContainer = document.querySelector('.items-container');
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `<div class="top-container">
            <h2>${addContainerFormInput.value}</h2>
            <button class="delete-container-btn">X</button>
        </div>
        <ul></ul>
        <button class="add-item-btn">Add an item</button>
        <form autocomplete="off">
            <div class="top-form-container">
                <label for="item">Add a new item</label>
                <button type="button" class="close-form-btn">X</button>
            </div>
            <input type="text" id="item">
            <span class="validation-msg"></span>
            <button type="submit">Submit</button>
        </form>`;
    newContainer.innerHTML = newContainerContent;
    containerList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = '';
    addContainerListeners(newContainer);
}
