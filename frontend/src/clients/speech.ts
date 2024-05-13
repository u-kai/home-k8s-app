export const speech = (word: string): void => {
  const synth = window.speechSynthesis;
  const voices = synth
    .getVoices()
    .filter((v) => v.lang !== undefined && v.lang === "en-US");
  if (voices.length === 0) {
    setTimeout(() => speech(word), 100);
    return;
  }
  const voice = voices[0];
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  synth.speak(utterance);
};
