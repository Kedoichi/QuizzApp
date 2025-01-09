/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PlayerQuiz() {
  const [gameKey, setGameKey] = useState('');
  const [game, setGame] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinGame = async () => {
    setIsLoading(true);
    try {
      const gameData = await gameApi.getGameByKey(gameKey);
      setGame(gameData);
      // Initialize answers structure
      const initialAnswers = {};
      gameData.Quizzes.forEach((quiz, qIndex) => {
        initialAnswers[qIndex] = quiz.Questions.map(() => 
          quiz.Type === 'single' ? null : []
        );
      });
      setAnswers(initialAnswers);
    } catch (error) {
      setError('Game not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const currentQuiz = game.Quizzes[currentQuizIndex];
    
    setAnswers(prev => {
      const newAnswers = { ...prev };
      if (currentQuiz.Type === 'single') {
        newAnswers[currentQuizIndex][currentQuestionIndex] = answerIndex;
      } else {
        const current = newAnswers[currentQuizIndex][currentQuestionIndex] || [];
        if (current.includes(answerIndex)) {
          newAnswers[currentQuizIndex][currentQuestionIndex] = current.filter(a => a !== answerIndex);
        } else {
          newAnswers[currentQuizIndex][currentQuestionIndex] = [...current, answerIndex];
        }
      }
      return newAnswers;
    });
  };

  const handleNext = () => {
    const currentQuiz = game.Quizzes[currentQuizIndex];
    if (currentQuestionIndex < currentQuiz.Questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuizIndex < game.Quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      const prevQuiz = game.Quizzes[currentQuizIndex - 1];
      setCurrentQuestionIndex(prevQuiz.Questions.length - 1);
    }
  };

  if (!game) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Input
              placeholder="Enter Game Key"
              value={gameKey}
              onChange={(e) => setGameKey(e.target.value.toUpperCase())}
            />
            <Button 
              className="w-full" 
              onClick={handleJoinGame}
              disabled={!gameKey.trim() || isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Game'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Game Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show results later */}
            <Button 
              className="w-full"
              onClick={() => {
                setGameKey('');
                setGame(null);
                setCurrentQuizIndex(0);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setIsComplete(false);
              }}
            >
              Play Another Game
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const currentQuiz = game.Quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz.Questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuizIndex]?.[currentQuestionIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentQuiz.Title}</CardTitle>
            <div className="text-sm text-gray-500">
              Quiz {currentQuizIndex + 1}/{game.Quizzes.length} •
              Question {currentQuestionIndex + 1}/{currentQuiz.Questions.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">
            {currentQuestion.Text}
          </div>
          
          <div className="space-y-2">
            {currentQuestion.Answers.map((answer, index) => (
              <Button
                key={index}
                variant={
                  currentQuiz.Type === 'single'
                    ? currentAnswers === index ? 'default' : 'outline'
                    : currentAnswers?.includes(index) ? 'default' : 'outline'
                }
                className="w-full justify-start text-left"
                onClick={() => handleAnswerSelect(index)}
              >
                {answer}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuizIndex === 0 && currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentQuiz.Type === 'single' ? currentAnswers === null : !currentAnswers?.length}
            >
              {currentQuizIndex === game.Quizzes.length - 1 && 
               currentQuestionIndex === currentQuiz.Questions.length - 1 
                ? 'Finish'
                : 'Next'}
              {!(currentQuizIndex === game.Quizzes.length - 1 && 
                 currentQuestionIndex === currentQuiz.Questions.length - 1) && 
                <ArrowRight className="h-4 w-4 ml-2" />
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}