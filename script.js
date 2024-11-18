// 初期ステータス
let currentStats = {
	strength: 0,
	speed: 0,
	stamina: 0,
	intelligence: 0,
	luck: 0,
};

// ページロード時に進行状況をロード
function loadGameProgress() {
	const savedLevel = localStorage.getItem('level');
	const savedExperience = localStorage.getItem('experience');
	const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const savedStats = JSON.parse(localStorage.getItem('stats')) || currentStats;

	// モーダルを確実に非表示に設定
	const modal = document.getElementById('levelUpModal');
	if (modal) {
		modal.style.display = 'none';
	}

	// ステータスを復元
	currentStats = savedStats;
	updateGameUI(parseInt(savedLevel) || 1, parseInt(savedExperience) || 0, savedTasks);
}

// 進行状況を保存
function saveGameProgress(level, experience, tasks) {
	localStorage.setItem('level', level);
	localStorage.setItem('experience', experience);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	localStorage.setItem('stats', JSON.stringify(currentStats)); // ステータスを保存
}

// UIを更新
function updateGameUI(level, experience, tasks) {
	document.getElementById('levelDisplay').textContent = `レベル: ${level}`;
	document.getElementById('experienceDisplay').innerHTML = 
		`次のレベルまでの経験値は <span id="experienceNeeded">${50 - experience}</span> ポイント`;

	// プログレスバーの更新
	const progressBar = document.getElementById('progressBar');
	progressBar.style.width = `${(experience / 50) * 100}%`;

	// タスクリストの更新
	const taskList = document.getElementById('taskList');
	taskList.innerHTML = ''; // タスクリストをクリア
	tasks.forEach((task, index) => {
		const li = document.createElement('li');
		li.textContent = task;

		// 完了ボタンを追加
		const doneButton = document.createElement('button');
		doneButton.textContent = '完了';
		doneButton.onclick = () => completeTask(index);

		li.appendChild(doneButton);
		taskList.appendChild(li);
	});

	// ステータス表示を更新
	updateStatsDisplay();
}

// ステータス表示を更新
function updateStatsDisplay() {
	const statsDisplay = document.getElementById('statsDisplay');
	statsDisplay.innerHTML = `
		<h3>現在のステータス</h3>
		<p>ちから: ${currentStats.strength}</p>
		<p>すばやさ: ${currentStats.speed}</p>
		<p>たいりょく: ${currentStats.stamina}</p>
		<p>かしこさ: ${currentStats.intelligence}</p>
		<p>うんのよさ: ${currentStats.luck}</p>
	`;
}

// タスクを追加
function addTask(task) {
	if (!task.trim()) return; // 空入力を無視
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	tasks.push(task);
	const level = localStorage.getItem('level') || 1;
	const experience = localStorage.getItem('experience') || 0;

	saveGameProgress(level, experience, tasks);
	updateGameUI(level, experience, tasks);
}

// タスクを完了
function completeTask(index) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const experience = parseInt(localStorage.getItem('experience')) || 0;
	const level = parseInt(localStorage.getItem('level')) || 1;

	tasks.splice(index, 1);

	let newExperience = experience + 10;
	let newLevel = level;

	if (newExperience >= 50) {
		newExperience -= 50;
		newLevel += 1;
		showModal(newLevel);
	}

	saveGameProgress(newLevel, newExperience, tasks);
	updateGameUI(newLevel, newExperience, tasks);
}

// モーダルを表示
function showModal(level) {
	const stats = {
		strength: generateStats(),
		speed: generateStats(),
		stamina: generateStats(),
		intelligence: generateStats(),
		luck: generateStats(),
	};

	// ステータスを加算
	currentStats.strength += stats.strength;
	currentStats.speed += stats.speed;
	currentStats.stamina += stats.stamina;
	currentStats.intelligence += stats.intelligence;
	currentStats.luck += stats.luck;

	const modalContent = `
		<h2>レベルが上がった！</h2>
		<p>レベル: ${level}</p>
		<p>ちからが ${stats.strength} 上がった！</p>
		<p>すばやさが ${stats.speed} 上がった！</p>
		<p>たいりょくが ${stats.stamina} 上がった！</p>
		<p>かしこさが ${stats.intelligence} 上がった！</p>
		<p>うんのよさが ${stats.luck} 上がった！</p>
	`;

	const modal = document.getElementById('levelUpModal');
	modal.querySelector('.modal-content').innerHTML = modalContent + '<span class="close" onclick="closeModal()">&times;</span>';
	modal.style.display = 'flex'; // モーダルを表示
}

// モーダルを閉じる
function closeModal() {
	const modal = document.getElementById('levelUpModal');
	modal.style.display = 'none'; // モーダルを非表示
}

// ランダムなステータスを生成
function generateStats() {
	return Math.floor(Math.random() * 6) + 1; // 1から6の乱数を生成
}

// ページロード時に実行
window.onload = loadGameProgress;
