const welcomeScreen = document.querySelector('#welcome-screen');

if (welcomeScreen) {
  const welcomeStatus = document.querySelector('#welcome-status');
  const replayWelcomeButton = document.querySelector('#welcome-replay');
  const skipWelcomeButton = document.querySelector('#welcome-skip');
  let welcomeClosed = false;

  const closeWelcome = () => {
    if (welcomeClosed) return;

    welcomeClosed = true;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    welcomeScreen.classList.add('is-closing');
    document.body.classList.remove('welcome-active');
    window.setTimeout(() => welcomeScreen.remove(), 350);
  };

  const speakWelcome = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      welcomeStatus.textContent = 'Este navegador no ofrece voz automática. Puedes continuar cuando quieras.';
      return;
    }

    window.speechSynthesis.cancel();
    const welcomeSpeech = new SpeechSynthesisUtterance(
      '¡Hola, pequeños exploradores! Hoy descubriremos el maravilloso mundo de las plantas. Aprenderemos cuáles son sus partes y qué función cumple cada una. ¡Prepárense para observar, descubrir y divertirnos aprendiendo!'
    );
    welcomeSpeech.lang = 'es-MX';
    welcomeSpeech.rate = 0.95;
    welcomeSpeech.pitch = 1.05;
    welcomeSpeech.onend = closeWelcome;
    welcomeSpeech.onerror = (event) => {
      if (welcomeClosed || event.error === 'canceled' || event.error === 'interrupted') return;

      welcomeStatus.textContent = 'No se pudo iniciar la voz automáticamente. Presiona «Escuchar otra vez» para probar.';
      replayWelcomeButton.hidden = false;
    };

    welcomeStatus.textContent = 'Reproduciendo la bienvenida...';
    replayWelcomeButton.hidden = true;
    window.speechSynthesis.speak(welcomeSpeech);
  };

  skipWelcomeButton.addEventListener('click', closeWelcome);
  replayWelcomeButton.addEventListener('click', speakWelcome);
  document.body.classList.add('welcome-active');
  speakWelcome();
}

const plantParts = {
  flower: {
    name: 'La flor',
    icon: '🌼',
    description: 'Es la parte que ayuda a la planta a formar semillas. ¡Además, atrae a las abejas y mariposas!'
  },
  fruit: {
    name: 'El fruto',
    icon: '🍎',
    description: 'Protege las semillas de la planta. Algunos frutos, como la manzana, también son deliciosos.'
  },
  leaf: {
    name: 'Las hojas',
    icon: '🍃',
    description: 'Usan la luz del sol, el aire y el agua para preparar el alimento que necesita la planta.'
  },
  stem: {
    name: 'El tallo',
    icon: '🌿',
    description: 'Sostiene la planta y lleva el agua desde la raíz hasta las hojas y la flor.'
  },
  root: {
    name: 'La raíz',
    icon: '🌱',
    description: 'Sujeta la planta a la tierra y absorbe el agua y los nutrientes que necesita para crecer.'
  }
};

const partButtons = document.querySelectorAll('.plant-part');
const cardLabel = document.querySelector('#card-label');
const partTitle = document.querySelector('#part-title');
const partDescription = document.querySelector('#part-description');
const discoveryIcon = document.querySelector('#discovery-icon');

partButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const part = plantParts[button.dataset.part];
    if (!part) return;

    partButtons.forEach((partButton) => {
      partButton.setAttribute('aria-pressed', String(partButton === button));
    });

    cardLabel.textContent = '¡Muy bien!';
    partTitle.textContent = part.name;
    partDescription.textContent = part.description;
    discoveryIcon.textContent = part.icon;
  });
});

const quizForm = document.querySelector('#quiz-form');

if (quizForm) {
  const modeButtons = document.querySelectorAll('.mode-button');
  const modeHint = document.querySelector('#mode-hint');
  const checkAnswersButton = document.querySelector('#check-answers');
  const printQuizButton = document.querySelector('#print-quiz');
  const printNote = document.querySelector('#print-note');
  const quizFeedback = document.querySelector('#quiz-feedback');
  const questions = quizForm.querySelectorAll('.quiz-question');

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const worksheetMode = button.dataset.mode === 'worksheet';

      modeButtons.forEach((modeButton) => {
        const isSelected = modeButton === button;
        modeButton.setAttribute('aria-pressed', String(isSelected));
        modeButton.classList.toggle('is-active', isSelected);
      });

      checkAnswersButton.hidden = worksheetMode;
      printQuizButton.hidden = !worksheetMode;
      printNote.hidden = !worksheetMode;
      quizFeedback.hidden = true;
      modeHint.textContent = worksheetMode
        ? 'Imprime la evaluación o guárdala como PDF para responderla en papel.'
        : 'Elige una alternativa en cada pregunta y al final revisa tu puntaje.';
    });
  });

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const correctAnswers = Array.from(questions).filter((question) => {
      const selectedAnswer = question.querySelector('input:checked');
      return selectedAnswer && selectedAnswer.value === question.dataset.correct;
    }).length;

    const encouragement = correctAnswers === questions.length
      ? '¡Increíble, respondiste todo correctamente!'
      : correctAnswers >= 7
        ? '¡Muy buen trabajo, sabes mucho sobre las plantas!'
        : correctAnswers >= 4
          ? '¡Vas aprendiendo! Puedes repasar las partes de la planta e intentarlo otra vez.'
          : '¡Sigue explorando la planta y vuelve a intentarlo!';

    quizFeedback.textContent = `Obtuviste ${correctAnswers} de ${questions.length} respuestas correctas. ${encouragement}`;
    quizFeedback.hidden = false;
  });

  printQuizButton.addEventListener('click', () => {
    document.body.classList.add('printing-quiz');
    window.print();
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-quiz');
  });
}
