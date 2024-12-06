using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;

public class VTuberClient : MonoBehaviour
{
    [Header("Server Settings")]
    [SerializeField] private string serverUrl = "http://localhost:8000";
    [SerializeField] private float checkInterval = 1f;
    
    [Header("Audio Settings")]
    [SerializeField] [Range(0f, 1f)] private float volume = 1f;
    
    // Public event for emotions
    public delegate void EmotionHandler(string[] emotions);
    public event EmotionHandler OnEmotionReceived;

    [SerializeField] private AudioSource audioSource;
    private int lastPlayedClipId = 0;
    private Dictionary<string, AudioClip> clipCache = new Dictionary<string, AudioClip>();
    private bool isProcessingClips = false;

    [System.Serializable]
    private class ClipInfo
    {
        public int id;
        public string filename;
        public double timestamp;
        public string[] emotions;
        public string text;
        public long size;
    }

    [System.Serializable]
    private class ClipsResponse
    {
        public List<ClipInfo> clips;
    }

    void Start()
    {
        // Ensure we have an AudioListener
        if (FindObjectOfType<AudioListener>() == null)
        {
            gameObject.AddComponent<AudioListener>();
        }
        if(audioSource == null){
        // Setup AudioSource
        audioSource = gameObject.AddComponent<AudioSource>();
        }
        ConfigureAudioSource();
        
        StartCoroutine(CheckForNewClips());
    }

    void ConfigureAudioSource()
    {
        audioSource.playOnAwake = true;
        audioSource.spatialBlend = 0f; // 2D sound
        audioSource.volume = volume;
        audioSource.outputAudioMixerGroup = null; // Direct output
        audioSource.mute = false;
        audioSource.pitch = 1.2f;
        audioSource.priority = 0; // Highest priority
    }

    IEnumerator CheckForNewClips()
    {
        WaitForSeconds wait = new WaitForSeconds(checkInterval);
        
        while (true)
        {
            if (!audioSource.isPlaying && !isProcessingClips)
            {
                isProcessingClips = true;
                yield return StartCoroutine(FetchAndPlayNewClips());
                isProcessingClips = false;
            }
            yield return wait;
        }
    }

