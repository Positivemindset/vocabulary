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
    const maxQuestions = 3; // Set this to the desired number of questions

    quizContainer.style.display = 'none';
    selectionContainer.style.display = 'block'; // Make sure this is visible

    document.getElementById('start-quiz').addEventListener('click', function() {
        selectionContainer.style.display = 'none'; // Hide the start button
        quizContainer.style.display = 'block'; // Show the quiz
        loadQuestions(); // Start loading questions
    });
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data.slice(0, maxQuestions);
                questions.forEach(question => {
                    // Randomly decide to ask for synonym or antonym
                    question.askFor = Math.random() < 0.5 ? 'synonym' : 'antonym';
                });
                shuffleArray(questions);
                loadQuestion();
            })
            .catch(error => {
                console.error('Error fetching the questions:', error);
            });
    }

 
          
    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            hasAnswered = false;
            // Ensure there's at least one synonym or antonym before proceeding
              // Ensure the question has both synonyms and antonyms
              if (currentQuestion.synonyms.length > 0 && currentQuestion.antonyms.length > 0) {
                const askFor = Math.random() < 0.5 ? 'synonyms' : 'antonyms'; // Choose between synonyms and antonyms
                const correctAnswer = currentQuestion[askFor][0]; // Safely access the first item
    
                // Logic for displaying the question and options continues here...
           
                // Randomly pick other words from the list as wrong answers
                const wrongAnswers = questions
                    .map(q => q.word) // Get all words
                    .filter(word => word !== currentQuestion.word) // Remove the current word
                    .sort(() => 0.5 - Math.random()) // Shuffle the array
                    .slice(0, 3); // Get three wrong answers
    
                // Combine correct and wrong answers and shuffle
                const options = [correctAnswer, ...wrongAnswers];
                shuffleArray(options); // Shuffle in place
    
                questionElement.textContent = `What is a ${currentQuestion.askFor} of '${currentQuestion.word}'?`;
                optionsElement.innerHTML = '';
                options.forEach((option, index) => {
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
                console.log("Current Question:", currentQuestion);
                console.log("Options:", options);
                nextButton.style.display = 'block';
                finishButton.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
            } else {
                console.error('No synonyms or antonyms defined for', currentQuestion.word);
                // Handle the error appropriately or move to the next question
            }
        } else {
            displayResults();
        }
    }
    

    function selectOption(event) {
        if (!event.target.matches('input[type="radio"]') || hasAnswered) return;
        const selectedRadio = event.target;
        const selectedOption = selectedRadio.value;
        const currentQuestion = questions[currentQuestionIndex];
        // Determine the correct answer based on the question type (synonym or antonym)
        const correctAnswer = currentQuestion.askFor === 'synonyms' ? currentQuestion.synonyms[0] : currentQuestion.antonyms[0];
    
        hasAnswered = true;
        // Record the user's answer for later display in the results
        currentQuestion.userAnswer = selectedOption;
    
        if (selectedOption === correctAnswer) {
            correctAnswers++;
            selectedRadio.parentElement.classList.add('correct');
        } else {
            selectedRadio.parentElement.classList.add('incorrect');
        }
    
        // Disable the next button if this is the last question or enable it otherwise
        if (currentQuestionIndex < questions.length - 1) {
            nextButton.disabled = false;
            nextButton.style.display = 'block';
        } else {
            nextButton.style.display = 'none';
            finishButton.style.display = 'block';
        }
    }
    
    function displayResults() {
        // Hide quiz UI elements
        questionElement.style.display = 'none';
        optionsElement.style.display = 'none';
        nextButton.style.display = 'none';
        finishButton.style.display = 'none';
    
        // Calculate and display the score
        const totalQuestions = questions.length;
        const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
        scoreElement.textContent = `You scored ${scorePercent}%!`;
        progressBarElement.style.width = `${scorePercent}%`;
    
        // Display the results container and home button
        resultsElement.style.display = 'block';
        homeButton.style.display = 'block';
    
        // Create and append the results table
        const resultsTable = document.createElement('table');
        resultsTable.innerHTML = '<tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Result</th></tr>';
        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            const questionCell = document.createElement('td');
            const yourAnswerCell = document.createElement('td');
            const correctAnswerCell = document.createElement('td');
            const resultCell = document.createElement('td');
    
            questionCell.textContent = question.word;
            yourAnswerCell.textContent = question.userAnswer || 'No answer';
            correctAnswerCell.textContent = question.correctAnswer;
            resultCell.textContent = question.userAnswer === question.correctAnswer ? 'Correct' : 'Incorrect';
    
            row.appendChild(questionCell);
            row.appendChild(yourAnswerCell);
            row.appendChild(correctAnswerCell);
            row.appendChild(resultCell);
            resultsTable.appendChild(row);
        });
        resultsElement.appendChild(resultsTable);
    }
    

    // Add event listeners for the radio buttons
    optionsElement.addEventListener('change', selectOption);

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        }
    });

    finishButton.addEventListener('click', displayResults);

    homeButton.addEventListener('click', function() {
        // Reset quiz to initial state
        currentQuestionIndex = 0;
        correctAnswers = 0;
        questions = [];
        hasAnswered = false;
        //loadQuestions(); // Reload the questions

        // Reset UI
        resultsElement.style.display = 'none';
        quizContainer.style.display = 'none';
        selectionContainer.style.display = 'block';
        scoreElement.textContent = '';
        progressBarElement.style.width = '0%';
    });

    // Initial call to load questions
   // loadQuestions();
});
