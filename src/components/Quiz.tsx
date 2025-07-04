'use client'

import { useState } from 'react'
import { HelpCircle, CheckCircle, XCircle, Award } from 'lucide-react'

const questions = [
  {
    questionText: 'Qual a extensão mínima de um Resumo Expandido, segundo as diretrizes do congresso?',
    answerOptions: [
      { answerText: '1 a 2 páginas', isCorrect: false },
      { answerText: '2 a 3 páginas', isCorrect: false },
      { answerText: '4 a 7 páginas', isCorrect: true },
      { answerText: '8 a 10 páginas', isCorrect: false },
    ],
  },
  {
    questionText: 'Em um Resumo Simples, é permitido incluir referências bibliográficas?',
    answerOptions: [
      { answerText: 'Sim, sempre.', isCorrect: false },
      { answerText: 'Não, nunca.', isCorrect: true },
      { answerText: 'Somente se houver mais de 5 autores.', isCorrect: false },
      { answerText: 'Depende do tema.', isCorrect: false },
    ],
  },
  {
    questionText: 'Onde o título de uma FIGURA deve ser posicionado em um Resumo Expandido?',
    answerOptions: [
      { answerText: 'Acima da figura', isCorrect: false },
      { answerText: 'Abaixo da figura', isCorrect: true },
      { answerText: 'Ao lado da figura', isCorrect: false },
      { answerText: 'Não é necessário título para figuras.', isCorrect: false },
    ],
  },
  {
    questionText: 'Quantas versões do Resumo Expandido devem ser submetidas e em qual formato?',
    answerOptions: [
      { answerText: 'Uma versão em DOCX.', isCorrect: false },
      { answerText: 'Duas versões em PDF.', isCorrect: true },
      { answerText: 'Uma versão em PDF e outra em DOCX.', isCorrect: false },
      { answerText: 'Apenas uma versão em PDF com identificação.', isCorrect: false },
    ],
  },
  {
    questionText: 'Qual a estrutura obrigatória para Relatos de Caso/Experiência em um Resumo Simples?',
    answerOptions: [
      { answerText: 'Introdução, Metodologia, Resultados, Conclusão.', isCorrect: false },
      { answerText: 'Introdução, Objetivo, Relato de Caso/Experiência, Conclusão.', isCorrect: true },
      { answerText: 'Revisão da Literatura, Discussão, Considerações Finais.', isCorrect: false },
      { answerText: 'Nenhuma das anteriores.', isCorrect: false },
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const handleAnswerOptionClick = (isCorrect: boolean, index: number) => {
    setSelectedAnswerIndex(index);
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correto! 🎉');
    } else {
      setFeedback('Incorreto. Tente novamente! 🤔');
    }

    // Set a timeout to move to the next question or show score
    setTimeout(() => {
      setFeedback(''); // Clear feedback
      setSelectedAnswerIndex(null); // Clear selected answer
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 1500); // 1.5 seconds delay
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setFeedback('');
    setSelectedAnswerIndex(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Teste Seus Conhecimentos!</h1>
        <p className="text-lg text-gray-600">
          Responda às perguntas para verificar o que você aprendeu.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col justify-between">
        {showScore ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Award className="h-24 w-24 text-blue-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Você acertou {score} de {questions.length} perguntas!
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              {score === questions.length
                ? 'Parabéns, você é um mestre dos resumos acadêmicos! 🚀'
                : score >= questions.length / 2
                ? 'Muito bom! Você está no caminho certo. 💪'
                : 'Continue estudando, você consegue melhorar!📚'}
            </p>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-gray-600 text-sm mb-2">
                Pergunta {currentQuestion + 1} de {questions.length}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-start">
                <HelpCircle className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" />
                {questions[currentQuestion].questionText}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerOptionClick(option.isCorrect, index)}
                  className={`
                    flex items-center p-4 border rounded-lg text-left transition duration-200 ease-in-out
                    ${selectedAnswerIndex === index 
                        ? (option.isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }
                    ${selectedAnswerIndex !== null && selectedAnswerIndex !== index && option.isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${selectedAnswerIndex !== null && selectedAnswerIndex !== index && !option.isCorrect ? 'cursor-not-allowed opacity-70' : ''}
                  `}
                  disabled={selectedAnswerIndex !== null} // Disable buttons after an answer is selected
                >
                  {feedback && selectedAnswerIndex === index && option.isCorrect && (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                  )}
                  {feedback && selectedAnswerIndex === index && !option.isCorrect && (
                    <XCircle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                  )}
                  {option.answerText}
                </button>
              ))}
            </div>
            {feedback && (
              <div className={`mt-4 text-center font-bold text-lg ${feedback.includes('Correto') ? 'text-green-600' : 'text-red-600'}`}>
                {feedback}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}