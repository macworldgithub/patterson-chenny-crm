'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface VoiceAgentState {
  isConnected: boolean
  isRecording: boolean
  isPlaying: boolean
  isSpeaking: boolean
  transcript: string
  agentTranscript: string
  error: string | null
  callLog: any | null
  recordingUrl: string | null
}

interface UseVoiceAgentOptions {
  serverUrl?: string
  carContext?: string
}

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const { serverUrl = 'http://localhost:4030', carContext } = options

  const [state, setState] = useState<VoiceAgentState>({
    isConnected: false,
    isRecording: false,
    isPlaying: false,
    isSpeaking: false,
    transcript: '',
    agentTranscript: '',
    error: null,
    callLog: null,
    recordingUrl: null,
  })

  const socketRef = useRef<Socket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioQueueRef = useRef<Float32Array[]>([])
  const isPlayingRef = useRef(false)

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('Connected to voice agent server')
      setState(prev => ({ ...prev, isConnected: true, error: null }))
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from voice agent server')
      setState(prev => ({ ...prev, isConnected: false }))
    })

    socket.on('session-started', (data) => {
      console.log('Session started:', data)
    })

    socket.on('audio-delta', (data) => {
      handleAudioDelta(data.delta)
    })

    socket.on('transcript-delta', (data) => {
      setState(prev => ({ ...prev, agentTranscript: prev.agentTranscript + data.delta }))
    })

    socket.on('transcript-done', (data) => {
      console.log('Agent transcript complete:', data.transcript)
    })

    socket.on('user-transcript', (data) => {
      console.log('User transcript:', data.transcript)
      setState(prev => ({ ...prev, transcript: data.transcript }))
    })

    socket.on('speech-started', () => {
      console.log('User started speaking')
      setState(prev => ({ ...prev, isSpeaking: true }))
    })

    socket.on('call-logged', (data) => {
      console.log('Call logged:', data)
      setState(prev => ({ ...prev, callLog: data }))
    })

    socket.on('recording-saved', (data) => {
      console.log('Recording saved:', data)
      setState(prev => ({ ...prev, recordingUrl: data.url }))
    })

    socket.on('realtime-error', (data) => {
      console.error('Realtime error:', data.error)
      setState(prev => ({ ...prev, error: data.error?.message || 'Unknown error' }))
    })

    socket.on('session-closed', () => {
      console.log('Session closed')
      setState(prev => ({ ...prev, isConnected: false, isRecording: false }))
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [serverUrl])

  // Handle audio delta from ElevenLabs
  const handleAudioDelta = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 })
    }

    try {
      const audioData = base64ToFloat32(base64Audio)
      audioQueueRef.current.push(audioData)

      if (!isPlayingRef.current) {
        playAudioQueue()
      }
    } catch (error) {
      console.error('Error handling audio delta:', error)
    }
  }, [])

  // Play audio queue
  const playAudioQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
      return
    }

    isPlayingRef.current = true
    setState(prev => ({ ...prev, isPlaying: true }))

    const audioContext = audioContextRef.current
    if (!audioContext) return

    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift()
      if (!audioData) continue

      const audioBuffer = audioContext.createBuffer(1, audioData.length, 16000)
      audioBuffer.getChannelData(0).set(audioData)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer

      await new Promise<void>((resolve) => {
        source.onended = () => resolve()
        source.connect(audioContext.destination)
        source.start()
      })
    }

    isPlayingRef.current = false
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  // Convert base64 to Float32Array
  const base64ToFloat32 = (base64: string): Float32Array => {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Convert to 16-bit PCM
    const pcm16 = new Int16Array(bytes.buffer)
    
    // Convert to Float32
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0
    }
    
    return float32
  }

  // Start voice session
  const startSession = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.emit('start-session', { carContext })
  }, [carContext])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketRef.current) {
          const arrayBuffer = await event.data.arrayBuffer()
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
          
          // Convert to PCM16 for OpenAI
          const audioContext = new AudioContext()
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          const pcmData = audioBufferToPCM16(audioBuffer)
          const pcmBase64 = btoa(
            new Uint8Array(pcmData).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
          
          socketRef.current.emit('audio-chunk', { audio: pcmBase64 })
        }
      }
      
      mediaRecorder.start(100) // Send chunks every 100ms
      setState(prev => ({ ...prev, isRecording: true, error: null }))
    } catch (error) {
      console.error('Error starting recording:', error)
      setState(prev => ({ ...prev, error: 'Failed to access microphone' }))
    }
  }, [])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      mediaRecorderRef.current = null
      setState(prev => ({ ...prev, isRecording: false }))
    }
  }, [])

  // End session
  const endSession = useCallback(() => {
    stopRecording()
    if (socketRef.current) {
      socketRef.current.emit('end-session')
    }
  }, [stopRecording])

  // Convert AudioBuffer to PCM16
  const audioBufferToPCM16 = (audioBuffer: AudioBuffer): ArrayBuffer => {
    const numberOfChannels = audioBuffer.numberOfChannels
    const length = audioBuffer.length
    const result = new Int16Array(length * numberOfChannels)
    
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]))
        result[i * numberOfChannels + channel] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
      }
    }
    
    return result.buffer
  }

  return {
    ...state,
    startSession,
    startRecording,
    stopRecording,
    endSession,
  }
}
