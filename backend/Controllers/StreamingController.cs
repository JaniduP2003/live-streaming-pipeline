using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Web;

namespace backend.Controllers;
// add the url controllers so it can be used uisng URLS 

[ApiController]
[Route("api/[controller]")]
public class StreamingController : ControllerBase
{
    private readonly StreamManager _streamManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<StreamingController> _logger;

    public StreamingController(
        StreamManager streamManager,
        IConfiguration configuration,
        ILogger<StreamingController> logger)
    {
        _streamManager = streamManager;
        _configuration = configuration;
        _logger = logger;
    }

    
    /// Create a new stream
    [HttpPost("create")]
    public IActionResult CreateStream([FromBody] CreateStreamRequest request)
    {
        var stream = _streamManager.CreateStream(request.Title ??  "Live Stream");

        var rtmpServer = _configuration["StreamSettings:RtmpServer"] ?? "localhost";
        var rtmpPort = _configuration["StreamSettings:RtmpPort"] ?? "1935";
        var frontendUrl = "http://localhost: 3000"; 

        var response = new StreamResponse
        {
            Success = true,
            StreamId = stream.Id,
            RtmpUrl = $"rtmp://{rtmpServer}:{rtmpPort}/live",
            StreamKey = $"{stream.Id}? key={stream.Key}",
            WatchUrl = $"{frontendUrl}/watch/{stream. Id}",
            HlsUrl = $"http://localhost:8080/live/{stream.Id}. m3u8",
            DeleteKey = stream.Key
        };

        return Ok(response);
    }

    /// Get stream information
    [HttpGet("stream/{streamId}")]
    public IActionResult GetStream(string streamId)
    {
        var stream = _streamManager.GetStream(streamId);

        if (stream == null)
        {
            return NotFound(new { message = "Stream not found" });
        }

        var response = new StreamInfoResponse
        {
            StreamId = stream.Id,
            Title = stream.Title,
            IsLive = stream.IsLive,
            CreatedAt = stream.CreatedAt,
            LiveSince = stream.LiveSince,
            HlsUrl = $"http://localhost:8080/live/{stream.Id}.m3u8",
            Viewers = stream.IsLive ? Random.Shared.Next(5, 50) : 0
        };

        return Ok(response);
    }

    /// Get all live streams
 
    [HttpGet("live")]
    public IActionResult GetLiveStreams()
    {
        var streams = _streamManager. GetLiveStreams();

        var response = streams.Select(s => new
        {
            id = s.Id,
            title = s.Title,
            liveSince = s.LiveSince,
            viewers = Random.Shared.Next(5, 50)
        });

        return Ok(response);
    }

    /// Validate RTMP publish (SRS callback)
    [HttpPost("validate-publish")]
    public IActionResult ValidatePublish([FromForm] string app, [FromForm] string stream)
    {
        try
        {
            _logger.LogInformation("Publish attempt - App: {App}, Stream: {Stream}", app, stream);

            // Parse:  streamId? key=streamKey
            var parts = stream.Split('?');
            if (parts.Length < 2)
            {
                _logger.LogWarning("No key parameter in stream");
                return StatusCode(403, new { code = 403 });
            }

            var streamId = parts[0];
            var queryString = HttpUtility.ParseQueryString(parts[1]);
            var providedKey = queryString["key"];

            if (string.IsNullOrEmpty(providedKey))
            {
                _logger. LogWarning("Empty key for stream:  {StreamId}", streamId);
                return StatusCode(403, new { code = 403 });
            }

            if (_streamManager.ValidateStreamKey(streamId, providedKey))
            {
                _streamManager.MarkStreamLive(streamId);
                return Ok(new { code = 0 });
            }

            _logger.LogWarning("Invalid key for stream: {StreamId}", streamId);
            return StatusCode(403, new { code = 403 });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating publish");
            return StatusCode(500, new { code = 500 });
        }
    }

    /// Handle stream end (SRS callback)
    [HttpPost("on-unpublish")]
    public IActionResult OnUnpublish([FromForm] string stream)
    {
        var streamId = stream.Split("?")[0];
        _streamManager.MarkStreamOffline(streamId);
        return Ok(new { code = 0 });
    }

    /// Delete a stream
    [HttpDelete("stream/{streamId}")]
    public IActionResult DeleteStream(string streamId, [FromQuery] string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return BadRequest(new { message = "Key required" });
        }

        var deleted = _streamManager.DeleteStream(streamId, key);

        if (!deleted)
        {
            return NotFound(new { message = "Stream not found or invalid key" });
        }

        return Ok(new { message = "Stream deleted successfully" });
    }
}