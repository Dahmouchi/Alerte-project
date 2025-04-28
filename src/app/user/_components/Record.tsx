"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  StopCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformVoice, uploadAudio } from "@/actions/alertActions";
import { toast } from "react-toastify";

interface AudioRecorderProps {
  onUpload: (audioUrl: string) => void;
}

export function AudioRecorder({ onUpload }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<"none" | "effect">(
    "none"
  );
  const [showChoice, setShowChoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setShowChoice(true); // Show choice after recording stops
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error(
        "Microphone access denied. Please allow microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleKeepOriginal = async () => {
    if (!audioBlob) return;
    try {
      setSelectedEffect("none");
      setShowChoice(false);
      const url = await uploadAudio(audioBlob);
      if(url){
        onUpload(url);
        setAudioUrl(url)
        toast.success("Recording saved successfully!");
        setIsUploading(true)
      }  
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleApplyEffect = async () => {
    if (!audioBlob) return;
    try {
      setSelectedEffect("effect");
      setShowChoice(false);
      const blobToUpload = await transformVoice(audioBlob)
      if(blobToUpload){
        const url = await uploadAudio(blobToUpload);
        setAudioUrl(url);
        onUpload(url);
        toast.success("Recording saved successfully!");
      }
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  
   
  };
  
  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setSelectedEffect("none");
    setShowChoice(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    onUpload(""); // Clear the field
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center gap-3">
        {!isRecording && !audioUrl ? (
          <Button
            type="button"
            onClick={startRecording}
            variant="outline"
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            Start Recording
          </Button>
        ) : isRecording ? (
          <Button
            type="button"
            onClick={stopRecording}
            variant="destructive"
            className="gap-2"
          >
            <StopCircle className="h-4 w-4" />
            Stop Recording
          </Button>
        ) : null}

        

        {audioUrl && (
          <Button
            type="button"
            onClick={deleteRecording}
            variant="ghost"
            className="gap-2 text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      {/* Choice after recording */}
      {showChoice && audioUrl && (
       <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
       <h3 className="mb-3 text-sm font-medium">
         Que souhaitez-vous faire avec cet enregistrement ?
       </h3>
       <div className="grid grid-cols-2 gap-2 mb-3">
         <Button
           onClick={handleKeepOriginal}
           variant="outline"
           disabled={isUploading}
         >
           Voix originale
         </Button>
         <Button
           onClick={handleApplyEffect}
           variant="outline"
           disabled={isUploading}
         >
           Appliquer un effet vocal
         </Button>
       </div>
     </div>
      )}

      {/* Audio Preview */}
      {audioUrl && !showChoice && !isUploading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <audio ref={audioRef} src={audioUrl} controls className="flex-1" />
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedEffect === "none"
              ? "Original recording"
              : "Recording with voice effect"}
          </p>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          Recording...
        </div>
      )}
    </div>
  );
}
