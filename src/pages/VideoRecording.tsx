
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { ProgressBar } from "@/components/ProgressBar";
import { Play, Camera, Send, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const VideoRecording = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

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

  const handleSubmit = () => {
    toast({
      title: "Video Submitted",
      description: "Thank you! Your video has been submitted successfully.",
    });
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
                className="bg-gradient-to-r from-teacher-teal to-teacher-blue text-white px-6 py-2 rounded-xl"
              >
                Submit Video
                <Send className="ml-2 h-4 w-4" />
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
