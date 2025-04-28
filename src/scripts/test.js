document.addEventListener('DOMContentLoaded', () => {
  const timerElement = document.getElementById('timer');
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const sourceElement = document.getElementById('source');
  const answersContainer = document.getElementById('answers');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const answeredCounter = document.getElementById('answered-counter'); // Counter delle domande risposte

  let questions = []; // Tutte le domande
  let currentQuestionIndex = 0;
  let userAnswers = {}; // Risposte dell'utente
  let timer; // Timer per il countdown

  // File JSON e numero di domande da recuperare
  const questionPacks = [
    { file: 'diritto_amministrativo', count: 17 },
    { file: 'contabilita_di_stato', count: 8 },
    { file: 'diritto_costituzionale_e_pubblico', count: 12 },
    { file: 'diritto_penale', count: 12 },
    { file: 'diritto_penitenziario', count: 13 },
    { file: 'elementi_di_procedura_penale', count: 10 },
    { file: 'scienze_dell_organizzazione', count: 8 },
  ];

  // Carica tutte le domande dai file JSON
  async function loadQuestions() {
    for (const pack of questionPacks) {
      const response = await fetch(`./data/${pack.file}.json`);
      const data = await response.json();
      const shuffled = shuffle(data).slice(0, pack.count); // Recupera domande casuali
      shuffled.forEach((question) => {
        questions.push({ ...question, source: pack.file }); // Aggiungi il nome del file
      });
    }
    questions = shuffle(questions); // Mescola tutte le domande
    displayQuestion();
    startTimer(60 * 60); // Avvia il timer (60 minuti)
    updateAnsweredCounter(); // Inizializza il counter
  }

  // Mostra la domanda corrente
  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    sourceElement.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length} (Source: ${question.source}, Original Number: ${question.number})`;
    questionElement.textContent = question.text;
    answersContainer.innerHTML = '';

    // Mescola le risposte
    const shuffledAnswers = shuffle(question.answers);

    shuffledAnswers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('answer-btn');
      button.onclick = () => {
        if (!userAnswers[currentQuestionIndex]) {
          userAnswers[currentQuestionIndex] = index; // Salva la risposta dell'utente
          updateAnsweredCounter(); // Aggiorna il contatore
        }
        answersContainer.querySelectorAll('button').forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected'); // Evidenzia la risposta selezionata
      };
      answersContainer.appendChild(button);
    });

    updateNavigationButtons();
  }

  // Aggiorna i pulsanti di navigazione
  function updateNavigationButtons() {
    prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    nextBtn.textContent = currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish';
  }

  // Aggiorna il contatore delle domande risposte
  function updateAnsweredCounter() {
    const answeredCount = Object.keys(userAnswers).length;
    answeredCounter.textContent = `Answered: ${answeredCount} / ${questions.length}`;
  }

  // Timer per il countdown
  function startTimer(duration) {
    let timeRemaining = duration;
    timer = setInterval(() => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        finishTest();
      }
      timeRemaining--;
    }, 1000);
  }

  // Termina il test e mostra il report
  function finishTest() {
    clearInterval(timer);
    localStorage.setItem('testResults', JSON.stringify({ questions, userAnswers }));
    location.href = 'report.html'; // Redirect alla pagina di report
  }

  // Eventi per i pulsanti di navigazione
  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      finishTest();
    }
  });

  // Mescola un array
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Carica le domande all'avvio
  loadQuestions();
});