const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswers = false ;
let score = 0 ;
let questioncCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });


        startGame();
    })
    .catch((err) => {
        console.error(err);
    });


// constants 
const CORRECT_BOUNUS = 10;
const  MAX_QUESTION = 3;

startGame = () => {
    questioncCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

        if(availableQuestions.length ==0 || questioncCounter >= MAX_QUESTION){
            localStorage.setItem('mostRecentScore', score);
            // go to end page 
            return window.location.assign('/end');
        }
    questioncCounter++;
    progressText.innerText = `Question ${questioncCounter}/${MAX_QUESTION}`;
    
    // UPGRADE PROGRESS BAR 
    progressBarFull.style.width = `${(questioncCounter/MAX_QUESTION) *100}%`; 

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex]; 
        question.innerHTML = currentQuestion.question;

        choices.forEach( choice => {
             const number = choice.dataset['number'];
             choice.innerHTML = currentQuestion['choice' + number]; 
        });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e=> {
        if(!acceptingAnswers) return ;

        acceptingAnswers = false;
        const selectedChoice  = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

       /* const classToApply = 'incorrect';
            if(selectedAnswer == currentQuestion.answer)
            {
                classToApply = 'correct' ;
            }
            */

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct'
        : 'incorrect';

        if(classToApply === "correct") 
        {
            incrementScore(CORRECT_BOUNUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( ()=> {
            getNewQuestion();
            selectedChoice.parentElement.classList.remove(classToApply);
        }, 1000);
        
    });
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
};

