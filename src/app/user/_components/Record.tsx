import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { useState, useRef } from "react";

interface AudioRecorderProps {
  onUpload: (audioUrl: string) => void;
}

const AudioRecorder = ({ onUpload }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        try {
          setIsUploading(true);
          const audioUrl = await uploadAudioToCloudflare(audioBlob);
          if (audioUrl) {
            onUpload(audioUrl);
          }
        } catch (error) {
          console.error("Upload failed:", error);
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setRecording(false);
  };

  const uploadAudioToCloudflare = async (audioBlob: Blob): Promise<string> => {
    try {
      // Convert Blob to Buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Generate unique filename
      const fileName = `audio/recording_${Date.now()}.webm`;
      
      // Upload to Cloudflare R2
      const uploadResponse = await uploadFile(
        buffer,
        fileName,
        audioBlob.type
      );
      
      // Get public URL
      return getFileUrl(uploadResponse.Key);
    } catch (error) {
      console.error("Error uploading to Cloudflare:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-start justify-start w-full space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          disabled={isUploading}
          className={`px-4 py-2 rounded-lg ${
            recording 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          } text-white disabled:bg-gray-400 transition-colors`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
          {isUploading && " (Uploading...)"}
        </button>
      </div>

      {audioURL && (
        <div className="w-full">
          <audio controls className="w-full max-w-md">
            <source src={audioURL} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;