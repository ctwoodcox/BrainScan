const startBtn = document.getElementById('start-button');
const question = document.getElementById('question');
const answerChoice = document.querySelector('.quiz-options');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const result = document.getElementById('result');
const totalScore = document.getElementById('correct-score');
const questionTotal = document.getElementById('total-question');
const quizContainer = document.getElementById('quiz-container');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 20;

startBtn.addEventListener('click', startQuiz);

// load questions from API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=20&type=multiple';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    result.innerHTML = "";
    showQuestion(data.results[0]);
}

// event listeners
function eventListeners(){
    checkBtn.addEventListener('click', checkAnswer);
    playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    questionTotal.textContent = totalQuestion;
    totalScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    
    
    question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    answerChoice.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// Question selection
function selectOption(){
    answerChoice.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(answerChoice.querySelector('.selected')){
                const activeOption = answerChoice.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Answer checking
function checkAnswer(){
    checkBtn.disabled = true;
    if(answerChoice.querySelector('.selected')){
        let selectedAnswer = answerChoice.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        checkBtn.disabled = false;
    }
}

// To convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// Final score
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);


        result.innerHTML += `<p>Your score was ${correctScore}.</p>`;
        playAgainBtn.style.display = "block";
        checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

// Score Counter
function setCount(){
    questionTotal.textContent = totalQuestion;
    totalScore.textContent = correctScore;
}

// Start Screen
function startQuiz() {
    startBtn.classList.add('hide');
    quizContainer.classList.remove('hide');
};

// Reset Quiz
function restartQuiz(){
    correctScore = askedCount = 0;
    playAgainBtn.style.display = "none";
    checkBtn.style.display = "block";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
}