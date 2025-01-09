using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuizApp.Application.DTOs;
using QuizApp.Application.Interfaces;
using QuizApp.Domain.Entities;
using QuizApp.Domain.Exceptions;

namespace QuizApp.Application.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<GameDto> CreateGameAsync(CreateGameDto createGameDto)
    {
        var game = new Game
        {
            Id = Guid.NewGuid(),
            Title = createGameDto.Title,
            CreatorEmail = createGameDto.CreatorEmail,
            Key = GenerateUniqueKey(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdGame = await _gameRepository.CreateAsync(game);
        return MapGameToDto(createdGame);
    }

    public async Task<GameDto> GetGameByIdAsync(Guid id)
    {
        var game = await _gameRepository.GetByIdAsync(id);
        if (game == null) throw new NotFoundException(nameof(Game), id);
        return MapGameToDto(game);
    }

    public async Task<GameDto> GetGameByKeyAsync(string key)
    {
        var game = await _gameRepository.GetByKeyAsync(key);
        if (game == null) throw new NotFoundException(nameof(Game), key);
        return MapGameToDto(game);
    }

    public async Task<List<GameDto>> GetGamesByCreatorEmailAsync(string email)
    {
        var games = await _gameRepository.GetByCreatorEmailAsync(email);
        return games.Select(MapGameToDto).ToList();
    }

    public async Task<GameDto> AddQuizToGameAsync(Guid gameId, CreateQuizDto quizDto)
    {
        var game = await _gameRepository.GetByIdAsync(gameId);
        if (game == null) throw new NotFoundException(nameof(Game), gameId);

        var quiz = new Quiz
        {
            Id = Guid.NewGuid(),
            Title = quizDto.Title,
            Type = quizDto.Type,
            Questions = quizDto.Questions.Select(q => new Question
            {
                Id = Guid.NewGuid(),
                Text = q.Text,
                Answers = q.Answers,
                CorrectAnswers = q.CorrectAnswers
            }).ToList(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        game.Quizzes.Add(quiz);
        game.UpdatedAt = DateTime.UtcNow;

        var updatedGame = await _gameRepository.UpdateAsync(game);
        return MapGameToDto(updatedGame);
    }

    public async Task<GameDto> UpdateQuizAsync(Guid gameId, Guid quizId, CreateQuizDto quizDto)
    {
        var game = await _gameRepository.GetByIdAsync(gameId);
        if (game == null) throw new NotFoundException(nameof(Game), gameId);

        var quiz = game.Quizzes.FirstOrDefault(q => q.Id == quizId);
        if (quiz == null) throw new NotFoundException(nameof(Quiz), quizId);

        quiz.Title = quizDto.Title;
        quiz.Type = quizDto.Type;
        quiz.Questions = quizDto.Questions.Select(q => new Question
        {
            Id = Guid.NewGuid(),
            Text = q.Text,
            Answers = q.Answers,
            CorrectAnswers = q.CorrectAnswers
        }).ToList();
        quiz.UpdatedAt = DateTime.UtcNow;

        game.UpdatedAt = DateTime.UtcNow;

        var updatedGame = await _gameRepository.UpdateAsync(game);
        return MapGameToDto(updatedGame);
    }

    public async Task<bool> DeleteQuizAsync(Guid gameId, Guid quizId)
    {
        var game = await _gameRepository.GetByIdAsync(gameId);
        if (game == null) throw new NotFoundException(nameof(Game), gameId);

        var quiz = game.Quizzes.FirstOrDefault(q => q.Id == quizId);
        if (quiz == null) throw new NotFoundException(nameof(Quiz), quizId);

        game.Quizzes.Remove(quiz);
        game.UpdatedAt = DateTime.UtcNow;

        await _gameRepository.UpdateAsync(game);
        return true;
    }

    public async Task<bool> DeleteGameAsync(Guid id)
    {
        return await _gameRepository.DeleteAsync(id);
    }

    private string GenerateUniqueKey()
    {
        return Path.GetRandomFileName()
            .Replace(".", "")
            .Substring(0, 6)
            .ToUpper();
    }

    private static GameDto MapGameToDto(Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            Title = game.Title,
            Key = game.Key,
            CreatorEmail = game.CreatorEmail,
            Quizzes = game.Quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Type = q.Type,
                Questions = q.Questions.Select(qu => new QuestionDto
                {
                    Text = qu.Text,
                    Answers = qu.Answers,
                    CorrectAnswers = qu.CorrectAnswers
                }).ToList()
            }).ToList()
        };
    }
}