    IEnumerator FetchAndPlayNewClips()
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"{serverUrl}/clips"))
        {
            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {

                    var response = JsonConvert.DeserializeObject<ClipsResponse>(www.downloadHandler.text);
                    
                    foreach (var clip in response.clips)
                    {
                        if (clip.id > lastPlayedClipId)
                        {
                            Debug.Log($"New clip found: {clip.id} - {clip.filename}");

                            // Handle emotions
                            if (clip.emotions != null && clip.emotions.Length > 0)
                            {
                                OnEmotionReceived?.Invoke(clip.emotions);
                                Debug.Log($"Emotions: {string.Join(", ", clip.emotions)}");
                            }

                            // Download and play audio
                            yield return StartCoroutine(DownloadAndPlayClip(clip));
                            lastPlayedClipId = clip.id;

                            // Wait for current clip to finish
                            while (audioSource.isPlaying)
                            {
                                yield return null;
                            }
                        }
                    }
                

            }
            else
            {
                Debug.LogError($"Server request failed: {www.error}");
            }
        }
    }

    IEnumerator DownloadAndPlayClip(ClipInfo clipInfo)
    {
        if (clipCache.ContainsKey(clipInfo.filename) && clipCache[clipInfo.filename] != null)
        {
            PlayClip(clipCache[clipInfo.filename]);
            yield break;
        }

        string url = $"{serverUrl}/clip/{clipInfo.filename}";
        Debug.Log($"Downloading clip: {url}");

        using (UnityWebRequest www = UnityWebRequestMultimedia.GetAudioClip(url, AudioType.MPEG))
        {
            www.downloadHandler = new DownloadHandlerAudioClip(url, AudioType.MPEG);
            ((DownloadHandlerAudioClip)www.downloadHandler).streamAudio = false;

            // Add headers to ensure proper content type
            www.SetRequestHeader("Accept", "audio/mpeg");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                AudioClip clip = DownloadHandlerAudioClip.GetContent(www);
                if (clip != null && clip.length > 0)
                {
                    Debug.Log($"Successfully downloaded clip. Length: {clip.length}s, Samples: {clip.samples}, Frequency: {clip.frequency}Hz");
                    clip.name = clipInfo.filename;
                    clipCache[clipInfo.filename] = clip;
                    PlayClip(clip);
                }
                else
                {
                    Debug.LogError($"Failed to create AudioClip from {clipInfo.filename}. Response size: {www.downloadHandler.data.Length} bytes");
                    // Log the first few bytes of the response for debugging
                    if (www.downloadHandler.data.Length > 0)
                    {
                        string hexDump = BitConverter.ToString(www.downloadHandler.data);
                        Debug.LogError($"First 32 bytes: {hexDump}");
                    }
                }
            }
            else
            {
                Debug.LogError($"Download failed for {clipInfo.filename}: {www.error}");
            }
        }
    }

    void PlayClip(AudioClip clip)
    {
        if (clip == null) return;

        try
        {
            // Stop any currently playing audio
            if (audioSource.isPlaying)
            {
                audioSource.Stop();
            }

            // Set and play new clip
            audioSource.clip = clip;
            audioSource.volume = volume;
            audioSource.Play();

            // Log playback info
            if (audioSource.isPlaying)
            {
                Debug.Log($"Now playing: {clip.name} (Length: {clip.length}s, Frequency: {clip.frequency}Hz)");
            }
            else
            {
                Debug.LogError("Failed to start audio playback!");
                Debug.LogError($"Clip info - Name: {clip.name}, Length: {clip.length}s, Channels: {clip.channels}");
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Error playing clip: {e.Message}");
        }
    }

    void OnGUI()
    {
        // Debug window
        // GUILayout.Window(0, new Rect(10, 10, 300, 200), (id) => {
        //     GUILayout.Label("Audio Debug Info:");
        //     GUILayout.Label($"Volume: {audioSource.volume}");
        //     GUILayout.Label($"Is Playing: {audioSource.isPlaying}");
        //     GUILayout.Label($"Current Time: {audioSource.time:F2}s");
        //     GUILayout.Label($"Clip: {(audioSource.clip != null ? audioSource.clip.name : "None")}");
        //     if (audioSource.clip != null)
        //     {
        //         GUILayout.Label($"Clip Length: {audioSource.clip.length:F2}s");
        //         GUILayout.Label($"Sample Rate: {audioSource.clip.frequency}Hz");
        //         GUILayout.Label($"Channels: {audioSource.clip.channels}");
        //     }

        //     // Manual controls
        //     GUILayout.BeginHorizontal();
        //     if (GUILayout.Button("Play"))
        //     {
        //         if (audioSource.clip != null) audioSource.Play();
        //     }
        //     if (GUILayout.Button("Stop"))
        //     {
        //         audioSource.Stop();
        //     }
        //     GUILayout.EndHorizontal();

        //     // Volume slider
        //     GUILayout.BeginHorizontal();
        //     GUILayout.Label("Volume: ");
        //     volume = GUILayout.HorizontalSlider(volume, 0f, 1f, GUILayout.Width(200));
        //     GUILayout.EndHorizontal();
        // }, "VTuber Audio Debug");
    }

    public void SetVolume(float newVolume)
    {
        volume = Mathf.Clamp01(newVolume);
        if (audioSource != null)
        {
            audioSource.volume = volume;
        }
    }

    void Update()
    {
        // Update volume if changed
        if (audioSource != null && audioSource.volume != volume)
        {
            audioSource.volume = volume;
        }

        // Debug key controls
        if (Input.GetKeyDown(KeyCode.Space))
        {
            if (audioSource.isPlaying)
                audioSource.Pause();
            else
                audioSource.UnPause();
        }
    }

    void OnDestroy()
    {
        StopAllCoroutines();
        
        // Clean up cache
        foreach (var clip in clipCache.Values)
        {
            if (clip != null)
            {
                Destroy(clip);
            }
        }
        clipCache.Clear();
    }

    void OnValidate()
    {
        if (audioSource != null)
        {
            audioSource.volume = volume;
        }
    }

    // Helper method to force reload of the latest clip
    public void ReloadLatestClip()
    {
        StartCoroutine(FetchLatestClip());
    }

    private IEnumerator FetchLatestClip()
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"{serverUrl}/latest"))
        {
            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                {
                    var clipInfo = JsonUtility.FromJson<ClipInfo>(www.downloadHandler.text);
                    yield return StartCoroutine(DownloadAndPlayClip(clipInfo));
                }

            }
        }
    }
}