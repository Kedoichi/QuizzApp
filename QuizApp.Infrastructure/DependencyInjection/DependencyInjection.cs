using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using QuizApp.Application.Interfaces;
using QuizApp.Application.Services;
using QuizApp.Infrastructure.Configuration;
using QuizApp.Infrastructure.Persistence;

namespace QuizApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Get MongoDb settings from configuration
        var mongoSettings = configuration.GetSection("MongoDb").Get<MongoDbSettings>();

        // Register custom serializer for Guid to use Standard representation
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

        // Register MongoDB client and database
        services.AddSingleton<IMongoClient>(new MongoClient(mongoSettings.ConnectionString));
        services.AddSingleton<IMongoDatabase>(sp =>
            sp.GetRequiredService<IMongoClient>().GetDatabase(mongoSettings.DatabaseName));

        // Register repositories and services
        services.AddScoped<IGameRepository, MongoGameRepository>();
        services.AddScoped<IGameService, GameService>();

        return services;
    }
}
