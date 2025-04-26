document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const questionNumberElement = document.createElement('h3'); // Elemento per il numero della domanda
  const answersContainer = document.getElementById('answers');
  const submitBtn = document.getElementById('submit-btn');
  const nextBtn = document.getElementById('next-btn');
  const questionPackSelect = document.getElementById('question-pack');
  const rangeToInput = document.getElementById('range-to');

  let questions = []; // Domande pescate
  let currentQuestionIndex = 0;
  let selectedAnswer = null;

  // Limiti per ogni question pack
  const questionPackLimits = {
    "diritto_amministrativo": 431,
    "contabilita_di_stato": 200,
    "diritto_costituzionale_e_pubblico": 295,
    "diritto_penale": 291,
    "diritto_penitenziario": 334,
    "elementi_di_procedura_penale": 240,
    "scienze_dell_organizzazione": 202,
  };

  // Aggiungi il numero della domanda sopra il testo della domanda
  quizContainer.insertBefore(questionNumberElement, questionElement);

  // Aggiorna il limite massimo del campo "To" in base al question pack selezionato
  questionPackSelect.addEventListener('change', () => {
    const selectedPack = questionPackSelect.value;
    const maxQuestions = questionPackLimits[selectedPack];
    rangeToInput.max = maxQuestions;
    rangeToInput.placeholder = `Max: ${maxQuestions}`;
  });

  startBtn.addEventListener('click', () => {
    const rangeFrom = parseInt(document.getElementById('range-from').value, 10);
    const rangeTo = parseInt(rangeToInput.value, 10);
    const selectedPack = questionPackSelect.value;

    if (!selectedPack) {
      alert('Seleziona un question pack.');
      return;
    }

    if (rangeFrom && rangeTo && rangeFrom <= rangeTo) {
      const filePath = `./data/${selectedPack}.json`;
      loadQuestions(filePath, rangeFrom, rangeTo);
    } else {
      alert('Seleziona un intervallo valido.');
    }
  });

  submitBtn.addEventListener('click', () => {
    if (!selectedAnswer) {
      alert('Seleziona una risposta prima di continuare.');
      return;
    }

    // Mostra se la risposta è corretta o sbagliata
    const buttons = answersContainer.querySelectorAll('button');
    buttons.forEach((button) => {
      const isCorrect = button.dataset.correct === 'true';
      button.classList.remove('selected'); // Rimuovi la classe "selected"
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

  function loadQuestions(filePath, from, to) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore nel caricamento del file: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // Filtra le domande in base al range
        questions = data
          .filter((question) => question.number >= from && question.number <= to) // Filtra per range
          .map((question) => ({
            ...question,
            answers: shuffle(question.answers), // Mescola le risposte
          }));

        // Mescola le domande
        questions = shuffle(questions);

        if (questions.length === 0) {
          alert('Nessuna domanda trovata nell\'intervallo specificato.');
          return;
        }

        currentQuestionIndex = 0;
        quizContainer.style.display = 'block';
        displayQuestion();
      })
      .catch((error) => {
        console.error('Errore nel caricamento delle domande:', error);
        alert('Errore nel caricamento delle domande. Controlla la console per maggiori dettagli.');
      });
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionNumberElement.textContent = `Domanda n. ${question.number}`; // Mostra il numero della domanda
    questionElement.textContent = question.text;
    answersContainer.innerHTML = '';
    selectedAnswer = null;

    // Mostra le risposte
    question.answers.forEach((answer) => {
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

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
});