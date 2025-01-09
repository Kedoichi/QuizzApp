using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuizApp.Application.DTOs;

namespace QuizApp.Application.Interfaces;

public interface IGameService
{
    Task<GameDto> CreateGameAsync(CreateGameDto createGameDto);
    Task<GameDto> GetGameByIdAsync(Guid id);
    Task<GameDto> GetGameByKeyAsync(string key);
    Task<List<GameDto>> GetGamesByCreatorEmailAsync(string email);
    Task<GameDto> AddQuizToGameAsync(Guid gameId, CreateQuizDto quizDto);
    Task<GameDto> UpdateQuizAsync(Guid gameId, Guid quizId, CreateQuizDto quizDto);
    Task<bool> DeleteQuizAsync(Guid gameId, Guid quizId);
    Task<bool> DeleteGameAsync(Guid id);
}