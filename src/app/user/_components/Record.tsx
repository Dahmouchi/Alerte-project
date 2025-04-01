import { useState, useRef } from "react";

 const AudioRecorder = ({ onUpload }: { onUpload: (audioUrl: string) => void }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

      // Upload audio file to Cloudflare
      const formData = new FormData();
      formData.append("file", audioBlob, "recorded_audio.webm");

      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      onUpload(data.audioUrl); // Send the uploaded URL to the parent component
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg ${recording ? "bg-red-500" : "bg-blue-500"} text-white`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      {audioURL && (
        <audio controls className="mt-2">
          <source src={audioURL} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
export default AudioRecorder;