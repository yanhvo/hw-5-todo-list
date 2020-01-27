var MyToDoModule = (function() {
  var addButton = document.getElementById('add_button');
  var todoList = document.getElementById('tasks_list');
  document.getElementById('deadline').value = "";

  function loadMyToDo() {
    todoList.innerHTML = window.localStorage.getItem('tasks_list');
    checkDates();
  }

  function updateLocalStorage() {
    window.localStorage.setItem('tasks_list', todoList.innerHTML);
  }

  function addListeners() {
    addButton.addEventListener('click', newTask);

    var complite_filter = document.getElementById('completed_filter');
    complite_filter.addEventListener('change', compliteFilter);
    
    var date_filter = document.getElementById('date_filter');
    date_filter.addEventListener('change', deadlineFilter);

    var all_list = document.querySelector('ul');
    all_list.addEventListener('click', delOrCheckTasks);
  }

  function newTask() {
    var inputValue = document.getElementById('new_task').value;
    var inputDeadline = document.getElementById('deadline').value;
      if(inputValue == "") {
         alert("Please, add the task!");
      } else {
        var li = document.createElement('li');
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        li.setAttribute('class', 'todo');
         document.getElementById('tasks_list').appendChild(li);

      // add delete button
      var close_span = document.createElement('SPAN');
      var txt = document.createTextNode("X");
      close_span.className = "close";
      close_span.appendChild(txt);
      li.appendChild(close_span);
      // add deadline
      if (inputDeadline != 0) {
        var time_span = document.createElement('SPAN');
        var time = document.createTextNode(inputDeadline);
        time_span.className = "time";
        time_span.appendChild(time);
        li.appendChild(time_span);
        li.classList.toggle('with_daedline');
        checkDates();
    } else { li.classList.toggle('without_daedline');}
      updateLocalStorage();

      document.getElementById('deadline').value = "";
      document.getElementById('new_task').value = "";
    }
  }

  //checking for overdue tasks
  function checkDates() {
    var deadlineList = document.getElementsByClassName('with_daedline');
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    for (var i = 0; i < deadlineList.length; i++) {
      var deadline = new Date(deadlineList[i].lastChild.innerText);
      deadline.setHours(0, 0, 0, 0);
      if (deadline.getTime() + 1 < today.getTime()) {
        deadlineList[i].classList.add('overdue');
      }
    }

  }

  //filter tasks by deadline: tomorrow/next week
  function deadlineFilter() {
    var filter = document.getElementById('date_filter');
    var deadlineList = document.getElementsByClassName('with_daedline');
    makeHidden('without_daedline');

    var today = new Date();
    var tomorrow = new Date();
    var nextWeekMonday = new Date();
    var nextWeekSunday = new Date();

    tomorrow.setDate(today.getDate() + 1);
    nextWeekMonday.setDate(
      today.getDate() +
      ((8 - today.getDay()) % 7) +
      (today.getDay() === 1 ? 7 : 0)
    );
    nextWeekSunday.setDate(today.getDate() + ((14 - today.getDay()) % 7) + 8);

    tomorrow.setHours(0, 0, 0, 0);
    nextWeekMonday.setHours(0, 0, 0, 0);
    nextWeekSunday.setHours(0, 0, 0, 0);

    for (var i = 0; i < deadlineList.length; i++) {
      var deadline = new Date(deadlineList[i].lastChild.innerText);
      deadline.setHours(0, 0, 0, 0);
      if (filter.value === 'Tomorrow') {
        deadline.getTime() == tomorrow.getTime()
          ? deadlineList[i].classList.remove('hidden')
          : deadlineList[i].classList.add('hidden');
      } else if (filter.value === 'Next week') {
        deadline.getTime() >= nextWeekMonday.getTime() &&
        deadline.getTime() <= nextWeekSunday.getTime()
          ? deadlineList[i].classList.remove('hidden')
          : deadlineList[i].classList.add('hidden');
      } else {
        deadlineList[i].classList.remove('hidden');
        makeHidden(1, 'without_daedline');
      }
    }
  }

  // filter tasks by completed/incompleted
  function compliteFilter() {
    var filter = document.getElementById('completed_filter');

    if (filter.value === 'Uncomplited') {
      makeHidden('completed', 'todo');
   } else if(filter.value === 'Complited') {
     makeHidden('todo', 'completed');
   } else {
     makeHidden(1, 'completed', 'todo');
   }
  }

  function makeHidden(hid, unhid1, unhid2) {
    var hidList = document.getElementsByClassName(hid);
    var unhidList1 = document.getElementsByClassName(unhid1);
    var unhidList2 = document.getElementsByClassName(unhid2);

    for (var i = 0; i < hidList.length; i++) {
      hidList[i].classList.add('hidden');
    }
    for (var i = 0; i < unhidList1.length; i++) {
      unhidList1[i].classList.remove('hidden');
    }
    for (var i = 0; i < unhidList2.length; i++) {
      unhidList2[i].classList.remove('hidden');
    }
  }

  //delete or check the selected task
  function delOrCheckTasks(task) {
      if(task.target.tagName === "LI") {
        task.target.classList.toggle('todo');
         task.target.classList.toggle('completed');
      } else if(task.target.classList.contains('close')) {
         var div = task.target.parentNode;
         div.remove();
      }
      updateLocalStorage();
  }

  return {
    init: function() {
      loadMyToDo();
      addListeners();
    }
  }
})();

MyToDoModule.init();
