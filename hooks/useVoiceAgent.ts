// 'use client'

// import { useState, useEffect, useRef, useCallback } from 'react'
// import { io, Socket } from 'socket.io-client'

// interface VoiceAgentState {
//   isConnected: boolean
//   isRecording: boolean
//   isPlaying: boolean
//   isSpeaking: boolean
//   transcript: string
//   agentTranscript: string
//   error: string | null
//   callLog: any | null
//   recordingUrl: string | null
// }

// interface UseVoiceAgentOptions {
//   serverUrl?: string
//   carContext?: string
// }

// export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
//   const { serverUrl = 'http://localhost:4030', carContext } = options

//   const [state, setState] = useState<VoiceAgentState>({
//     isConnected: false,
//     isRecording: false,
//     isPlaying: false,
//     isSpeaking: false,
//     transcript: '',
//     agentTranscript: '',
//     error: null,
//     callLog: null,
//     recordingUrl: null,
//   })

//   const socketRef = useRef<Socket | null>(null)
//   // We use a plain object ref instead of MediaRecorder so we can store
//   // the ScriptProcessorNode-based recorder
//   const recorderRef = useRef<{ stop: () => void } | null>(null)
//   const audioContextRef = useRef<AudioContext | null>(null)
//   const audioQueueRef = useRef<Float32Array[]>([])
//   const isPlayingRef = useRef(false)

//   // ─── Socket.IO connection ───────────────────────────────────────────────────
//   useEffect(() => {
//     const socket = io(serverUrl, {
//       transports: ['websocket', 'polling'],
//     })

//     socket.on('connect', () => {
//       console.log('[Voice] Connected to voice agent server')
//       setState(prev => ({ ...prev, isConnected: true, error: null }))
//     })

//     socket.on('disconnect', () => {
//       console.log('[Voice] Disconnected from voice agent server')
//       setState(prev => ({ ...prev, isConnected: false, isRecording: false }))
//     })

//     socket.on('session-started', (data: any) => {
//       console.log('[Voice] Session started:', data)
//       // session started means we are now "connected" to the AI session
//       setState(prev => ({ ...prev, isConnected: true }))
//     })

//     socket.on('audio-delta', (data: any) => {
//       handleAudioDelta(data.delta)
//     })

//     socket.on('transcript-delta', (data: any) => {
//       setState(prev => ({ ...prev, agentTranscript: prev.agentTranscript + data.delta }))
//     })

//     socket.on('transcript-done', (data: any) => {
//       console.log('[Voice] Agent transcript complete:', data.transcript)
//       // Reset agentTranscript so next turn starts fresh
//       setState(prev => ({ ...prev, agentTranscript: '' }))
//     })

//     socket.on('user-transcript', (data: any) => {
//       console.log('[Voice] User transcript:', data.transcript)
//       setState(prev => ({ ...prev, transcript: data.transcript }))
//     })

//     socket.on('speech-started', () => {
//       console.log('[Voice] User started speaking')
//       setState(prev => ({ ...prev, isSpeaking: true }))
//     })

//     socket.on('call-logged', (data: any) => {
//       console.log('[Voice] Call logged:', data)
//       setState(prev => ({ ...prev, callLog: data }))
//     })

//     socket.on('recording-saved', (data: any) => {
//       console.log('[Voice] Recording saved:', data)
//       setState(prev => ({ ...prev, recordingUrl: data.url }))
//     })

//     socket.on('realtime-error', (data: any) => {
//       console.error('[Voice] Realtime error:', data.error)
//       setState(prev => ({ ...prev, error: data.error?.message || 'Unknown error' }))
//     })

//     socket.on('session-closed', () => {
//       console.log('[Voice] Session closed')
//       // Don't set isConnected to false — the socket is still connected,
//       // only the AI session ended. This prevents the "Disconnected" badge.
//       setState(prev => ({ ...prev, isRecording: false }))
//     })

//     socketRef.current = socket

//     return () => {
//       socket.disconnect()
//       if (audioContextRef.current) {
//         audioContextRef.current.close()
//       }
//     }
//   }, [serverUrl])

//   // ─── Playback: incoming audio from ElevenLabs ──────────────────────────────

//   const playAudioQueue = useCallback(async () => {
//     if (audioQueueRef.current.length === 0 || isPlayingRef.current) return

//     isPlayingRef.current = true
//     setState(prev => ({ ...prev, isPlaying: true }))

//     const audioContext = audioContextRef.current
//     if (!audioContext) {
//       isPlayingRef.current = false
//       setState(prev => ({ ...prev, isPlaying: false }))
//       return
//     }

