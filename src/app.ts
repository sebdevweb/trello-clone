const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>

//Declare dynamics variables
let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUl: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualTextInput: HTMLInputElement,
    actualValidation: HTMLSpanElement;

//Global function to ADD, DELETE, DRAG&DROP container
//Fonction parent au container qui sertà rajouter tous les listeners
function addContainerListeners(currentContainer: HTMLDivElement) {

    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement;
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement;
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement;
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement;

    // listeners
    deleteBtnListeners(currentContainerDeletionBtn)
    addItemBtnListeners(currentAddItemBtn)
    closingFormBtnListeners(currentCloseFormBtn)
    addFormSubmitListeners(currentForm)
    addDragDropListeners(currentContainer)
}

itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container)
});


// DELETE ITEMS CONTAINER
function deleteBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleContainerDeletion)
}

function handleContainerDeletion(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[];
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[];
    containers[btnsArray.indexOf(btn)].remove();
    console.log('DELETE CONTAINER');
    
}

//DISPLAYING FORM INPUT & submit BUTTON
function addItemBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleAddItem)
}

function handleAddItem(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    if(actualContainer) toggleForm(actualBtn, actualForm, false)
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}

function setContainerItems(btn: HTMLButtonElement) {
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;
    actualForm = actualContainer.querySelector('form') as HTMLFormElement;
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement;
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;
}

function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean) {
    if(!action) {
        form.style.display = 'none';
        btn.style.display = 'block';
    } else if (action) {
        form.style.display = 'block';
        btn.style.display = 'none';
    }
}

//CLOSE BTN ITEM ACTION
function closingFormBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}

//ADD FORM SUBMIT
function addFormSubmitListeners(form: HTMLFormElement) {
    form.addEventListener('submit', createNewItem);
}

function createNewItem(e: Event) {
    e.preventDefault();
    //Validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = 'Must be at least 1 character long';
    } else {
        actualValidation.textContent = '';
    }
    //Item creation
    const itemContent = actualTextInput.value;
    const li = 
    `<li class="item" draggable="true">
        <p>${itemContent}</p>
        <button>X</button>
    </li>`
    if (actualTextInput.value.length >= 1) {
        actualUl.insertAdjacentHTML('beforeend', li);
    }

    //Delete li item
    const item = actualUl.lastElementChild as HTMLLIElement;
    const liBtn = item.querySelector('button') as HTMLButtonElement;
    handleItemDeletion(liBtn);
    addDragDropListeners(item);
    actualTextInput.value = '';
}

function handleItemDeletion(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove();
    })
}


//ADD NEW CONTAINER
const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement;
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement;
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement;
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement;
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement;
const containerList = document.querySelector('.main-content') as HTMLDivElement;

//Toggle Form: new container
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
    console.log('OPEN NEW CONTAINER');
    
})

addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
    console.log('CLOSE NEW CONTAINER');
})

//Add item on new container
addContainerForm.addEventListener('submit', createNewContainer);

function createNewContainer(e: Event) {
    e.preventDefault()
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = 'Must be at least 1 character long'
        return;  
    } else {
        validationNewContainer.textContent = ""
    }
    const itemsContainer = document.querySelector('.items-container') as HTMLDivElement;
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement;
    const newContainerContent = 
    `<div class="top-container">
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
        </form>`
    newContainer.innerHTML = newContainerContent;
    containerList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = '';
    addContainerListeners(newContainer);
}

//DRAG & DROP ACTION
function addDragDropListeners(element: HTMLElement) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

let dragSrcEl: HTMLElement //élément dynamique avec lequel il y a interaction ()

function handleDragStart(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();
    // Si un container est déjà ouvert
    if (actualContainer) toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    e.dataTransfer?.setData('text/html', this.innerHTML)
    console.log('DRAGSTART', e);
    
}
function handleDragOver(e: DragEvent) {
    e.preventDefault()
}

function handleDrop(this: HTMLElement, e: DragEvent) {
    console.log('DROP', e);
    e.stopPropagation()
    const receptionEl = this;
    
    if(dragSrcEl.nodeName === 'LI' && receptionEl.classList.contains('items-container')) {
        (receptionEl.querySelector('ul')as HTMLUListElement).appendChild(dragSrcEl); //rajoute l'item dans la liste du container dans lequel on drop l'item
        //Les évènements disparaissent
        addDragDropListeners(dragSrcEl) // on lui rajoute cet événement pour pouvoir le déplacer à nouveau
        handleItemDeletion(dragSrcEl.querySelector('button') as HTMLButtonElement) // + cet événment si on désire le supprimer
    }
}

function handleDragEnd() {}