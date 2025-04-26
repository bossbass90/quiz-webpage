document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');
  const submitBtn = document.getElementById('submit-btn');
  const nextBtn = document.getElementById('next-btn');

  let questions = []; // Domande pescate
  let currentQuestionIndex = 0;
  let selectedAnswer = null;

  startBtn.addEventListener('click', () => {
    const pack = document.getElementById('question-pack').value;
    const rangeFrom = parseInt(document.getElementById('range-from').value, 10);
    const rangeTo = parseInt(document.getElementById('range-to').value, 10);

    if (pack === 'diritto-amministrativo' && rangeFrom && rangeTo) {
      loadQuestions(pack, rangeFrom, rangeTo);
    } else {
      alert('Seleziona un pacchetto di domande valido e un intervallo.');
    }
  });

  submitBtn.addEventListener('click', () => {
    if (!selectedAnswer) {
      alert('Seleziona una risposta prima di continuare.');
      return;
    }
  
    // Rimuovi la classe "selected" da tutti i pulsanti
    const buttons = answersContainer.querySelectorAll('button');
    buttons.forEach((button) => {
      button.classList.remove('selected');
    });
  
    // Mostra se la risposta è corretta o sbagliata
    buttons.forEach((button) => {
      const isCorrect = button.dataset.correct === 'true';
      if (isCorrect) {
        button.classList.add('correct'); // Evidenzia la risposta corretta in verde
      } 
      if (button === selectedAnswer && !isCorrect) {
        button.classList.add('wrong'); // Evidenzia la risposta sbagliata in rosso
      }
      button.disabled = true; // Disabilita tutti i pulsanti dopo la selezione
    });
  
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      alert('Quiz completato!');
      quizContainer.style.display = 'none';
    }
  });

  const questionsData = {
    "diritto-amministrativo": [
      {
        text: "Qual è il principio di legalità nel diritto amministrativo?",
        answers: [
          { text: "Garantisce che l'amministrazione agisca entro i limiti della legge.", correct: true },
          { text: "Permette all'amministrazione di agire liberamente.", correct: false },
          { text: "Limita l'amministrazione al diritto privato.", correct: false },
          { text: "Abolisce i tribunali amministrativi.", correct: false },
        ],
      },
      {
        text: "Qual è il ruolo del TAR (Tribunale Amministrativo Regionale)?",
        answers: [
          { text: "Risolvere le controversie tra cittadini e amministrazione pubblica.", correct: true },
          { text: "Legiferare sulle leggi amministrative.", correct: false },
          { text: "Applicare il diritto penale.", correct: false },
          { text: "Gestire le finanze pubbliche.", correct: false },
        ],
      },
    ],
  };

  function loadQuestions(pack, from, to) {
    if (pack === 'diritto-amministrativo') {
      const allQuestions = questionsData[pack];
      if (!allQuestions) {
        alert('Nessuna domanda disponibile per il pacchetto selezionato.');
        return;
      }

      // Pesca le domande in ordine casuale
      questions = allQuestions.slice(from - 1, to).sort(() => Math.random() - 0.5);
      if (questions.length === 0) {
        alert('Nessuna domanda trovata nell\'intervallo specificato.');
        return;
      }

      currentQuestionIndex = 0;
      quizContainer.style.display = 'block';
      displayQuestion();
    } else {
      alert('Il pacchetto di domande selezionato non è ancora disponibile.');
    }
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.text;
    answersContainer.innerHTML = '';
    selectedAnswer = null;
  
    // Mescola le risposte
    const shuffledAnswers = question.answers.sort(() => Math.random() - 0.5);
    shuffledAnswers.forEach((answer) => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.dataset.correct = answer.correct;
  
      // Aggiungi evento per selezionare la risposta
      button.onclick = () => {
        selectedAnswer = button;
  
        // Rimuovi la classe "selected" da tutti i pulsanti
        answersContainer.querySelectorAll('button').forEach((btn) => {
          btn.classList.remove('selected');
        });
  
        // Aggiungi la classe "selected" al pulsante cliccato
        button.classList.add('selected');
      };
  
      answersContainer.appendChild(button);
    });
  
    submitBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
  }
});