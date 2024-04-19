const prioritySelect = document.getElementById("prioritySelect");
const deadlineInput = document.getElementById("deadlineInput");
const taskinput = document.querySelector('.task-input input');
const taskbox = document.querySelector('.task-box');
const filters = document.querySelectorAll(".filters span");
const clearall = document.querySelector('.clear-btn');

// Getting local storage to-do list
let todos = JSON.parse(localStorage.getItem('todo-list'));
let editid;
let iseditedtask = false;

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add("active");
        showtodo(btn.id);
    })
});

function showtodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            //if todo status is completed set the iscompleted value to checked
            let iscompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == 'all') {
                li += `<li class="task">
                <label for="${id}">
                    <input  onclick="updatestatus(this)" type="checkbox" name="" id="${id}" ${iscompleted}>
                    <p class="${iscompleted}">${todo.name}</p>
                    <span class="task-info">Priority: ${todo.priority}, Deadline: ${todo.deadline}</span>
                </label>
                <div class="settings">
                    <i onclick="showmenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="edittask(${id} ,'${todo.name}', '${todo.priority}', '${todo.deadline}')"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li id="${id}" onclick="deletetask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;

            }
        });
    }

    taskbox.innerHTML = li || `<span>You don't have any tasks pending well done!!</span>`;
}

showtodo("all");

function showmenu(selectedtask) {
    let taskmenu = selectedtask.parentElement.lastElementChild;
    taskmenu.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != 'I' || e.target != selectedtask) {
            taskmenu.classList.remove("show");
        }
    });
}

function edittask(taskid, taskname, taskpriority, taskdeadline) {
    editid = taskid;
    iseditedtask = true;
    taskinput.value = taskname;
    // Set the priority and deadline values in the UI
    prioritySelect.value = taskpriority;
    deadlineInput.value = taskdeadline;
}

function deletetask(deleteid) {
    //to delete only 1 item from the array with the specific deleteid only
    todos.splice(deleteid, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showtodo();
}

clearall.onclick = () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showtodo();
}

function updatestatus(selectedtask) {
    let taskname = selectedtask.parentElement.lastElementChild;
    if (selectedtask.checked) {
        taskname.classList.add("checked");
        //updating status of the selected task completed
        todos[selectedtask.id].status = "completed";
    } else {
        taskname.classList.remove("checked");
        //updating status of the selected task pending
        todos[selectedtask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskinput.addEventListener("keyup", e => {
    let usertask = taskinput.value.trim();
    if (e.key == 'Enter' && usertask) {
        if (!iseditedtask) {
            //if no previous todo found then pass or assign an empty array to the todo
            if (!todos) {
                todos = [];
            }
            let taskinfo = {
                name: usertask,
                priority: prioritySelect.value,
                deadline: deadlineInput.value,
                status: "pending"
            };
            todos.push(taskinfo);
        } else {
            iseditedtask = false;
            todos[editid].name = usertask;
            todos[editid].priority = prioritySelect.value;
            todos[editid].deadline = deadlineInput.value;
        }
        taskinput.value = '';
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showtodo("all");
    }
});