//     while (audioQueueRef.current.length > 0) {
//       const audioData = audioQueueRef.current.shift()
//       if (!audioData) continue

//       const audioBuffer = audioContext.createBuffer(1, audioData.length, 16000)
//       audioBuffer.getChannelData(0).set(audioData)

//       const source = audioContext.createBufferSource()
//       source.buffer = audioBuffer

//       await new Promise<void>((resolve) => {
//         source.onended = () => resolve()
//         source.connect(audioContext.destination)
//         source.start()
//       })
//     }

//     isPlayingRef.current = false
//     setState(prev => ({ ...prev, isPlaying: false }))
//   }, [])

//   const handleAudioDelta = useCallback(async (base64Audio: string) => {
//     // Lazily create the playback AudioContext on first audio delta so it is
//     // created after a user gesture (important for Safari / Chrome autoplay policy)
//     if (!audioContextRef.current) {
//       const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
//       audioContextRef.current = new AudioContextClass({ sampleRate: 16000 })
//     }

//     try {
//       // Decode base64 → Int16 PCM → Float32
//       const binaryString = atob(base64Audio)
//       const bytes = new Uint8Array(binaryString.length)
//       for (let i = 0; i < binaryString.length; i++) {
//         bytes[i] = binaryString.charCodeAt(i)
//       }
//       const pcm16 = new Int16Array(bytes.buffer)
//       const float32 = new Float32Array(pcm16.length)
//       for (let i = 0; i < pcm16.length; i++) {
//         float32[i] = pcm16[i] / 32768.0
//       }

//       audioQueueRef.current.push(float32)
//       if (!isPlayingRef.current) {
//         playAudioQueue()
//       }
//     } catch (error) {
//       console.error('[Voice] Error handling audio delta:', error)
//     }
//   }, [playAudioQueue])

//   // ─── Start voice session ────────────────────────────────────────────────────

//   const startSession = useCallback(() => {
//     if (!socketRef.current) return
//     socketRef.current.emit('start-session', { carContext })
//   }, [carContext])

//   // ─── Microphone capture using ScriptProcessorNode (raw PCM16) ─────────────
//   // This replaces the old MediaRecorder approach which used decodeAudioData on
//   // incomplete WebM chunks — that is what was causing EncodingError crashes and
//   // the AI not receiving any audio after the greeting.

//   const startRecording = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           sampleRate: 24000,
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       })

//       const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
//       // 24 kHz matches OPENAI_INPUT_SAMPLE_RATE on the backend
//       const captureContext = new AudioContextClass({ sampleRate: 24000 })
//       const source = captureContext.createMediaStreamSource(stream)

//       // ScriptProcessorNode: bufferSize 4096, 1 input ch, 1 output ch
//       // ~170 ms per chunk at 24 kHz — safe and low-latency
//       const processor = captureContext.createScriptProcessor(4096, 1, 1)

//       processor.onaudioprocess = (e: AudioProcessingEvent) => {
//         if (!socketRef.current?.connected) return

//         const inputData = e.inputBuffer.getChannelData(0)
//         const pcm16 = new Int16Array(inputData.length)

//         for (let i = 0; i < inputData.length; i++) {
//           const s = Math.max(-1, Math.min(1, inputData[i]))
//           pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
//         }

//         // Encode PCM16 bytes as base64 in chunks to avoid call-stack overflow
//         const bytes = new Uint8Array(pcm16.buffer)
//         let binary = ''
//         const chunkSize = 8192
//         for (let i = 0; i < bytes.length; i += chunkSize) {
//           binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + chunkSize)))
//         }
//         const pcmBase64 = btoa(binary)

//         socketRef.current.emit('audio-chunk', { audio: pcmBase64 })
//       }

//       // Connect graph: microphone → processor → destination (silent output needed
//       // by the browser to keep the processor alive)
//       source.connect(processor)
//       processor.connect(captureContext.destination)

//       recorderRef.current = {
//         stop: () => {
//           try {
//             source.disconnect()
//             processor.disconnect()
//           } catch (_) {}
//           if (captureContext.state !== 'closed') {
//             captureContext.close().catch(() => {})
//           }
//           stream.getTracks().forEach(t => t.stop())
//         },
//       }

//       setState(prev => ({ ...prev, isRecording: true, error: null }))
//     } catch (error: any) {
//       console.error('[Voice] Error starting recording:', error)
//       setState(prev => ({
//         ...prev,
//         error: error?.name === 'NotAllowedError'
//           ? 'Microphone permission denied — please allow mic access and try again'
//           : 'Failed to access microphone',
//       }))
//     }
//   }, [])

//   // ─── Stop recording ─────────────────────────────────────────────────────────

