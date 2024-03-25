const inputBox = document.getElementById("task-input");
const taskList = document.getElementById("list-container");

function addTask(){
    //https://stackoverflow.com/questions/2662245/how-to-check-whether-the-input-text-field-contains-only-white-spaces <333
    if(inputBox.value.match(/^\s*$/)){
        alert("You must write something!");
    }else{
        let li = document.createElement('li');
        li.innerHTML = `<p>${inputBox.value}</p><div class="buttons"><button class="edit"><i class="fa-solid fa-pen-to-square"></i></button><button class="delete"><i class="fa-solid fa-trash"></i></button></div>`;
        //if the list contains something, insert new task before
        if(taskList.firstChild){taskList.insertBefore(li,taskList.firstChild);}
        //else just append
        else{taskList.appendChild(li);}
    }
    inputBox.value = '';
    saveTasks();
}
//So that you don't have to explicitly press the button if you want to add a task
inputBox.addEventListener("keypress", (event)=>{if(event.key==="Enter") addTask();});


let initialTaskValue = '';
//TODO: reduce... redundancy...
function toggleEditMode(listItem){
    const editButton = listItem.querySelector('.edit');
    const deleteButton = listItem.querySelector('.delete');
    const editIcon = editButton.querySelector('i');
    const deleteIcon = deleteButton.querySelector('i');
    const taskText = listItem.querySelector('p');
    const taskInputField = document.createElement('input');
    
    taskInputField.classList.add('edit-field');
    taskInputField.type = 'text';
    taskInputField.value = taskText.textContent;
    initialTaskValue = taskText.textContent;
    
    listItem.replaceChild(taskInputField, taskText);
    taskInputField.focus();
    
    editIcon.classList.remove('fa-pen-to-square');
    editIcon.classList.add('fa-check');
    editButton.classList.remove('edit');
    editButton.classList.add('save');
    
    deleteIcon.classList.remove('fa-trash');
    deleteIcon.classList.add('fa-x');
    deleteButton.classList.remove('delete');
    deleteButton.classList.add('cancel');
}

function revertEditMode(listItem,buttonClicked){
    const editButton = listItem.querySelector('.save');
    const deleteButton = listItem.querySelector('.cancel');
    const editIcon = editButton.querySelector('i');
    const deleteIcon = deleteButton.querySelector('i');
    const taskText = document.createElement('p');
    const taskInputField = listItem.querySelector('.edit-field');
    const initialValue = taskInputField.dataset.initialValue;
    
    if(buttonClicked === 'save'){
        if(taskInputField.value.match(/^\s*$/)){
            alert("You must write something!");
            return; //exit
        }
        taskText.textContent = taskInputField.value;
        listItem.replaceChild(taskText, taskInputField);
        editIcon.classList.remove('fa-check');
        editIcon.classList.add('fa-pen-to-square');
        editButton.classList.remove('save');
        editButton.classList.add('edit');
        
        deleteIcon.classList.remove('fa-x');
        deleteIcon.classList.add('fa-trash');
        deleteButton.classList.remove('cancel');
        deleteButton.classList.add('delete');
        saveTasks();
    }else if(buttonClicked === 'cancel'){
        taskText.textContent = initialTaskValue; 
        listItem.replaceChild(taskText, taskInputField);
        editIcon.classList.remove('fa-check');
        editIcon.classList.add('fa-pen-to-square');
        editButton.classList.remove('save');
        editButton.classList.add('edit');
        
        deleteIcon.classList.remove('fa-x');
        deleteIcon.classList.add('fa-trash');
        deleteButton.classList.remove('cancel');
        deleteButton.classList.add('delete');
        saveTasks();
    }
    
}

taskList.addEventListener("click", (event) => {
    const listItem = event.target.closest('li');
    
    switch (true) {
        case event.target.classList.contains('delete') || event.target.parentElement.classList.contains('delete'):
            listItem.remove();
            saveTasks();
            break;
        case event.target.classList.contains('edit') || event.target.parentElement.classList.contains('edit'):
            toggleEditMode(listItem);
            break;
        case event.target.classList.contains('save') || event.target.parentElement.classList.contains('save'):
            revertEditMode(listItem,'save');
            break;
        case event.target.classList.contains('cancel') || event.target.parentElement.classList.contains('cancel'):
            revertEditMode(listItem,'cancel');
            break;
        case event.target.tagName === 'P':
            event.target.classList.toggle('strikethrough');
            break;
        default:
            break;
    }
});

//TODO (optional): add the added time && sorting by added time
//TODO (optional): if clicked outside input box in edit mode -> cancel

function saveTasks(){localStorage.setItem('tasks',taskList.innerHTML);}

function showTasks(){taskList.innerHTML = localStorage.getItem('tasks');}

showTasks();