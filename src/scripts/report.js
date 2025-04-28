document.addEventListener('DOMContentLoaded', () => {
  const reportContainer = document.getElementById('report-container');
  const { questions, userAnswers } = JSON.parse(localStorage.getItem('testResults'));

  questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-report');
    questionDiv.style.marginBottom = '20px'; // Spazio tra le domande

    const questionText = document.createElement('h3');
    questionText.textContent = `Source: ${question.source}, Question n. ${question.number}: ${question.text}`;
    questionDiv.appendChild(questionText);

    const answersList = document.createElement('ul');
    answersList.style.listStyleType = 'none'; // Rimuovi i puntini
    answersList.style.padding = '0';

    question.answers.forEach((answer, i) => {
      const answerItem = document.createElement('li');
      answerItem.textContent = answer.text;
      answerItem.style.marginBottom = '5px'; // Spazio tra le risposte
      answerItem.style.padding = '5px';
      answerItem.style.border = '1px solid #ccc';
      answerItem.style.borderRadius = '5px';

      // Evidenzia la risposta corretta in verde
      if (answer.correct) {
        answerItem.style.backgroundColor = '#4caf50';
        answerItem.style.color = 'white';
        answerItem.style.fontWeight = 'bold';
      }

      // Evidenzia la risposta sbagliata selezionata in rosso
      if (i === userAnswers[index] && !answer.correct) {
        answerItem.style.backgroundColor = '#f44336';
        answerItem.style.color = 'white';
      }

      answersList.appendChild(answerItem);
    });

    questionDiv.appendChild(answersList);
    reportContainer.appendChild(questionDiv);
  });
});