const micBtn = document.getElementById('mic-btn');
const statusSpan = document.getElementById('status');
const taskList = document.getElementById('task-list');

let recognition;
let listening = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        listening = true;
        micBtn.classList.add('listening');
        statusSpan.textContent = 'Listening... Speak your task.';
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.trim();

        if (transcript !== '') {
            addTask(transcript);
            statusSpan.textContent = 'Task added: "' + transcript + '"';
        } else {
            statusSpan.textContent = 'No speech detected. Try again.';
        }

        listening = false;
        micBtn.classList.remove('listening');
    };

    recognition.onerror = function (event) {
        statusSpan.textContent = 'Error: ' + event.error + '. Try again.';
        listening = false;
        micBtn.classList.remove('listening');
    };

    recognition.onend = function () {
        if (listening) {
            listening = false;
            micBtn.classList.remove('listening');
            statusSpan.textContent = 'Click the mic and speak your task...';
        }
    };

    micBtn.addEventListener('click', function () {
        if (!listening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });
} else {
    statusSpan.textContent = 'Sorry, your browser does not support voice recognition.';
    micBtn.disabled = true;
    micBtn.style.opacity = 0.5;
}

function addTask(text) {
    const li = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = text;
    taskText.setAttribute('tabindex', '0');
    taskText.setAttribute('contenteditable', 'true');

    taskText.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            taskText.blur();
        }
    });


    const checkbox = document.createElement('span');
    checkbox.className = 'custom-checkbox';
    checkbox.setAttribute('tabindex', '0');
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', 'false');

    checkbox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20">
            <polyline class="checkmark" points="5,11 9,15 15,6" />
        </svg>
    `;

    function toggleComplete() {
        li.classList.toggle('completed');
        const isChecked = li.classList.contains('completed');
        checkbox.setAttribute('aria-checked', isChecked);
    }

    checkbox.addEventListener('click', toggleComplete);
    checkbox.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleComplete();
        }
    });

    li.appendChild(taskText);
    li.appendChild(checkbox);
    taskList.prepend(li);
}
