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
