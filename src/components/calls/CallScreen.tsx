import React from 'react';
import { useCall, formatCallDuration } from '../../context/CallContext';
import { useStore } from '../../context/StoreContext';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import './CallScreen.css';

export const CallScreen: React.FC = () => {
  const {
    status,
    type,
    participant,
    duration,
    isMuted,
    isCameraOff,
    isSpeakerOn,
    endCall,
    toggleMute,
    toggleCamera,
    toggleSpeaker,
  } = useCall();

  const { currentUser } = useStore();

  if (status === 'idle' || !participant || !type) return null;

  const isVideo = type === 'video';

  return (
    <div className="call-screen-overlay">
      <div className={`call-screen-container ${isVideo ? 'video' : 'audio'}`}>
        {/* Background Video/Image */}
        {isVideo ? (
          <>
            <img
              src={participant.avatar}
              alt={participant.name}
              className="call-video-bg"
              style={{ filter: isCameraOff ? 'blur(20px) brightness(0.5)' : undefined }}
            />
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={participant.avatar}
              className="call-video-bg"
              style={{ display: isCameraOff ? 'none' : 'block', opacity: 0.3 }}
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            </video>
            <div className="call-video-overlay"></div>
          </>
        ) : null}

        {/* Header */}
        <div className="call-header">
          <div className="call-status-badge">
            <span className={`call-status-dot ${status === 'calling' ? 'calling' : ''}`}></span>
            <span>
              {status === 'calling'
                ? isVideo
                  ? 'جاري الاتصال بالفيديو...'
                  : 'جاري الاتصال...'
                : status === 'connected'
                  ? isVideo
                    ? 'مكالمة فيديو'
                    : 'مكالمة صوتية'
                  : 'انتهت المكالمة'}
            </span>
          </div>

          <div className="call-participant-info">
            <img
              src={participant.avatar}
              alt={participant.name}
              className={`call-avatar ${!isVideo ? 'audio-large' : ''}`}
            />
            <div className="call-name">
              <span>{participant.name}</span>
              {participant.verified && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              )}
            </div>
            <span className="call-username">@{participant.username}</span>
            {status === 'connected' && (
              <span className="call-duration">{formatCallDuration(duration)}</span>
            )}
            {status === 'calling' && (
              <span className="call-duration" style={{ background: 'rgba(245, 158, 11, 0.9)' }}>يتم الاتصال...</span>
            )}
          </div>
        </div>

        {/* Audio Visual for audio calls */}
        {!isVideo && status === 'connected' && (
          <div className="call-audio-visual">
            <div className="call-audio-waves">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {!isVideo && status === 'calling' && (
          <div className="call-audio-visual">
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontFamily: 'Tajawal, sans-serif' }}>يرن...</p>
          </div>
        )}

        {/* PiP for video */}
        {isVideo && (
          <div className={`call-pip ${isCameraOff ? 'camera-off' : ''}`}>
            {isCameraOff ? (
              <VideoOff className="w-6 h-6" />
            ) : (
              <img src={currentUser.avatar} alt="You" />
            )}
          </div>
        )}

        {/* Controls */}
        <div className="call-controls">
          <button
            onClick={toggleMute}
            className={`call-control-btn mute ${isMuted ? 'active' : ''}`}
            title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {isVideo ? (
            <button
              onClick={toggleCamera}
              className={`call-control-btn camera ${isCameraOff ? 'off' : ''}`}
              title={isCameraOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          ) : (
            <button
              onClick={toggleSpeaker}
              className={`call-control-btn speaker ${isSpeakerOn ? 'active' : ''}`}
              title={isSpeakerOn ? 'إيقاف المكبر' : 'تشغيل المكبر'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}

          <button onClick={endCall} className="call-control-btn end" title="إنهاء المكالمة">
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
