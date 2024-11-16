let points = 0;
let level = 1;

function showModal(message) {
    const overlay = document.getElementById('levelUpOverlay');
    const modal = document.getElementById('levelUpModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    overlay.style.display = 'block';
    modal.style.display = 'block';

    // Auto-close modal after 5 seconds
    setTimeout(() => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }, 5000);
}

function levelUp() {
    level++;
    document.getElementById('level').textContent = level;

    // Show modal with level-up message
    showModal('Congratulations! You leveled up! Keep completing tasks to grow further!');
    updateProgressBar();
}

function addPoints(amount, x, y) {
    points += amount;
    document.getElementById('points').textContent = points;

    // Add animation to points
    const pointsElement = document.getElementById('points');
    pointsElement.classList.add('add-points');
    setTimeout(() => pointsElement.classList.remove('add-points'), 500);
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (points % (level * 100)) / (level * 100) * 100;
    progressBar.style.width = `${progress}%`;
}

function createTaskElement(taskName) {
    const taskList = document.getElementById('taskList');
    const newTask = document.createElement('li');
    newTask.textContent = taskName;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', function() {
        const rect = completeButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        addPoints(10, x, y);
        if (points >= level * 100) {
            levelUp();
        }
        taskList.removeChild(newTask);
    });

    newTask.appendChild(completeButton);
    taskList.appendChild(newTask);
}

document.getElementById('addTask').addEventListener('click', function() {
    const taskName = document.getElementById('newTask').value;
    if (!taskName) return;
    createTaskElement(taskName);
    document.getElementById('newTask').value = '';
});

updateProgressBar();
