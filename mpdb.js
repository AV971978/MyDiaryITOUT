// Password protection
const correctPassword = "mySecurePassword123"; // Change this to your desired password

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    if (input === correctPassword) {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        updateFormAndTable(); // Initialize form and table
    } else {
        alert('Incorrect password!');
    }
}

// Database configurations
const dbConfigs = {
    book: {
        fields: [
            { id: 'title', label: 'Title', type: 'text', required: true },
            { id: 'author', label: 'Author', type: 'text' },
            { id: 'publisher', label: 'Publisher', type: 'text' },
            { id: 'isbn', label: 'ISBN', type: 'text' },
            { id: 'contact', label: 'Contact', type: 'text' }
        ],
        storageKey: 'bookData'
    },
    movie: {
        fields: [
            { id: 'title', label: 'Title', type: 'text', required: true },
            { id: 'producer', label: 'Producer', type: 'text' },
            { id: 'director', label: 'Director', type: 'text' },
            { id: 'story', label: 'Story', type: 'text' }
        ],
        storageKey: 'movieData'
    },
    software: {
        fields: [
            { id: 'name', label: 'Name', type: 'text', required: true },
            { id: 'subject', label: 'Subject', type: 'text' },
            { id: 'os', label: 'OS', type: 'text' }
        ],
        storageKey: 'softwareData'
    },
    grocery: {
        fields: [
            { id: 'name', label: 'Name', type: 'text', required: true },
            { id: 'category', label: 'Category', type: 'text' },
            { id: 'price', label: 'Price', type: 'number' },
            { id: 'quantity', label: 'Quantity', type: 'number' }
        ],
        storageKey: 'groceryData'
    }
};

// DOM elements
const dbSelect = document.getElementById('dbSelect');
const dataForm = document.getElementById('dataForm');
const tableHead = document.getElementById('tableHead');
const dataBody = document.getElementById('dataBody');
const dataIdInput = document.getElementById('dataId');
let currentData = [];
let currentDb = 'book';

// Load data from localStorage
function loadData(dbType) {
    currentData = JSON.parse(localStorage.getItem(dbConfigs[dbType].storageKey)) || [];
}

// Save data to localStorage
function saveData(dbType) {
    localStorage.setItem(dbConfigs[dbType].storageKey, JSON.stringify(currentData));
}

// Render form based on selected database
function renderForm(dbType) {
    dataForm.innerHTML = '<input type="hidden" id="dataId" value="">';
    dbConfigs[dbType].fields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = `${field.label}:`;
        const input = document.createElement('input');
        input.id = field.id;
        input.type = field.type;
        if (field.required) input.required = true;
        dataForm.appendChild(label);
        dataForm.appendChild(input);
    });
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Entry';
    dataForm.appendChild(submitButton);
    dataForm.style.display = 'block';
}

// Render table headers and data
function renderTable(dbType) {
    // Headers
    tableHead.innerHTML = '<tr>' + dbConfigs[dbType].fields.map(field => `<th>${field.label}</th>`).join('') + '<th>Actions</th></tr>';
    // Data
    dataBody.innerHTML = '';
    currentData.forEach((item, index) => {
        const row = document.createElement('tr');
        const cells = dbConfigs[dbType].fields.map(field => `<td>${item[field.id] || ''}</td>`).join('');
        row.innerHTML = `${cells}<td><button class="edit-btn" onclick="editEntry(${index})">Edit</button><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>`;
        dataBody.appendChild(row);
    });
}

// Update form and table based on dropdown selection
function updateFormAndTable() {
    currentDb = dbSelect.value;
    loadData(currentDb);
    renderForm(currentDb);
    renderTable(currentDb);
}

// Form submission
dataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {};
    let isValid = true;
    dbConfigs[currentDb].fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (field.required && !input.value.trim()) {
            isValid = false;
            return;
        }
        data[field.id] = input.value.trim();
    });
    if (!isValid) {
        alert('Please fill all required fields!');
        return;
    }
    const dataId = dataIdInput.value;
    if (dataId === '') {
        // Add new entry
        currentData.push(data);
    } else {
        // Update existing entry
        currentData[dataId] = data;
    }
    saveData(currentDb);
    renderTable(currentDb);
    dataForm.reset();
    dataIdInput.value = '';
    dataForm.querySelector('button').textContent = 'Add Entry';
});

// Edit entry
function editEntry(index) {
    const item = currentData[index];
    dbConfigs[currentDb].fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.value = item[field.id] || '';
    });
    dataIdInput.value = index;
    dataForm.querySelector('button').textContent = 'Update Entry';
}

// Delete entry
function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        currentData.splice(index, 1);
        saveData(currentDb);
        renderTable(currentDb);
    }
}

// Initial setup
document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});
