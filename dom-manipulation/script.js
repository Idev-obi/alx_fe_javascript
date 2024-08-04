// Array to hold quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Load quotes on page load
document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
    populateCategoryFilter();
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
    document.getElementById('categoryFilter').value = lastFilter;
    filterQuotes();
});

// Display a random quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').textContent = 'No quotes available.';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category.');
        return;
    }
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    displayRandomQuote();
    populateCategoryFilter();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category filter
function populateCategoryFilter() {
    const categories = new Set(quotes.map(q => q.category));
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        filter.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    const filteredQuotes = quotes.filter(q => selectedCategory === 'all' || q.category === selectedCategory);
    const randomQuote = filteredQuotes.length > 0 ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] : { text: 'No quotes available.', category: '' };
    document.getElementById('quoteDisplay').textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Export quotes to JSON
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotes();
                populateCategoryFilter();
                filterQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format.');
            }
        } catch (error) {
            alert('Error reading JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulate fetching quotes from a server
function fetchQuotesFromServer() {
    // This URL should be replaced with your actual server URL
    return fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Simulate server quotes response
            return data.map(d => ({ text: d.title, category: 'General' }));
        });
}

// Sync with the server
function syncWithServer() {
    fetchQuotesFromServer().then(serverQuotes => {
        // Resolve conflicts: replace local quotes with server quotes
        quotes = serverQuotes;
        saveQuotes();
        populateCategoryFilter();
        filterQuotes();
        alert('Quotes synced with server!');
    }).catch(() => {
        alert('Error syncing with server.');
    });
}

// Call syncWithServer periodically or on a button click

