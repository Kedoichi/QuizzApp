"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function

export default function QuizForm({ initialQuiz, onSubmit, onCancel }) {
  const [quiz, setQuiz] = useState(
    initialQuiz || {
      title: "",
      type: "single", // 'single' or 'multiple'
      questions: [
        {
          id: uuidv4(), // Use uuidv4() to generate a unique ID
          text: "",
          type: "single",
          answers: ["", ""],
          correctAnswers: [0], // initial correct answer index for 'single'
        },
      ],
    }
  );

  const handleSubmit = () => {
    // Validate quiz data
    if (!quiz.title || quiz.questions.length === 0) return;

    // Check if each question has text and at least one answer
    const isValid = quiz.questions.every(
      (q) =>
        q.text.trim() &&
        q.answers.some((a) => a.trim()) &&
        q.correctAnswers.length > 0
    );

    if (!isValid) {
      alert(
        "Please complete all questions with text, answers, and select correct answer(s)"
      );
      return;
    }

    onSubmit(quiz);
  };

  const updateQuestion = (questionId, text) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, text } : q
      ),
    }));
  };

  const addAnswer = (questionId) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, ""] } : q
      ),
    }));
  };

  const updateAnswer = (questionId, answerIndex, text) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((ans, idx) =>
                idx === answerIndex ? text : ans
              ),
            }
          : q
      ),
    }));
  };

  const toggleCorrectAnswer = (questionId, answerIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;

        if (q.type === "single") {
          return { ...q, correctAnswers: [answerIndex] };
        } else {
          const correctAnswers = q.correctAnswers.includes(answerIndex)
            ? q.correctAnswers.filter((idx) => idx !== answerIndex)
            : [...q.correctAnswers, answerIndex];
          return { ...q, correctAnswers };
        }
      }),
    }));
  };

  const removeAnswer = (questionId, answerIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;

        const newAnswers = q.answers.filter((_, idx) => idx !== answerIndex);
        const newCorrectAnswers = q.correctAnswers
          .filter((idx) => idx !== answerIndex)
          .map((idx) => (idx > answerIndex ? idx - 1 : idx));

        return {
          ...q,
          answers: newAnswers,
          correctAnswers: newCorrectAnswers,
        };
      }),
    }));
  };

  const handleTypeChange = (newType) => {
    setQuiz((prev) => ({
      ...prev,
      type: newType,
      questions: prev.questions.map((q) => ({
        ...q,
        type: newType,
        correctAnswers: newType === "single" ? [q.correctAnswers[0] || 0] : [],
      })),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={(e) =>
            setQuiz((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <div className="flex gap-2">
          <Button
            variant={quiz.type === "single" ? "default" : "outline"}
            onClick={() => handleTypeChange("single")}
            className="flex-1"
          >
            Single Choice
          </Button>
          <Button
            variant={quiz.type === "multiple" ? "default" : "outline"}
            onClick={() => handleTypeChange("multiple")}
            className="flex-1"
          >
            Multiple Choice
          </Button>
        </div>
      </div>

      {/* Only one question */}
      {quiz.questions.length > 0 && (
        <Card key={quiz.questions[0].id} className="p-4">
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Question"
                  value={quiz.questions[0].text}
                  onChange={(e) =>
                    updateQuestion(quiz.questions[0].id, e.target.value)
                  }
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAnswer(quiz.questions[0].id)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>

              {quiz.questions[0].answers.map((answer, aIndex) => (
                <div
                  key={`${quiz.questions[0].id}-${aIndex}`}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder={`Answer ${aIndex + 1}`}
                    value={answer}
                    onChange={(e) =>
                      updateAnswer(quiz.questions[0].id, aIndex, e.target.value)
                    }
                  />
                  {quiz.type === "single" ? (
                    <input
                      type="radio"
                      checked={quiz.questions[0].correctAnswers.includes(
                        aIndex
                      )}
                      onChange={() =>
                        toggleCorrectAnswer(quiz.questions[0].id, aIndex)
                      }
                      name={`correct-${quiz.questions[0].id}`}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={quiz.questions[0].correctAnswers.includes(
                        aIndex
                      )}
                      onChange={() =>
                        toggleCorrectAnswer(quiz.questions[0].id, aIndex)
                      }
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnswer(quiz.questions[0].id, aIndex)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => addAnswer(quiz.questions[0].id)}
                size="sm"
              >
                Add Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!quiz.title || quiz.questions.length === 0}
        >
          Save Quiz
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
