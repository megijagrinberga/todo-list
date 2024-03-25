const inputBox = document.getElementById("task-input");
const taskList = document.getElementById("list-container");

document.addEventListener('DOMContentLoaded', () => {
    sortTasksByTimestamp('default'); //sort tasks by default (new -> old) on page load
});

function addTask(){
    //https://stackoverflow.com/questions/2662245/how-to-check-whether-the-input-text-field-contains-only-white-spaces <333
    if(inputBox.value.match(/^\s*$/)){alert("You must write something!");}
    else{
        let li = document.createElement('li');
        let timestamp = document.createElement('div');
        let currentTime = new Date().getTime(); //get date as int for sorting
        console.log('test');
        li.dataset.timestamp = currentTime; //add timestamp attribute to task for sorting
        timestamp.textContent = new Date(currentTime).toLocaleString(); //get formatted date
        timestamp.classList.add('timestamp');
        timestamp.style.opacity = '0'; //hide timestamp initially
        li.innerHTML = `<p>${inputBox.value}</p>
                        <div class="buttons">
                            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="delete"><i class="fa-solid fa-trash"></i></button>
                        </div>`;
        li.appendChild(timestamp);

        if(taskList.firstChild){taskList.insertBefore(li,taskList.firstChild);} //if list contains something, insert new task before
        else{taskList.appendChild(li);} //else just append
    }
    inputBox.value = '';
    saveTasks();
}
//So that you don't have to explicitly press the button if you want to add a task
inputBox.addEventListener("keypress", (event)=>{if(event.key==="Enter") addTask();});

//Show timestamp when hovering over task
taskList.addEventListener('mouseover', (event) => {
    const target = event.target.closest('li');
    if (target) {
        const timestamp = target.querySelector('.timestamp');
        timestamp.style.transition = 'opacity 0.45s';
        timestamp.style.opacity = '1';
    }
});
//Hide timestamp
taskList.addEventListener('mouseout', (event) => {
    const target = event.target.closest('li');
    if (target) {
        const timestamp = target.querySelector('.timestamp');
        timestamp.style.transition = 'opacity 0.25s';
        timestamp.style.opacity = '0';
    }
});

function sortTasksByTimestamp(order) {
    console.log("Sorting tasks by timestamp. Order: " + order);

    //Make array of tasks
    const tasks = Array.from(taskList.querySelectorAll('li'));

    tasks.sort((a, b) => {
        const timestampA = a.dataset.timestamp;
        const timestampB = b.dataset.timestamp;

        if (order === 'newest' || order === 'default') {return timestampB - timestampA;} //tasks are sorted new -> old by default, but w/e
        else if (order === 'oldest') {return timestampA - timestampB;} 
    });
    //Remove existing tasks from the list
    while (taskList.firstChild) {taskList.removeChild(taskList.firstChild);}
    //Replace with sorted tasks
    tasks.forEach((task) => taskList.appendChild(task));
}

const filters = document.getElementById("filters");
filters.addEventListener('change', () => {
    const selectedOption = filters.value;
    if (selectedOption === 'default' || selectedOption === 'newest' || selectedOption === 'oldest') {sortTasksByTimestamp(selectedOption);}
});

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
    
    if(buttonClicked === 'save'){
        if(taskInputField.value.match(/^\s*$/)){
            alert("You must write something!");
            return;
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
//TODO (optional): if clicked outside input box in edit mode -> cancel

function saveTasks(){
    localStorage.setItem('tasks',taskList.innerHTML);
}

function showTasks(){
    taskList.innerHTML = localStorage.getItem('tasks');
}

showTasks();