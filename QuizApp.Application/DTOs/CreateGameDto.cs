using QuizApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class CreateGameDto
{
    public string Title { get; set; } = string.Empty;
    public string CreatorEmail { get; set; } = string.Empty;
}

public class GameDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string CreatorEmail { get; set; } = string.Empty;
    public List<QuizDto> Quizzes { get; set; } = new();
}
