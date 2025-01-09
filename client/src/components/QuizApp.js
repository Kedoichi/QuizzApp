'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuizController } from '../controllers/QuizController';

const quizController = new QuizController();

const QuizApp = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [quizKey, setQuizKey] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [creatorQuizzes, setCreatorQuizzes] = useState([]);

  const handleCreatorLogin = () => {
    const quizzes = quizController.getQuizzesByEmail(email);
    setCreatorQuizzes(quizzes);
  };

  const handleCreateQuiz = () => {
    const newQuiz = quizController.createQuiz(
      'New Quiz',
      email,
      [
        {
          text: 'Sample Question',
          answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
          correctAnswer: 0
        }
      ]
    );
    setCreatorQuizzes([...creatorQuizzes, newQuiz]);
  };

  const handleJoinQuiz = () => {
    const foundQuiz = quizController.getQuizByKey(quizKey);
    if (foundQuiz) {
      setQuiz(foundQuiz);
    }
  };

  // Home View
  if (!role) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => setRole('creator')}>
            Creator
          </Button>
          <Button className="w-full" onClick={() => setRole('player')}>
            Player
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Creator View
  if (role === 'creator') {
    if (!email) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Enter Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleCreatorLogin}>
              Continue
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Quizzes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handleCreateQuiz}>
            Create New Quiz
          </Button>
          {creatorQuizzes.map((quiz) => (
            <Card key={quiz.id} className="p-4">
              <div>
                <h3 className="font-bold">{quiz.title}</h3>
                <p className="text-sm">Key: {quiz.key}</p>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Player View
  if (!quiz) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Quiz Key"
            value={quizKey}
            onChange={(e) => setQuizKey(e.target.value)}
          />
          <Button className="w-full" onClick={handleJoinQuiz}>
            Join
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6">
            <h3 className="font-bold mb-2">{question.text}</h3>
            <div className="space-y-2">
              {question.answers.map((answer, aIndex) => (
                <Button
                  key={aIndex}
                  variant="outline"
                  className="w-full text-left justify-start"
                >
                  {answer}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuizApp;