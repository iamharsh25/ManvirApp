let loaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];
let selectedVoice: SpeechSynthesisVoice | null = null;

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  availableVoices = window.speechSynthesis.getVoices();
  if (!availableVoices || availableVoices.length === 0) return;

  // Prefer kid-friendly, clear English voices when present
  const preferredNames = [
    // iOS Safari
    "Samantha",
    "Ava",
    "Alex",
    // Google Chrome
    "Google US English",
    "Google UK English Female",
    "Google UK English Male",
    // Windows
    "Microsoft Zira Desktop",
    "Microsoft David Desktop",
  ];

  const candidates = availableVoices
    .filter((v) => /en(-|_)?(US|GB|AU|CA)?/i.test(v.lang))
    .sort((a, b) => {
      const ai = preferredNames.findIndex((n) => a.name.includes(n));
      const bi = preferredNames.findIndex((n) => b.name.includes(n));
      const as = ai === -1 ? 999 : ai;
      const bs = bi === -1 ? 999 : bi;
      return as - bs;
    });

  selectedVoice = candidates[0] || availableVoices[0] || null;
}

export function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  if (loaded) return;
  loaded = true;

  refreshVoices();
  if (availableVoices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoices();
    };
  }
}

export function speakText(
  text: string,
  opts?: { rate?: number; pitch?: number }
) {
  try {
    if (!("speechSynthesis" in window)) return;
    const { rate = 0.95, pitch = 1.1 } = opts || {};
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.voice = selectedVoice ?? null;
    u.lang = selectedVoice?.lang || "en-US";
    window.speechSynthesis.speak(u);
  } catch {}
}

export function speakLetter(letter: string) {
  // Uppercase yields clearer pronunciation of the letter name
  speakText(letter.toUpperCase());
}
