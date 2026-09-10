import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

export type CallType = 'video' | 'audio';
export type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

export interface CallParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified?: boolean;
}

interface CallContextType {
  status: CallStatus;
  type: CallType | null;
  participant: CallParticipant | null;
  duration: number; // seconds
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeakerOn: boolean;
  showFeedback: boolean;
  feedback: 'like' | 'unlike' | null;
  startCall: (participant: CallParticipant, type: CallType) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
  submitFeedback: (value: 'like' | 'unlike') => void;
  dismissFeedback: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [type, setType] = useState<CallType | null>(null);
  const [participant, setParticipant] = useState<CallParticipant | null>(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'unlike' | null>(null);

  const timerRef = useRef<number | null>(null);
  const callingTimeoutRef = useRef<number | null>(null);

  // Timer for call duration when connected
  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (status === 'idle') {
        setDuration(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const startCall = (p: CallParticipant, callType: CallType) => {
    setParticipant(p);
    setType(callType);
    setStatus('calling');
    setDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    setIsSpeakerOn(callType === 'audio');
    setShowFeedback(false);
    setFeedback(null);

    // Simulate connecting after 1.5s
    callingTimeoutRef.current = window.setTimeout(() => {
      setStatus('connected');
    }, 1500);
  };

  const endCall = () => {
    if (callingTimeoutRef.current) {
      clearTimeout(callingTimeoutRef.current);
      callingTimeoutRef.current = null;
    }
    setStatus('ended');
    // Show feedback after short delay
    setTimeout(() => {
      setShowFeedback(true);
    }, 400);
  };

  const submitFeedback = (value: 'like' | 'unlike') => {
    setFeedback(value);
    // Auto dismiss after 2s and reset to idle
    setTimeout(() => {
      setShowFeedback(false);
      setStatus('idle');
      setParticipant(null);
      setType(null);
      setFeedback(null);
    }, 1400);
  };

  const dismissFeedback = () => {
    setShowFeedback(false);
    setStatus('idle');
    setParticipant(null);
    setType(null);
    setFeedback(null);
  };

  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleCamera = () => setIsCameraOff(prev => !prev);
  const toggleSpeaker = () => setIsSpeakerOn(prev => !prev);

  return (
    <CallContext.Provider
      value={{
        status,
        type,
        participant,
        duration,
        isMuted,
        isCameraOff,
        isSpeakerOn,
        showFeedback,
        feedback,
        startCall,
        endCall,
        toggleMute,
        toggleCamera,
        toggleSpeaker,
        submitFeedback,
        dismissFeedback,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within CallProvider');
  return ctx;
};

export const formatCallDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
