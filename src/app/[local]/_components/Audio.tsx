"use client";

import { useState, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioBlob(audioBlob);
      setAudioUrl(audioUrl);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Change voice (apply pitch shift)
  const changeVoice = async () => {
    if (!audioBlob) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const pitchShift = audioContext.createBiquadFilter();

    pitchShift.type = "highpass";
    pitchShift.frequency.value = 1000; // Adjust pitch effect

    gainNode.gain.value = 1.2; // Increase volume slightly

    const arrayBuffer = await audioBlob.arrayBuffer();
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      source.buffer = buffer;
      source.connect(pitchShift);
      pitchShift.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start();
    });
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-4">Audio Recorder with Voice Change</h2>
      
      {/* Record Button */}
      <button
        className={`px-4 py-2 rounded ${
          recording ? "bg-red-500" : "bg-green-500"
        } text-white mr-2`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Play Button */}
      {audioUrl && (
        <button className="px-4 py-2 bg-blue-500 text-white rounded mx-2" onClick={playAudio}>
          Play Audio
        </button>
      )}

      {/* Change Voice Button */}
      {audioUrl && (
        <button className="px-4 py-2 bg-purple-500 text-white rounded mx-2" onClick={changeVoice}>
          Change Voice
        </button>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <audio className="mt-4" controls src={audioUrl}></audio>
      )}
    </div>
  );
};

export default AudioRecorder;
