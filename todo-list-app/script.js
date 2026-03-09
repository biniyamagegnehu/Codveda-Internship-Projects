/**
 * Enhanced To-Do List Application
 * Features: Add, Edit, Delete, Complete, Filter, Search, Categories, Due Dates, Local Storage
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DOM Elements =====
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskDueDate = document.getElementById('taskDueDate');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const sortBtn = document.getElementById('sortBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const toast = document.getElementById('toast');
    
    // Stat elements
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const pendingTasksSpan = document.getElementById('pendingTasks');
    const totalTasksFooter = document.getElementById('totalTasksFooter');
    const completedTasksFooter = document.getElementById('completedTasksFooter');
    
    // ===== State Variables =====
    let tasks = [];
    let currentFilter = 'all';
    let currentCategoryFilter = 'all';
    let searchTerm = '';
    let sortAscending = true;
    
    // ===== Initialize =====
    loadFromLocalStorage();
    displayCurrentDate();
    setupEventListeners();
    
    // ===== Event Listeners Setup =====
    function setupEventListeners() {
        // Add task
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        
        // Search
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderTasks();
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
        
        // Category pills
        document.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', function() {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                currentCategoryFilter = this.dataset.category;
                renderTasks();
            });
        });
        
        // Sort button
        sortBtn.addEventListener('click', () => {
            sortAscending = !sortAscending;
            sortBtn.innerHTML = sortAscending ? 
                '<i class="fas fa-sort-amount-down"></i>' : 
                '<i class="fas fa-sort-amount-up"></i>';
            sortTasks();
        });
        
        // Clear completed
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        taskDueDate.value = tomorrow.toISOString().split('T')[0];
    }
    
    // ===== Display Current Date =====
    function displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // ===== Add New Task =====
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            showToast('Please enter a task!', 'error');
            return;
        }
        
        // Create new task object
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            category: taskCategory.value,
            dueDate: taskDueDate.value || null,
            createdAt: new Date().toISOString(),
            priority: calculatePriority(taskDueDate.value)
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Clear input
        taskInput.value = '';
        
        // Set default due date to tomorrow again
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        taskDueDate.value = tomorrow.toISOString().split('T')[0];
        
        // Refresh display
        renderTasks();
        saveToLocalStorage();
        showToast('Task added successfully!', 'success');
        
        // Focus back on input
        taskInput.focus();
    }
    
    // ===== Calculate Priority Based on Due Date =====
    function calculatePriority(dueDate) {
        if (!dueDate) return 'normal';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'overdue';
        if (diffDays === 0) return 'today';
        if (diffDays <= 2) return 'soon';
        return 'normal';
    }
    
    // ===== Delete Task =====
    function deleteTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        
        if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
            tasks = tasks.filter(task => task.id !== taskId);
            renderTasks();
            saveToLocalStorage();
            showToast('Task deleted successfully!', 'success');
        }
    }
    
    // ===== Toggle Task Completion =====
    function toggleTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            saveToLocalStorage();
            
            if (task.completed) {
                showToast('Task completed! 🎉', 'success');
            }
        }
    }
    
    // ===== Edit Task =====
    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        const taskTextElement = taskElement.querySelector('.task-text');
        const taskMetaElement = taskElement.querySelector('.task-meta');
        
        // Create edit form
        const editForm = document.createElement('div');
        editForm.className = 'edit-form';
        editForm.innerHTML = `
            <input type="text" class="edit-input" value="${task.text}">
            <select class="edit-category">
                <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
                <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
                <option value="shopping" ${task.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                <option value="health" ${task.category === 'health' ? 'selected' : ''}>Health</option>
                <option value="other" ${task.category === 'other' ? 'selected' : ''}>Other</option>
            </select>
            <input type="date" class="edit-date" value="${task.dueDate || ''}">
            <div class="edit-actions">
                <button class="save-edit-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-edit-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Replace content with edit form
        taskTextElement.style.display = 'none';
        taskMetaElement.style.display = 'none';
        taskElement.querySelector('.task-actions').style.display = 'none';
        taskElement.insertBefore(editForm, taskElement.querySelector('.task-actions'));
        
        // Handle save
        const saveBtn = editForm.querySelector('.save-edit-btn');
        saveBtn.addEventListener('click', () => {
            const newText = editForm.querySelector('.edit-input').value.trim();
            const newCategory = editForm.querySelector('.edit-category').value;
            const newDate = editForm.querySelector('.edit-date').value;
            
            if (newText) {
                task.text = newText;
                task.category = newCategory;
                task.dueDate = newDate;
                task.priority = calculatePriority(newDate);
                
                renderTasks();
                saveToLocalStorage();
                showToast('Task updated successfully!', 'success');
            }
        });
        
        // Handle cancel
        const cancelBtn = editForm.querySelector('.cancel-edit-btn');
        cancelBtn.addEventListener('click', () => {
            renderTasks(); // Just re-render to cancel edit
        });
    }
    
    // ===== Clear Completed Tasks =====
    function clearCompletedTasks() {
        const completedCount = tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            showToast('No completed tasks to clear!', 'warning');
            return;
        }
        
        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            tasks = tasks.filter(task => !task.completed);
            renderTasks();
            saveToLocalStorage();
            showToast('Completed tasks cleared!', 'success');
        }
    }
    
    // ===== Sort Tasks =====
    function sortTasks() {
        tasks.sort((a, b) => {
            if (sortAscending) {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        renderTasks();
    }
    
    // ===== Filter and Search Tasks =====
    function getFilteredTasks() {
        return tasks.filter(task => {
            // Filter by completion status
            if (currentFilter === 'active' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;
            
            // Filter by category
            if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) return false;
            
            // Filter by search term
            if (searchTerm && !task.text.toLowerCase().includes(searchTerm)) return false;
            
            return true;
        });
    }
    
    // ===== Render All Tasks =====
    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        // Clear task list
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            // Show empty state
            emptyState.style.display = 'block';
            taskList.style.display = 'none';
        } else {
            // Hide empty state
            emptyState.style.display = 'none';
            taskList.style.display = 'block';
            
            // Render each task
            filteredTasks.forEach(task => {
                const taskItem = createTaskElement(task);
                taskList.appendChild(taskItem);
            });
        }
        
        // Update statistics
        updateStats();
    }
    
    // ===== Create Task Element =====
    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-id', task.id);
        
        // Add priority class
        const priority = calculatePriority(task.dueDate);
        if (priority === 'overdue' && !task.completed) {
            taskItem.classList.add('overdue');
        } else if (priority === 'soon' && !task.completed) {
            taskItem.classList.add('due-soon');
        }
        
        // Format due date
        let dueDateHtml = '';
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const isOverdue = priority === 'overdue' && !task.completed;
            dueDateHtml = `
                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                    <i class="far fa-calendar-alt"></i> ${dueDate}
                    ${isOverdue ? '<i class="fas fa-exclamation-circle"></i>' : ''}
                </span>
            `;
        }
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-category">
                        <i class="fas fa-tag"></i> ${task.category}
                    </span>
                    ${dueDateHtml}
                    ${task.completed ? '<span class="task-completed-badge"><i class="fas fa-check-circle"></i> Done</span>' : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        const editBtn = taskItem.querySelector('.edit-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTask(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        return taskItem;
    }
    
    // ===== Escape HTML to prevent XSS =====
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // ===== Update Statistics =====
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
        
        totalTasksFooter.textContent = total;
        completedTasksFooter.textContent = completed;
    }
    
    // ===== Save to Local Storage =====
    function saveToLocalStorage() {
        localStorage.setItem('enhancedTodoTasks', JSON.stringify(tasks));
    }
    
    // ===== Load from Local Storage =====
    function loadFromLocalStorage() {
        const savedTasks = localStorage.getItem('enhancedTodoTasks');
        
        if (savedTasks) {
            try {
                tasks = JSON.parse(savedTasks);
                renderTasks();
            } catch (error) {
                console.error('Error loading tasks:', error);
                tasks = [];
                showToast('Error loading saved tasks', 'error');
            }
        }
    }
    
    // ===== Show Toast Notification =====
    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // ===== Export/Import Tasks (Bonus Feature) =====
    window.exportTasks = function() {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('Tasks exported successfully!', 'success');
    };
    
    window.importTasks = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const importedTasks = JSON.parse(e.target.result);
                    
                    // Validate imported data
                    if (Array.isArray(importedTasks)) {
                        tasks = importedTasks;
                        renderTasks();
                        saveToLocalStorage();
                        showToast('Tasks imported successfully!', 'success');
                    } else {
                        showToast('Invalid file format!', 'error');
                    }
                } catch (error) {
                    showToast('Error importing tasks!', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    };
    
    // Add export/import buttons to footer (optional)
    const footer = document.querySelector('.footer-content');
    const exportImportBtns = document.createElement('div');
    exportImportBtns.className = 'export-import-btns';
    exportImportBtns.innerHTML = `
        <button onclick="exportTasks()" class="icon-btn" title="Export tasks">
            <i class="fas fa-download"></i>
        </button>
        <button onclick="importTasks()" class="icon-btn" title="Import tasks">
            <i class="fas fa-upload"></i>
        </button>
    `;
    footer.appendChild(exportImportBtns);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            taskInput.focus();
        }
        
        // Ctrl/Cmd + Shift + C to clear completed
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            clearCompletedTasks();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchTerm = '';
            renderTasks();
        }
    });
    
    // Initial render
    renderTasks();
});