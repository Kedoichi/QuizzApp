import { api } from './api';

export const gameApi = {
  getGamesByCreator: (email) => 
    api.get(`/creator/${email}`),

  getGameByKey: (key) => 
    api.get(`/key/${key}`),

  createGame: (title, creatorEmail) => 
    api.post('', { title, creatorEmail }),

  addQuizToGame: (gameId, quizData) => 
    api.post(`/${gameId}/quizzes`, quizData),

  updateQuiz: (gameId, quizId, quizData) => 
    api.put(`/${gameId}/quizzes/${quizId}`, quizData),

  deleteQuiz: (gameId, quizId) => 
    api.delete(`/${gameId}/quizzes/${quizId}`),

  deleteGame: (gameId) => 
    api.delete(`/${gameId}`),
};