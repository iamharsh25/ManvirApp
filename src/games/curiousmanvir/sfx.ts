let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    const ctx = audioCtx;
    if (!ctx) return null;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function playTone({
  frequency,
  durationMs,
  type = "sine",
  volume = 0.12,
  startTime = 0,
  glideTo,
}: {
  frequency: number;
  durationMs: number;
  type?: OscillatorType;
  volume?: number;
  startTime?: number;
  glideTo?: number;
}) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime + startTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (typeof glideTo === "number") {
    osc.frequency.linearRampToValueAtTime(glideTo, now + durationMs / 1000);
  }
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function sfxSelect() {
  // soft pop
  playTone({ frequency: 700, durationMs: 80, type: "triangle", volume: 0.08 });
}

export function sfxCorrect() {
  // cheerful ascending arpeggio
  playTone({ frequency: 680, durationMs: 120, type: "sine", volume: 0.12 });
  playTone({
    frequency: 900,
    durationMs: 120,
    type: "sine",
    volume: 0.12,
    startTime: 0.09,
  });
  playTone({
    frequency: 1130,
    durationMs: 160,
    type: "triangle",
    volume: 0.12,
    startTime: 0.18,
  });
}

export function sfxWrong() {
  // descending "uh-oh"
  playTone({ frequency: 420, durationMs: 140, type: "sawtooth", volume: 0.08 });
  playTone({
    frequency: 320,
    durationMs: 180,
    type: "sawtooth",
    volume: 0.07,
    startTime: 0.08,
  });
}
