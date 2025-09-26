// Initialize quotes array from localStorage or empty array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// DOM elements
const quoteForm = document.getElementById('quoteForm');
const quotesBody = document.getElementById('quotesBody');
const quoteInput = document.getElementById('quoteText');
const authorInput = document.getElementById('author');
const quoteIdInput = document.getElementById('quoteId');

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
            <td>
                <button class="edit-btn" onclick="editQuote(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteQuote(${index})">Delete</button>
            </td>
        `;
        quotesBody.appendChild(row);
    });
}

// Add or update quote
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const quoteText = quoteInput.value.trim();
    const author = authorInput.value.trim();
    const quoteId = quoteIdInput.value;

    if (quoteText) {
        if (quoteId === '') {
            // Add new quote
            quotes.push({ text: quoteText, author: author });
        } else {
            // Update existing quote
            quotes[quoteId] = { text: quoteText, author: author };
        }
        saveQuotes();
        renderTable();
        quoteForm.reset();
        quoteIdInput.value = '';
        quoteForm.querySelector('button').textContent = 'Add Quote';
    }
});

// Edit quote
function editQuote(index) {
    quoteInput.value = quotes[index].text;
    authorInput.value = quotes[index].author || '';
    quoteIdInput.value = index;
    quoteForm.querySelector('button').textContent = 'Update Quote';
}

// Delete quote
function deleteQuote(index) {
    if (confirm('Are you sure you want to delete this quote?')) {
        quotes.splice(index, 1);
        saveQuotes();
        renderTable();
    }
}

// Initial render
renderTable();
