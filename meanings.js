document.addEventListener('DOMContentLoaded', function () {
    // Fetch questions.json only
    fetch('questions.json').then(response => response.json())
    .then((questionsData) => {
        // No need to combine since we're using only one source
        displayMeanings(questionsData); // Display all meanings initially
        document.getElementById('search-input').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // Filter based on the search term
            const filteredData = questionsData.filter(item => item.word.toLowerCase().includes(searchTerm));
            displayMeanings(filteredData); // Display filtered meanings
        });
    })
    .catch(error => console.error('Error loading data:', error));
});

function displayMeanings(data) {
    const listElement = document.getElementById('meanings-list');
    listElement.innerHTML = ''; // Clear the list before displaying filtered results
    data.forEach(item => {
        // Constructing the list item with word, explanation, synonyms, and antonyms
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.word}</strong>: ${item.explanation}<br/>Synonyms: ${item.synonyms.join(', ')}<br/>Antonyms: ${item.antonyms.join(', ')}`;
        listElement.appendChild(li);
    });
}
