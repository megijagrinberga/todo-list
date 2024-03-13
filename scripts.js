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

taskList.addEventListener("click",(event)=>{
    //if u press the btn w/ the class delete or the icon within the btn
    if(event.target.classList.contains('delete') || event.target.parentElement.classList.contains('delete')){ 
        //if the delete btn was a direct child of li, then u could simply do w/ event.target.parentElement.remove(), bet dzīvē viss ir savādāk :)
        event.target.closest('li').remove();
        saveTasks();
    }
    else if (event.target.classList.contains('edit') || event.target.parentElement.classList.contains('edit')) {
        //if the target has the class edit, then it's the btn. Otherwise it's the icon -> u gotta access the parent elem aka ze batn
        const editButton = event.target.classList.contains('edit') ? event.target : event.target.parentElement;
        const listItem = editButton.closest('li');
        const deleteButton = listItem.querySelector('.delete');
        //changing the icons
        const editIcon = editButton.querySelector('i');
        const deleteIcon = deleteButton.querySelector('i');
        
        editIcon.classList.remove('fa-pen-to-square');
        editIcon.classList.add('fa-check');
        deleteIcon.classList.remove('fa-trash');
        deleteIcon.classList.add('fa-x');
        //changing the classes
        editButton.classList.remove('edit');
        editButton.classList.add('save');
        deleteButton.classList.remove('delete');
        deleteButton.classList.add('cancel');
      }
    else if(event.target.tagName === 'P'){event.target.classList.toggle('strikethrough')}
}
);
//TODO: actually allow the user to edit task && (save xor cancel edit)
//      sorting by added time for filtering

function saveTasks(){localStorage.setItem('tasks',taskList.innerHTML);}

function showTasks(){taskList.innerHTML = localStorage.getItem('tasks');}

showTasks();