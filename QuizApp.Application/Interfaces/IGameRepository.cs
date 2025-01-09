using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuizApp.Domain.Entities;

namespace QuizApp.Application.Interfaces;

public interface IGameRepository
{
    Task<Game> CreateAsync(Game game);
    Task<Game> GetByIdAsync(Guid id);
    Task<Game> GetByKeyAsync(string key);
    Task<List<Game>> GetByCreatorEmailAsync(string email);
    Task<Game> UpdateAsync(Game game);
    Task<bool> DeleteAsync(Guid id);
}