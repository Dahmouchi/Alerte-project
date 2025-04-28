// example.mts
import { ElevenLabsClient, play } from "elevenlabs";
import "dotenv/config";

const client = new ElevenLabsClient();
const voiceId = "JBFqnCBsd6RMkjVDRZzb";

const response = await fetch(
  "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);
const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const audioStream = await client.speechToSpeech.convert(voiceId, {
  audio: audioBlob,
  model_id: "eleven_multilingual_sts_v2",
  output_format: "mp3_44100_128",
});

await play(audioStream);
