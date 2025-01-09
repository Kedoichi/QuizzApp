"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Eye, ArrowLeft, Plus } from "lucide-react";
import QuizForm from "@/components/QuizForm";
import { QuizController } from "@/controllers/QuizController";

const gameController = new QuizController();

export default function CreatorPage() {
  const [email, setEmail] = useState("");
  const [games, setGames] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("games");
  const [currentGame, setCurrentGame] = useState(null); // Initial value is null
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [newGameTitle, setNewGameTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatorLogin = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const creatorGames = await gameController.getGamesByEmail(email);
      setGames(creatorGames);
      setIsLoggedIn(true);
      setError("");
    } catch (error) {
      setError("Failed to load games");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async () => {
    if (!newGameTitle.trim()) return;

    setIsLoading(true);
    try {
      const game = await gameController.createGame(newGameTitle, email);
      if (game) {
        setGames((prevGames) => [...prevGames, game]);
        setView("games");
        setNewGameTitle("");
      }
    } catch (error) {
      setError("Failed to create game");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuiz = async (quizData) => {
    setIsLoading(true);
    try {
      const newQuiz = await gameController.addQuizToGame(
        currentGame.id,
        quizData
      );

      if (newQuiz) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === currentGame.id
              ? { ...game, quizzes: [...game.quizzes, newQuiz] }
              : game
          )
        );

        setCurrentGame((prevGame) => ({
          ...prevGame,
          quizzes: [...prevGame.quizzes, newQuiz],
        }));

        setView("editGame");
        setCurrentQuiz(null); // Reset currentQuiz after adding
      }
    } catch (error) {
      setError("Failed to add quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuiz = async (quizData) => {
    setIsLoading(true);
    try {
      const updatedQuiz = await gameController.updateQuiz(
        currentGame.id,
        currentQuiz.id,
        { ...quizData, id: currentQuiz.id }
      );

      if (updatedQuiz) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === currentGame.id
              ? {
                  ...game,
                  quizzes: game.quizzes.map((q) =>
                    q.id === currentQuiz.id ? updatedQuiz : q
                  ),
                }
              : game
          )
        );

        setCurrentGame((prevGame) => ({
          ...prevGame,
          quizzes: prevGame.quizzes.map((q) =>
            q.id === currentQuiz.id ? updatedQuiz : q
          ),
        }));

        setView("editGame");
        setCurrentQuiz(null); // Reset after updating
      }
    } catch (error) {
      setError("Failed to update quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      if (gameController.deleteQuiz(currentGame.id, quizId)) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === currentGame.id
              ? {
                  ...game,
                  quizzes: game.quizzes.filter((q) => q.id !== quizId),
                }
              : game
          )
        );

        setCurrentGame((prevGame) => ({
          ...prevGame,
          quizzes: prevGame.quizzes.filter((q) => q.id !== quizId),
        }));
      }
    }
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      if (gameController.deleteGame(gameId)) {
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      }
    }
  };

  // Safe access for quizzes
  const quizzes = currentGame ? currentGame.quizzes || [] : [];

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <Button
              className="w-full"
              onClick={handleCreatorLogin}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {view === "games" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Games</CardTitle>
              <Button onClick={() => setView("createGame")}>
                Create New Game
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {games.length === 0 ? (
                <p className="text-center text-gray-500">
                  No games yet. Create your first game!
                </p>
              ) : (
                games.map((game) => (
                  <Card key={`game-list-${game.id}`} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{game.title}</h3>
                        <p className="text-sm">Key: {game.key}</p>
                        <p className="text-sm">
                          Quizzes: {game.quizzes?.length || 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentGame({
                              ...game,
                              quizzes: game.quizzes || [], // Ensure quizzes is always an array
                            });
                            setView("editGame");
                          }}
                        >
                          Manage Quizzes
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteGame(game.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {view === "createGame" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setView("games")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>Create New Game</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Game Title"
                value={newGameTitle}
                onChange={(e) => setNewGameTitle(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleCreateGame}
                disabled={!newGameTitle.trim() || isLoading}
              >
                {isLoading ? "Creating..." : "Create Game"}
              </Button>
            </CardContent>
          </Card>
        )}

        {view === "editGame" && currentGame && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentGame(null);
                      setView("games");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>{currentGame.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Game Key: {currentGame.key}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setView("addQuiz")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quiz
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No quizzes yet. Add your first quiz!
                </p>
              ) : (
                <div className="space-y-4">
                  {quizzes?.map((quiz, index) => (
                    <Card key={`quiz-list-${quiz.id}-${index}`} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">
                            Quiz {index + 1}: {quiz.title}
                          </h3>
                          <p className="text-sm">Type: {quiz.type} choice</p>
                          <p className="text-sm">
                            Questions: {quiz.questions?.length || 0}{" "}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCurrentQuiz(quiz);
                              setView("editQuiz");
                            }}
                          >
                            Edit Quiz
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(view === "addQuiz" || view === "editQuiz") && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentQuiz(null);
                    setView("editGame");
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>
                  {view === "addQuiz" ? "Add New Quiz" : "Edit Quiz"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <QuizForm
                initialQuiz={view === "editQuiz" ? currentQuiz : null}
                onSubmit={view === "addQuiz" ? handleAddQuiz : handleUpdateQuiz}
                onCancel={() => {
                  setCurrentQuiz(null);
                  setView("editGame");
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
