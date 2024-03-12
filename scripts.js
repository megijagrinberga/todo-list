const inputBox = document.getElementById("task-input");
const taskList = document.getElementById("list-container");

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }else{
        let li = document.createElement('li');
        li.innerHTML = `<p>${inputBox.value}</p><div class="buttons"><button class="edit"><i class="fa-solid fa-pen-to-square"></i></button><button class="delete"><i class="fa-solid fa-trash"></i></button></div>`;
        if(taskList.firstChild){taskList.insertBefore(li,taskList.firstChild);} //ja sarakstā jau ir kāds ieraksts, ievieto pirms tā
        else{taskList.appendChild(li);} //citādi vnk append
    }
    inputBox.value = '';
    saveTasks();
}

//TODO: event listeners for edit and delete
//      striking through finished task (so an event listener + new css strikethrough class)
//      sorting by added time for filtering

function saveTasks(){
    localStorage.setItem('tasks',taskList.innerHTML);
}

function showTasks(){
    taskList.innerHTML = localStorage.getItem('tasks');
}

showTasks();