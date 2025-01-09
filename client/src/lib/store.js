// lib/store.js

const store = {
  creators: [],
  games: [],
  scores: [],
};

// Helper function to generate unique IDs
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Creator functions
export const getCreatorByEmail = (email) => {
  return store.creators.find((creator) => creator.email === email);
};

export const createCreator = (email) => {
  if (getCreatorByEmail(email)) return null;

  const creator = {
    email,
    createdAt: new Date(),
  };

  store.creators.push(creator);
  return creator;
};

// Game functions
export const getGamesByCreator = (email) => {
  return store.games.filter((game) => game.creatorEmail === email);
};

export const getGameByKey = (gameKey) => {
  return store.games.find((game) => game.gameKey === gameKey);
};

export const createGame = (title, creatorEmail) => {
  const gameKey = generateGameKey();
  const game = {
    id: crypto.randomUUID(),
    title,
    creatorEmail,
    gameKey,
    quizzes: [],
    createdAt: new Date(),
  };

  store.games.push(game);
  return game;
};

// Quiz functions

export const addQuizToGame = (gameId, quizData) => {
  const game = store.games.find((g) => g.id === gameId);
  if (!game) return null;

  // More strict duplicate checking
  if (
    game.quizzes.some(
      (q) => q.title.toLowerCase() === quizData.title.toLowerCase()
    )
  ) {
    console.warn("Duplicate quiz title detected:", quizData.title);
    return {
      error: "DUPLICATE_TITLE",
      message: "A quiz with this title already exists",
    };
  }

  const quiz = {
    ...quizData,
    id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  // Add new quiz
  game.quizzes = [...game.quizzes, quiz];

  console.log("Quiz added successfully:", quiz);
  return { success: true, quiz };
};
export const updateQuiz = (gameId, quizId, quizData) => {
  const game = store.games.find((g) => g.id === gameId);
  if (!game) return null;

  const quizIndex = game.quizzes.findIndex((q) => q.id === quizId);
  if (quizIndex === -1) return null;

  const updatedQuiz = {
    ...game.quizzes[quizIndex],
    ...quizData,
    questions: quizData.questions.map((q) => ({
      ...q,
      id: q.id || generateId(), // Keep existing IDs or generate new ones
    })),
    updatedAt: new Date(),
  };

  game.quizzes[quizIndex] = updatedQuiz;
  return updatedQuiz;
};

export const deleteQuiz = (gameId, quizId) => {
  const game = store.games.find((g) => g.id === gameId);
  if (!game) return false;

  game.quizzes = game.quizzes.filter((q) => q.id !== quizId);
  return true;
};

export const deleteGame = (gameId) => {
  const initialLength = store.games.length;
  store.games = store.games.filter((g) => g.id !== gameId);
  return store.games.length < initialLength;
};

// Score functions
export const saveScore = (gameKey, quizScores) => {
  const scoreEntry = {
    id: crypto.randomUUID(),
    gameId: getGameByKey(gameKey).id,
    gameKey,
    quizScores,
    totalScore: calculateAverageScore(quizScores),
    completedAt: new Date(),
  };

  store.scores.push(scoreEntry);
  return scoreEntry;
};

export const getScoresByGame = (gameId) => {
  return store.scores.filter((score) => score.gameId === gameId);
};

// Helper functions
const generateGameKey = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const calculateAverageScore = (quizScores) => {
  return Math.round(
    quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / quizScores.length
  );
};

// For debugging
export const debugStore = () => {
  console.log("Current store state:", store);
};
