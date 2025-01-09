"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { gameApi } from "@/services/gameApi";

export default function PlayerQuiz() {
  const [gameKey, setGameKey] = useState("");
  const [game, setGame] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(null);

  // Join the game and initialize answer structure
  const handleJoinGame = async () => {
    setIsLoading(true);
    try {
      const gameData = await gameApi.getGameByKey(gameKey);
      const initialAnswers = gameData.quizzes.reduce((acc, quiz, qIndex) => {
        acc[qIndex] = quiz.questions.map((question) =>
          quiz.type === "single" ? null : []
        );
        return acc;
      }, {});
      setAnswers(initialAnswers);
      setGame(gameData);
    } catch (error) {
      setError("Game not found");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting an answer for single or multiple type questions
  const handleAnswerSelect = (answerIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = JSON.parse(JSON.stringify(prevAnswers));

      const currentQuiz = game.quizzes[currentQuizIndex];
      const currentQuestion = currentQuiz.questions[currentQuestionIndex];

      if (currentQuiz.type === "single") {
        // For single answer questions, replace the current answer
        newAnswers[currentQuizIndex][currentQuestionIndex] = answerIndex;
      } else {
        // For multiple answer questions, toggle selection
        const currentQuestionAnswers = 
          newAnswers[currentQuizIndex][currentQuestionIndex] || [];

        const existingIndex = currentQuestionAnswers.indexOf(answerIndex);

        if (existingIndex > -1) {
          // If already selected, remove it
          currentQuestionAnswers.splice(existingIndex, 1);
        } else {
          // If not selected, add it
          currentQuestionAnswers.push(answerIndex);
        }

        newAnswers[currentQuizIndex][currentQuestionIndex] = currentQuestionAnswers;
      }

      return newAnswers;
    });
  };

  // Calculate the score when the game is completed
  const calculateScore = () => {
    let totalScore = 0;
    let totalQuestions = 0;

    game.quizzes.forEach((quiz, quizIndex) => {
      quiz.questions.forEach((question, questionIndex) => {
        totalQuestions++;
        const userAnswers = answers[quizIndex][questionIndex];
        const correctAnswers = question.correctAnswers;

        // Check if the user's answers match the correct answers
        if (quiz.type === "single") {
          // For single answer questions
          if (userAnswers === correctAnswers[0]) {
            totalScore++;
          }
        } else {
          // For multiple answer questions
          // Check if all correct answers are selected and no incorrect answers
          const isCorrect = 
            correctAnswers.every(ans => userAnswers.includes(ans)) &&
            userAnswers.every(ans => correctAnswers.includes(ans));

          if (isCorrect) {
            totalScore++;
          }
        }
      });
    });

    // Calculate percentage score
    const scorePercentage = Math.round((totalScore / totalQuestions) * 100);
    
    return {
      totalQuestions,
      correctAnswers: totalScore,
      scorePercentage
    };
  };

  const handleNext = () => {
    const currentQuiz = game.quizzes[currentQuizIndex];
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentQuizIndex < game.quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Calculate score when the game is complete
      const gameScore = calculateScore();
      setScore(gameScore);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentQuizIndex > 0) {
      setCurrentQuizIndex((prev) => prev - 1);
      const prevQuiz = game.quizzes[currentQuizIndex - 1];
      setCurrentQuestionIndex(prevQuiz.questions.length - 1);
    }
  };

  // Reset game state
  const handleRestart = () => {
    setGameKey("");
    setGame(null);
    setCurrentQuizIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    setScore(null);
  };

  // If no game is joined yet, show the join form
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
              {isLoading ? "Joining..." : "Join Game"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Show results if game is complete
  if (isComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Trophy className="h-10 w-10 mr-2 text-yellow-500" />
              Game Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-2xl font-bold">
              Your Score: {score.scorePercentage}%
            </div>
            <div className="text-lg">
              {score.correctAnswers} out of {score.totalQuestions} questions correct
            </div>
            
            {/* Performance feedback */}
            <div className="mt-4">
              {score.scorePercentage >= 90 ? (
                <p className="text-green-600 font-semibold">
                  Excellent job! 🏆
                </p>
              ) : score.scorePercentage >= 70 ? (
                <p className="text-blue-600 font-semibold">
                  Great work! 👍
                </p>
              ) : score.scorePercentage >= 50 ? (
                <p className="text-yellow-600 font-semibold">
                  Good effort! Keep practicing. 💪
                </p>
              ) : (
                <p className="text-red-600 font-semibold">
                  Don't give up! You can improve. 🌱
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleRestart}
            >
              Play Another Game
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Guard against undefined `game` and ensure it has quizzes
  if (!game?.quizzes?.length) {
    return <div>Error: No quizzes available in the game.</div>;
  }

  const currentQuiz = game.quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuizIndex]?.[currentQuestionIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentQuiz.title}</CardTitle>
            <div className="text-sm text-gray-500">
              Quiz {currentQuizIndex + 1}/{game.quizzes.length} • Question{" "}
              {currentQuestionIndex + 1}/{currentQuiz.questions.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.text}</div>

          <div className="space-y-2">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                variant={
                  currentQuiz.type === "single"
                    ? currentAnswers === index
                      ? "default"
                      : "outline"
                    : currentAnswers?.includes(index)
                    ? "default"
                    : "outline"
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
              disabled={
                currentQuiz.type === "single"
                  ? currentAnswers === null
                  : !currentAnswers?.length
              }
            >
              {currentQuizIndex === game.quizzes.length - 1 &&
              currentQuestionIndex === currentQuiz.questions.length - 1
                ? "Finish"
                : "Next"}
              {!(
                currentQuizIndex === game.quizzes.length - 1 &&
                currentQuestionIndex === currentQuiz.questions.length - 1
              ) && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}