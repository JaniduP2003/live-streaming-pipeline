using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// add the services to the program
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// add a memory cache 
builder.Services.AddMemoryCache();

//add the streem manager as singalon
builder.Services.AddSingleton<StremManager>();

// make the cores 
builder.Services.AddCors(options =>{
    options.AddPolicy("NextJsPolicy", policy =>{
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "https://yoursite.vercel.app" 
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app =builder.Build();

if(app.Environment.IsDevelopment()){
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("NextjsPolicy");
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => new{
    status = "online",
    service = "Streeming API",
    version = "1.0.0",
    timestamp = DateTime.UtcNow
});

app.MapGet("/health" , () => "ok");

app.Run();