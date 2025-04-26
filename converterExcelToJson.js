const xlsx = require('xlsx');
const fs = require('fs');

// Percorso del file Excel
const filePath = './data/diritto_amministrativo.xlsx';

// Leggi il file Excel
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Usa il primo foglio
const sheet = workbook.Sheets[sheetName];

// Converte i dati del foglio in un array di oggetti
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Genera un array di domande
const questions = rows.slice(1).map((row) => ({
  number: row[0], // Colonna A: Numero della domanda
  text: row[1],   // Colonna B: Testo della domanda
  answers: [
    { text: row[2], correct: true },  // Colonna C: Risposta corretta
    { text: row[3], correct: false }, // Colonna D: Risposta sbagliata 1
    { text: row[4], correct: false }, // Colonna E: Risposta sbagliata 2
    { text: row[5], correct: false }, // Colonna F: Risposta sbagliata 3
  ],
}));

// Scrivi il file JSON
fs.writeFileSync('./data/diritto_amministrativo.json', JSON.stringify(questions, null, 2));
console.log('File JSON generato con successo!');