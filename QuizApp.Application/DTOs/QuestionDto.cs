using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizApp.Application.DTOs;

public class QuestionDto
{
    public string Text { get; set; } = string.Empty;
    public List<string> Answers { get; set; } = new();
    public List<int> CorrectAnswers { get; set; } = new();
}