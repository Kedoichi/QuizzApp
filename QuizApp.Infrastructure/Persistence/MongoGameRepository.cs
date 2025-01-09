using MongoDB.Driver;
using QuizApp.Application.Interfaces;
using QuizApp.Domain.Entities;

namespace QuizApp.Infrastructure.Persistence;

public class MongoGameRepository : IGameRepository
{
    private readonly IMongoCollection<Game> _games;

    public MongoGameRepository(IMongoDatabase database)
    {
        _games = database.GetCollection<Game>("Games");
    }

    public async Task<Game> CreateAsync(Game game)
    {
        await _games.InsertOneAsync(game);
        return game;
    }

    public async Task<Game> GetByIdAsync(Guid id)
    {
        var filter = Builders<Game>.Filter.Eq(g => g.Id, id);
        return await _games.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<Game> GetByKeyAsync(string key)
    {
        var filter = Builders<Game>.Filter.Eq(g => g.Key, key);
        return await _games.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Game>> GetByCreatorEmailAsync(string email)
    {
        var filter = Builders<Game>.Filter.Eq(g => g.CreatorEmail, email);
        return await _games.Find(filter).ToListAsync();
    }

    public async Task<Game> UpdateAsync(Game game)
    {
        var filter = Builders<Game>.Filter.Eq(g => g.Id, game.Id);
        await _games.ReplaceOneAsync(filter, game);
        return game;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var filter = Builders<Game>.Filter.Eq(g => g.Id, id);
        var result = await _games.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }
}
