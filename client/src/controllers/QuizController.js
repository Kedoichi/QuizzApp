// src/controllers/QuizController.js
import { gameApi } from '@/services/gameApi';

export class QuizController {
  async getGamesByEmail(email) {
    try {
      return await gameApi.getGamesByCreator(email);
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async createGame(title, creatorEmail) {
    try {
      return await gameApi.createGame(title, creatorEmail);
    } catch (error) {
      console.error('Error creating game:', error);
      return null;
    }
  }

  async addQuizToGame(gameId, quizData) {
    try {
      return await gameApi.addQuizToGame(gameId, quizData);
    } catch (error) {
      console.error('Error adding quiz:', error);
      return null;
    }
  }

  async updateQuiz(gameId, quizId, quizData) {
    try {
      return await gameApi.updateQuiz(gameId, quizId, quizData);
    } catch (error) {
      console.error('Error updating quiz:', error);
      return null;
    }
  }

  async deleteQuiz(gameId, quizId) {
    try {
      return await gameApi.deleteQuiz(gameId, quizId);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
  }

  async deleteGame(gameId) {
    try {
      return await gameApi.deleteGame(gameId);
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  }
}