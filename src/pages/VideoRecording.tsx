import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { ProgressBar } from "@/components/ProgressBar";
import { Play, Camera, Send, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const VideoRecording = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = videoUrl;
          videoRef.current.controls = true;
        }
        
        stopTimer();
        setRecordingComplete(true);
        
        // Extract audio from the video for transcription
        extractAudioFromVideo(videoBlob);
        
        // Clean up the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      videoChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
      
      // Automatically stop after 1 minute (60 seconds)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 60000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prevTime => {
        if (prevTime >= 60) {
          stopRecording();
          return prevTime;
        }
        return prevTime + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Extract audio from the video blob
  const extractAudioFromVideo = async (videoBlob: Blob) => {
    try {
      setIsTranscribing(true);
      
      // Create an audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a media element source
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(videoBlob);
      
      // Create a destination for the audio data
      const destination = audioContext.createMediaStreamDestination();
      
      // Create a media element source from the video element
      const source = audioContext.createMediaElementSource(videoElement);
      
      // Connect the source to the destination
      source.connect(destination);
      
      // Create a new MediaRecorder to record just the audio
      const audioRecorder = new MediaRecorder(destination.stream);
      const audioChunks: Blob[] = [];
      
      audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };
      
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        audioBlobRef.current = audioBlob;
        
        // Now that we have the audio, transcribe it
        transcribeAudio(audioBlob);
      };
      
      // Start recording the audio
      audioRecorder.start();
      
      // Play the video (this will be silent as we're just extracting the audio)
      videoElement.play();
      
      // Stop the audio recording when the video ends
      videoElement.onended = () => {
        audioRecorder.stop();
        videoElement.remove();
      };
      
      // If the video is too long, stop after 60 seconds
      setTimeout(() => {
        if (audioRecorder.state === 'recording') {
          audioRecorder.stop();
          videoElement.remove();
        }
      }, 61000); // Slightly longer than the video to ensure we capture everything
      
    } catch (error) {
      console.error('Error extracting audio:', error);
      setIsTranscribing(false);
      toast({
        title: "Audio Extraction Error",
        description: "There was a problem extracting audio from your recording.",
        variant: "destructive"
      });
    }
  };

  // Transcribe the audio using browser's SpeechRecognition API
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // For now, we'll use a placeholder transcription
      // In a real implementation, you would use a service like Google Speech-to-Text, AWS Transcribe, etc.
      
      // Simulate transcription with a timeout
      setTimeout(() => {
        // This is where you would integrate with a real transcription service
        // For now, we'll just set a placeholder message
        setTranscription("This is a placeholder transcription. In a real implementation, you would integrate with a transcription service.");
        setIsTranscribing(false);
      }, 2000);
      
      // Note: Browser's SpeechRecognition API doesn't work with pre-recorded audio
      // You'll need to use a server-side solution or a third-party API for production use
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsTranscribing(false);
      toast({
        title: "Transcription Error",
        description: "There was a problem transcribing your recording.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!transcription) {
        toast({
          title: "Transcription Not Ready",
          description: "Please wait for the transcription to complete before submitting.",
          variant: "destructive"
        });
        return;
      }
      
      // Prepare the data to send to the API
      const formData = JSON.stringify({
        transcription: transcription,
        recordingDate: new Date().toISOString(),
        // You can add more metadata here as needed
      });
      
      // This is where you would send the data to your API
      // For now, we'll just log it and show a success message
      console.log("Data to send to API:", formData);
      
      toast({
        title: "Transcription Ready",
        description: "Your video has been transcribed and is ready to send to the API.",
      });
      
      // In a real implementation, you would send the data to your API here
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: formData,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to submit transcription');
      // }
      // 
      // const data = await response.json();
      // console.log('API response:', data);
      
    } catch (error) {
      console.error('Error submitting transcription:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your transcription.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    return `0:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <PageContainer>
      <ProgressBar currentStep={3} totalSteps={3} />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teacher-purple mb-2">Record Your Teaching</h1>
        <p className="text-gray-600">
          Let's start recording a one-minute video of you teaching the topic.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10">
        <div className="aspect-video bg-gray-900">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isRecording}
            playsInline
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-teacher-purple mr-2" />
              <span className="font-semibold text-gray-700">
                {isRecording ? 'Recording in progress...' : recordingComplete ? 'Recording complete!' : 'Ready to record'}
              </span>
            </div>
            
            {isRecording && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <span className="font-medium">{formatTime(recordingTime)}</span>
                <span className="text-gray-500 ml-1">/ 1:00</span>
              </div>
            )}
          </div>
          
          {isTranscribing && (
            <div className="flex items-center justify-center my-3 text-teacher-purple">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Transcribing your recording...</span>
            </div>
          )}
          
          {transcription && (
            <div className="my-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-teacher-purple mb-1">Transcription:</h3>
              <p className="text-sm text-gray-700">{transcription}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            {!isRecording && !recordingComplete && (
              <Button
                onClick={startRecording}
                className="bg-teacher-purple hover:bg-teacher-purple/90 text-white px-6 py-2 rounded-xl"
              >
                Start Recording
                <Play className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="px-6 py-2 rounded-xl"
              >
                Stop Recording
              </Button>
            )}
            
            {recordingComplete && (
              <Button
                onClick={handleSubmit}
                disabled={isTranscribing || !transcription}
                className="bg-gradient-to-r from-teacher-teal to-teacher-blue text-white px-6 py-2 rounded-xl"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Transcription
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-accent/50 p-6 rounded-xl border border-primary/10">
        <h3 className="font-semibold text-teacher-purple mb-2">Tips for a Good Recording:</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Find a quiet place with good lighting</li>
          <li>Speak clearly and at a moderate pace</li>
          <li>Position the camera so students can see learning materials</li>
          <li>Be natural - teach as you normally would in your classroom</li>
          <li>Keep your recording under one minute</li>
        </ul>
      </div>

      <div className="mt-6">
        <Button 
          type="button" 
          onClick={() => navigate('/teacher-form')}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teacher Form
        </Button>
      </div>
    </PageContainer>
  );
};

export default VideoRecording;
