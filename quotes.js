// Initialize quotes array from localStorage or empty array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const editPassword = "editQuote123"; // Change this to your desired edit password
let editIndex = null;

// DOM elements
const quoteForm = document.getElementById('quoteForm');
const quotesBody = document.getElementById('quotesBody');
const quoteInput = document.getElementById('quoteText');
const authorInput = document.getElementById('author');
const visitorInput = document.getElementById('visitor');
const quoteIdInput = document.getElementById('quoteId');
const editPasswordPrompt = document.getElementById('editPasswordPrompt');
const editPasswordInput = document.getElementById('editPasswordInput');

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to render the table
function renderTable() {
    quotesBody.innerHTML = ''; // Clear table
    quotes.forEach((quote, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.text}</td>
            <td>${quote.author || 'Unknown'}</td>
            <td>${quote.visitor}<button class="edit-btn" onclick="promptEdit(${index})">Edit</button></td>
        `;
        quotesBody.appendChild(row);
    });
}

// Add or update quote
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const quoteText = quoteInput.value.trim();
    const author = authorInput.value.trim();
    const visitor = visitorInput.value.trim();
    const quoteId = quoteIdInput.value;

    if (quoteText && visitor) {
        if (quoteId === '') {
            // Add new quote
            quotes.push({ text: quoteText, author: author, visitor: visitor });
        } else {
            // Update existing quote
            quotes[quoteId] = { text: quoteText, author: author, visitor: visitor };
        }
        saveQuotes();
        renderTable();
        quoteForm.reset();
        quoteIdInput.value = '';
        quoteForm.querySelector('button').textContent = 'Add Quote';
    } else {
        alert('Quote and Visitor are required!');
    }
});

// Prompt for password before editing
function promptEdit(index) {
    editIndex = index;
    editPasswordPrompt.style.display = 'block';
    quoteForm.style.display = 'none';
    editPasswordInput.value = '';
    editPasswordInput.focus();
}

// Verify edit password
function verifyEditPassword() {
    if (editPasswordInput.value === editPassword) {
        editPasswordPrompt.style.display = 'none';
        quoteForm.style.display = 'flex';
        editQuote(editIndex);
    } else {
        alert('Incorrect password!');
    }
}

// Cancel edit
function cancelEdit() {
    editPasswordPrompt.style.display = 'none';
    quoteForm.style.display = 'flex';
    quoteForm.reset();
    quoteIdInput.value = '';
    quoteForm.querySelector('button').textContent = 'Add Quote';
}

// Edit quote
function editQuote(index) {
    const quote = quotes[index];
    quoteInput.value = quote.text;
    authorInput.value = quote.author || '';
    visitorInput.value = quote.visitor;
    quoteIdInput.value = index;
    quoteForm.querySelector('button').textContent = 'Update Quote';
}

// Handle Enter key for password input
editPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyEditPassword();
});

// Initial render
renderTable();
