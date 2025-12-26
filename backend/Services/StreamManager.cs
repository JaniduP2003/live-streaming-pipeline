// make the logic to the stream 
using backedn.Models;
using  System.Security.Cryptography;

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

    public StreamManager(Ilogger<StreamManager> logger ){
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
        var Id =GenarateId();
        var key = GenarateSecureKey();

        var stream = new StreamData{
            Id = Id,
            Key = key,
            Title = Title,
            CreatedAt = DateTime.UtcNow,
            IsLive = false
        };

        _KeyToStreamId[key] = Id;
        _streams[id] = stream;

        _logger.LogInformation("Stream Created: {StreamId}",id);

        return stream;
    }
 
    //Retrieves stream by ID return streamdata or NULL

    //Gets all currently live streams return a list<>

    //Validates stream access credentials return bool;

    //Changes stream status to live

    //Changes stream status to live

    //Changes stream status to live return bool

}