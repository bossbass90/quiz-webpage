
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const questionNumberElement = document.createElement('h3'); // Elemento per il numero della domanda
  const answersContainer = document.getElementById('answers');
  const submitBtn = document.getElementById('submit-btn');
  const nextBtn = document.getElementById('next-btn');

  let questions = []; // Domande pescate
  let currentQuestionIndex = 0;
  let selectedAnswer = null;

  // Aggiungi il numero della domanda sopra il testo della domanda
  quizContainer.insertBefore(questionNumberElement, questionElement);

  startBtn.addEventListener('click', () => {
    const rangeFrom = parseInt(document.getElementById('range-from').value, 10);
    const rangeTo = parseInt(document.getElementById('range-to').value, 10);

    if (rangeFrom && rangeTo) {
      loadQuestions('./data/diritto_amministrativo.xlsx', rangeFrom, rangeTo);
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
        return response.arrayBuffer();
      })
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Filtra le domande in base al range
        questions = rows
          .slice(1) // Salta l'intestazione
          .filter((row) => row[0] >= from && row[0] <= to) // Filtra per range
          .map((row) => ({
            number: row[0], // Colonna A: Numero della domanda
            text: row[1], // Colonna B: Testo della domanda
            answers: shuffle([
              { text: row[2], correct: true }, // Colonna C: Risposta corretta
              { text: row[3], correct: false }, // Colonna D: Risposta sbagliata 1
              { text: row[4], correct: false }, // Colonna E: Risposta sbagliata 2
              { text: row[5], correct: false }, // Colonna F: Risposta sbagliata 3
            ]),
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