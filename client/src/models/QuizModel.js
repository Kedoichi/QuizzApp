export class Game {
  constructor(title, creatorEmail) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.creatorEmail = creatorEmail;
    this.key = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.quizzes = [];
    this.createdAt = new Date();
  }
}

export class Quiz {
  constructor(title, questions = []) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.questions = questions;
  }
}

// Dummy data
export const dummyGames = [
  {
    id: '1',
    title: 'Math Quiz Game',
    creatorEmail: 'test@example.com',
    key: 'MTH123',
    quizzes: [
      {
        id: 'q1',
        title: 'Basic Math',
        questions: [
          {
            text: 'What is 2 + 2?',
            answers: ['3', '4', '5', '6'],
            correctAnswer: 1
          }
        ]
      }
    ],
    createdAt: new Date()
  }
];