//   const stopRecording = useCallback(() => {
//     if (recorderRef.current) {
//       recorderRef.current.stop()
//       recorderRef.current = null
//       setState(prev => ({ ...prev, isRecording: false }))
//     }
//   }, [])

//   // ─── End session ────────────────────────────────────────────────────────────

//   const endSession = useCallback(() => {
//     stopRecording()
//     if (socketRef.current) {
//       socketRef.current.emit('end-session')
//     }
//     setState(prev => ({ ...prev, agentTranscript: '', transcript: '', callLog: null }))
//   }, [stopRecording])

//   return {
//     ...state,
//     startSession,
//     startRecording,
//     stopRecording,
//     endSession,
//   }
// }

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface VoiceAgentState {
  isConnected: boolean;
  isRecording: boolean;
  isPlaying: boolean;
  isSpeaking: boolean;
  transcript: string;
  agentTranscript: string;
  error: string | null;
  callLog: any | null;
  recordingUrl: string | null;
}

interface UseVoiceAgentOptions {
  serverUrl?: string;
  carContext?: string;
}

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const { serverUrl = "http://localhost:4030", carContext } = options;

  const [state, setState] = useState<VoiceAgentState>({
    isConnected: false,
    isRecording: false,
    isPlaying: false,
    isSpeaking: false,
    transcript: "",
    agentTranscript: "",
    error: null,
    callLog: null,
    recordingUrl: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const recorderRef = useRef<{ stop: () => void } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  // Tracks the currently playing source node so we can hard-stop it on barge-in
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  // Bumped on every clear so any in-flight playback loop knows to abandon itself
  const playbackGenerationRef = useRef(0);

  // ─── Playback: incoming audio from ElevenLabs ──────────────────────────────

  const playAudioQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;

    isPlayingRef.current = true;
    setState((prev) => ({ ...prev, isPlaying: true }));

    const audioContext = audioContextRef.current;
    if (!audioContext) {
      isPlayingRef.current = false;
      setState((prev) => ({ ...prev, isPlaying: false }));
      return;
    }

    const myGeneration = playbackGenerationRef.current;

    while (audioQueueRef.current.length > 0) {
      // Bail out immediately if a barge-in cleared the queue mid-loop
      if (myGeneration !== playbackGenerationRef.current) return;

      const audioData = audioQueueRef.current.shift();
      if (!audioData) continue;

      const audioBuffer = audioContext.createBuffer(1, audioData.length, 16000);
      audioBuffer.getChannelData(0).set(audioData);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      currentSourceRef.current = source;

      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.connect(audioContext.destination);
        source.start();
      });

      if (currentSourceRef.current === source) {
        currentSourceRef.current = null;
      }
    }

    isPlayingRef.current = false;
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const handleAudioDelta = useCallback(
    async (base64Audio: string) => {
      // Lazily create the playback AudioContext on first audio delta so it is
      // created after a user gesture (important for Safari / Chrome autoplay policy)
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      }

      try {
        // Decode base64 → Int16 PCM → Float32
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0;
        }

        audioQueueRef.current.push(float32);
        if (!isPlayingRef.current) {
          playAudioQueue();
        }
      } catch (error) {
        console.error("[Voice] Error handling audio delta:", error);
      }
    },
    [playAudioQueue],
  );

  // Hard-stop playback and wipe the queue — called when the user barges in
  const clearAudioPlayback = useCallback(() => {
    // Invalidate any playback loop currently running so it stops pulling
    // from the queue instead of racing this clear
    playbackGenerationRef.current += 1;
    audioQueueRef.current = [];

    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.onended = null;
        currentSourceRef.current.stop();
      } catch (_) {
        // already stopped/ended — ignore
      }
      currentSourceRef.current = null;
    }

    isPlayingRef.current = false;
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // ─── Socket.IO connection ───────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Voice] Connected to voice agent server");
      setState((prev) => ({ ...prev, isConnected: true, error: null }));
    });

    socket.on("disconnect", () => {
      console.log("[Voice] Disconnected from voice agent server");
      setState((prev) => ({ ...prev, isConnected: false, isRecording: false }));
    });

    socket.on("session-started", (data: any) => {
      console.log("[Voice] Session started:", data);
      setState((prev) => ({ ...prev, isConnected: true }));
    });

    socket.on("audio-delta", (data: any) => {
      handleAudioDelta(data.delta);
    });

    // Server tells us the user started talking over the agent — stop
    // whatever's queued/playing right now, don't wait for it to finish.
    socket.on("audio-clear", () => {
      console.log("[Voice] Barge-in — clearing agent audio queue");
      clearAudioPlayback();
    });

    socket.on("transcript-delta", (data: any) => {
      setState((prev) => ({
        ...prev,
        agentTranscript: prev.agentTranscript + data.delta,
      }));
    });

    socket.on("transcript-done", (data: any) => {
      console.log("[Voice] Agent transcript complete:", data.transcript);
      // Reset agentTranscript so next turn starts fresh
      setState((prev) => ({ ...prev, agentTranscript: "" }));
    });

    socket.on("user-transcript", (data: any) => {
      console.log("[Voice] User transcript:", data.transcript);
      setState((prev) => ({ ...prev, transcript: data.transcript }));
    });

    socket.on("speech-started", () => {
      console.log("[Voice] User started speaking");
      setState((prev) => ({ ...prev, isSpeaking: true }));
    });

    socket.on("call-logged", (data: any) => {
      console.log("[Voice] Call logged:", data);
      setState((prev) => ({ ...prev, callLog: data }));
    });

    // Final end-of-call summary (always computed over the FULL transcript
    // server-side). Only fill callLog from it if a mid-call save_call_log
    // hasn't already populated the UI.
   
    socket.on("call-summary", (data: any) => {
      console.log("[Voice] Final call summary:", data);
      setState((prev) => ({ ...prev, callLog: prev.callLog || data }));
    });

    socket.on("recording-saved", (data: any) => {
      console.log("[Voice] Recording saved:", data);
      setState((prev) => ({ ...prev, recordingUrl: data.url }));
    });

    socket.on("realtime-error", (data: any) => {
      console.error("[Voice] Realtime error:", data.error);
      setState((prev) => ({
        ...prev,
        error: data.error?.message || "Unknown error",
      }));
    });

    socket.on("session-closed", () => {
      console.log("[Voice] Session closed");
      // Don't set isConnected to false — the socket is still connected,
      // only the AI session ended. This prevents the "Disconnected" badge.
      setState((prev) => ({ ...prev, isRecording: false }));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [serverUrl, handleAudioDelta, clearAudioPlayback]);

  // ─── Start voice session ────────────────────────────────────────────────────

  const startSession = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("start-session", { carContext });
  }, [carContext]);

  // ─── Microphone capture using ScriptProcessorNode (raw PCM16) ─────────────
  // This replaces the old MediaRecorder approach which used decodeAudioData on
  // incomplete WebM chunks — that is what was causing EncodingError crashes and
  // the AI not receiving any audio after the greeting.

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      // 24 kHz matches OPENAI_INPUT_SAMPLE_RATE on the backend
      const captureContext = new AudioContextClass({ sampleRate: 24000 });
      const source = captureContext.createMediaStreamSource(stream);

      // ScriptProcessorNode: bufferSize 4096, 1 input ch, 1 output ch
      // ~170 ms per chunk at 24 kHz — safe and low-latency
      const processor = captureContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!socketRef.current?.connected) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Encode PCM16 bytes as base64 in chunks to avoid call-stack overflow
        const bytes = new Uint8Array(pcm16.buffer);
        let binary = "";
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(
            ...Array.from(bytes.subarray(i, i + chunkSize)),
          );
        }
        const pcmBase64 = btoa(binary);

        socketRef.current.emit("audio-chunk", { audio: pcmBase64 });
      };

      // Connect graph: microphone → processor → destination (silent output needed
      // by the browser to keep the processor alive)
      source.connect(processor);
      processor.connect(captureContext.destination);

      recorderRef.current = {
        stop: () => {
          try {
            source.disconnect();
            processor.disconnect();
          } catch (_) {}
          if (captureContext.state !== "closed") {
            captureContext.close().catch(() => {});
          }
          stream.getTracks().forEach((t) => t.stop());
        },
      };

      setState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error: any) {
      console.error("[Voice] Error starting recording:", error);
      setState((prev) => ({
        ...prev,
        error:
          error?.name === "NotAllowedError"
            ? "Microphone permission denied — please allow mic access and try again"
            : "Failed to access microphone",
      }));
    }
  }, []);

  // ─── Stop recording ─────────────────────────────────────────────────────────

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
      setState((prev) => ({ ...prev, isRecording: false }));
    }
  }, []);

  // ─── End session ────────────────────────────────────────────────────────────

  const endSession = useCallback(() => {
    stopRecording();
    clearAudioPlayback();
    if (socketRef.current) {
      socketRef.current.emit("end-session");
    }
    setState((prev) => ({
      ...prev,
      agentTranscript: "",
      transcript: "",
      callLog: null,
    }));
  }, [stopRecording, clearAudioPlayback]);

  return {
    ...state,
    startSession,
    startRecording,
    stopRecording,
    endSession,
  };
}
