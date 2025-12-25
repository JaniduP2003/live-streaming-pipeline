namespace backed.Models;

public class StreamData{
    public string Id { get;set; } = string.Empty;
    public string Key {get ;set; } = string.Empty;
    public string Title {get ; set;} = string.Empty;
    public DateTime CreatedAt {get ; set;}
    public bool IsLive {get ;set;}
    public DateTime? LiveSince {get;set;}
}

// when the fornt end need to create a new strem this is used 
// this si how the fornt ened send s th req to the bcak end 
public class  CreateStreamRequest{
    public string? Title {get ;set;}
}

// responce form the client 
// use string.Empty to stop form the it becoming e NULL
//so it will add "" insted of NULL
//Purpose: This is a response model sent back to the 
//client after a stream is created.
public class StreamResponse{
    public bool Success;
    public string StreamId {get ; set;} = string.Empty;
    public string RtmpUrl{get;set;} = string.Empty;
    public string  StreamKey {get;set;} = string.Empty;
    public string WatchUrl {get;set;} =string.Empty;
    public string HlsUrl {get;set;} = string.Empty;
    public string DeleteKey{get;set;} = string.Empty;
}

// this is not to create but to show info of the crated one 
public class StreamInfoResponse
{
    public string StreamId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public bool IsLive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LiveSince { get; set; }
    public string HlsUrl { get; set; } = string.Empty;
    public int Viewers { get; set; }
}
