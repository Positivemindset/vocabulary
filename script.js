document.addEventListener('DOMContentLoaded', function () {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextButton = document.getElementById('next');
    const finishButton = document.getElementById('finish');
    const resultsElement = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const progressBarElement = document.getElementById('progress-bar');
    const quizContainer = document.getElementById('quiz-container');
    const selectionContainer = document.getElementById('selection-container');
    const homeButton = document.getElementById('home');
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questions = [];
    let hasAnswered = false;
    const maxQuestions = 30;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadQuestionsFromFile(file) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                questions = data.slice(0, maxQuestions);
                shuffleArray(questions);
                questions.forEach(q => q.selectedOption = null);
                quizContainer.style.display = 'block';
                selectionContainer.style.display = 'none';
                loadQuestion();
            })
            .catch(error => {
                console.error('Error fetching the questions:', error);
            });
    }

    function loadQuestion() {
        hasAnswered = false;
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsElement.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const optionContainer = document.createElement('li');
                optionContainer.className = 'option-container';
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'option';
                radioInput.id = 'option' + index;
                radioInput.value = option;
                const label = document.createElement('label');
                label.htmlFor = 'option' + index;
                label.textContent = option;
                optionContainer.appendChild(radioInput);
                optionContainer.appendChild(label);
                optionsElement.appendChild(optionContainer);
            });
            nextButton.style.display = 'block';
            if (currentQuestionIndex === questions.length - 1) {
                nextButton.disabled = true;
                nextButton.style.backgroundColor = '#cccccc';
            } else {
                nextButton.disabled = false;
                nextButton.style.backgroundColor = '';
            }
        } else {
            displayResults();
        }
    }

    function selectOption(event) {
        if (!event.target.matches('input[type="radio"]') || hasAnswered) return;
        const selectedRadio = event.target;
        const selectedOption = event.target.value;
        const correctOption = questions[currentQuestionIndex].answer;
        hasAnswered = true;
        if (selectedOption === correctOption) {
            correctAnswers++;
            selectedRadio.parentElement.classList.add('correct');
        } else {
            selectedRadio.parentElement.classList.add('incorrect');
        }
        if (currentQuestionIndex < questions.length - 1) {
            nextButton.style.display = 'block';
        } else {
            nextButton.style.display = 'none';
            finishButton.style.display = 'block';
        }
        questions[currentQuestionIndex].selectedOption = selectedOption;
    }

    function displayResults() {
        questionElement.style.display = 'none';
        optionsElement.style.display = 'none';
        nextButton.style.display = 'none';
        finishButton.style.display = 'none';
        const totalQuestions = questions.length;
        const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
        scoreElement.textContent = `You scored ${scorePercent}%!`;
        progressBarElement.style.width = `${scorePercent}%`;
        resultsElement.style.display = 'block';
        homeButton.style.display = 'block';
    }

    document.getElementById('synonyms').addEventListener('click', () => {
        loadQuestionsFromFile('synonyms.json');
    });

    document.getElementById('antonyms').addEventListener('click', () => {
        loadQuestionsFromFile('antonyms.json');
    });

    optionsElement.addEventListener('click', selectOption);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) loadQuestion();
    });
    finishButton.addEventListener('click', displayResults);

   homeButton.addEventListener('click', function() {
    quizContainer.style.display = 'none';
    resultsElement.style.display = 'none';
    selectionContainer.style.display = 'block';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    questions = [];
    hasAnswered = false; // Reset the flag for answered state

    // Reset UI elements to their initial states
    questionElement.style.display = 'block'; // Make the question element visible
    optionsElement.innerHTML = ''; // Clear any options
    nextButton.style.display = 'none'; // Hide the next button initially
    nextButton.disabled = false; // Enable the next button
    nextButton.style.backgroundColor = ''; // Reset the next button's background color
    finishButton.style.display = 'none'; // Hide the finish button initially
    scoreElement.textContent = ''; // Clear the score text
    progressBarElement.style.width = '0%'; // Reset the progress bar
    });
});
