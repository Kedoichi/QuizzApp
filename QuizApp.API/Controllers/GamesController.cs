using Microsoft.AspNetCore.Mvc;
using QuizApp.Application.DTOs;
using QuizApp.Application.Interfaces;

namespace QuizApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost]
    public async Task<ActionResult<GameDto>> CreateGame([FromBody] CreateGameDto createGameDto)
    {
        var game = await _gameService.CreateGameAsync(createGameDto);
        return Ok(game);
    }

    [HttpGet("creator/{email}")]
    public async Task<ActionResult<List<GameDto>>> GetGamesByCreator(string email)
    {
        var games = await _gameService.GetGamesByCreatorEmailAsync(email);
        return Ok(games);
    }

    [HttpGet("key/{key}")]
    public async Task<ActionResult<GameDto>> GetGameByKey(string key)
    {
        var game = await _gameService.GetGameByKeyAsync(key);
        return Ok(game);
    }

    [HttpPost("{gameId}/quizzes")]
    public async Task<ActionResult<GameDto>> AddQuiz(Guid gameId, [FromBody] CreateQuizDto quizDto)
    {
        var game = await _gameService.AddQuizToGameAsync(gameId, quizDto);
        return Ok(game);
    }

    [HttpPut("{gameId}/quizzes/{quizId}")]
    public async Task<ActionResult<GameDto>> UpdateQuiz(Guid gameId, Guid quizId, [FromBody] CreateQuizDto quizDto)
    {
        var game = await _gameService.UpdateQuizAsync(gameId, quizId, quizDto);
        return Ok(game);
    }

    [HttpDelete("{gameId}/quizzes/{quizId}")]
    public async Task<ActionResult> DeleteQuiz(Guid gameId, Guid quizId)
    {
        var result = await _gameService.DeleteQuizAsync(gameId, quizId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGame(Guid id)
    {
        var result = await _gameService.DeleteGameAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}