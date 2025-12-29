// make the logic to the stream 
using backend.Models;
using System.Security.Cryptography;

namespace backend.Services;

public class StreamManager{
    //hold the id and streaminfo
    //AB234 - all the stream data in Model streamdata 
    private readonly Dictionary<String , StreamData> _streams = new();
    //new() is making a new objct in c# even data strct are objects (classes)
    // when passkey is given look up the stream (bellow line)
    private readonly Dictionary<string ,string > _KeyToStreamId = new();
    //to log all the chages use Ilogger interface 
    private readonly ILogger<StreamManager> _logger ;

    public StreamManager(ILogger<StreamManager> logger ){
        _logger =logger ;
    }

    //Creates a new stream with generated ID/key return the streamdata object
        //need a uniqe id and key (use genarate key())
        //make a streamdata objct
        // use the above key and id and use private _stream and private KEytostreemid
        // private reaonly is a hand clasping a box hard you cant let go but you can
        // open the box and chage the insides of it
        //method signature design pattern use THIS <--------------------
        // public return_obj name(parameter)

    public StreamData CreateStream(string Title){
        var Id = GenerateId();
        var key = GenerateSecureKey();

        var stream = new StreamData{
            Id = Id,
            Key = key,
            Title = Title,
            CreatedAt = DateTime.UtcNow,
            IsLive = false
        };

        //“Store the stream ID (Id) under this stream key (key)”
        //If the key already exists → it updates the value If it doesn’t exist → it adds a new entry
        _KeyToStreamId[key] = Id;
        _streams[Id] = stream;

        _logger.LogInformation("Stream Created: {StreamId}", Id);

        return stream;
    }
 
    //Retrieves stream by ID return streamdata or NULL
    public StreamData? GetStream(string StreamId){
        _streams.TryGetValue(StreamId , out var stream);
        // if the value is not found its assigned by out var stream this
        return stream;
    }

    //Gets all currently live streams return a list<>
    public List<StreamData> GetLiveStreams(){
        return _streams.Values.Where(s=> s.IsLive).ToList();
    }

    //Validates stream access credentials return bool;
    public bool ValidateStreamKey(string StreamId , string key ){
        return _streams.TryGetValue(StreamId , out var  stream ) && stream.Key == key;
    }

    //Changes stream status to live
    //this make the strem as LIVE
    // finds by id then chage the status as LIVE and logs time 
    //adds logger info
    public void MarkStreamLive(string streamId){
        if(_streams.TryGetValue(streamId, out var stream )){
            stream.IsLive =true;
            stream.LiveSince = DateTime.UtcNow;
            _logger.LogInformation("stream {StreamId} is now Live " , streamId);
        }
    }

    //lets do as unlive 
        public void MarkStreamOffline(string streamId)
    {
        if (_streams.TryGetValue(streamId, out var stream))
        {
            stream.IsLive = false;
            stream.LiveSince = null;
            _logger.LogInformation("Stream {StreamId} went offline", streamId);
        }
    }

    //now delete the stream
    public bool DeleteStream(string streamId , string key){
        if(_streams.TryGetValue(streamId ,out var stream) && stream.Key == key ){
            _streams.Remove(streamId);
            _KeyToStreamId.Remove(key);
            _logger.LogInformation("stream {StreamId} Deleted " , streamId);
            return true;
        }
        return false ;
    }

    // make a uniqeid using the Guid.newgid
    private string GenerateId(){
        return Guid.NewGuid().ToString("N")[..8];
    }

    //genarate sec key 
    private string GenerateSecureKey()
    {
        var bytes = RandomNumberGenerator.GetBytes(24);
        return Convert.ToBase64String(bytes)
            .Replace("/", "_")
            .Replace("+", "-")
            .Substring(0, 32);
    }

}