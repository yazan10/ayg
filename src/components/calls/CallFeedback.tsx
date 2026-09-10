import React from 'react';
import { useCall, formatCallDuration } from '../../context/CallContext';
import { Clock, Check } from 'lucide-react';
import './CallFeedback.css';

export const CallFeedback: React.FC = () => {
  const { showFeedback, participant, duration, feedback, submitFeedback, dismissFeedback } = useCall();

  if (!showFeedback || !participant) return null;

  const handleLike = () => {
    submitFeedback('like');
  };

  const handleUnlike = () => {
    submitFeedback('unlike');
  };

  // Show thanks after feedback selected
  if (feedback) {
    return (
      <div className="call-feedback-overlay">
        <div className="call-feedback-card">
          <div className="call-feedback-header">
            <img src={participant.avatar} alt={participant.name} className="call-feedback-avatar" />
            <h3 className="call-feedback-title">شكراً لتقييمك!</h3>
            <p className="call-feedback-subtitle">
              {feedback === 'like' ? 'سعدنا أن المكالمة كانت جيدة 🌟' : 'نأسف لذلك — سنعمل على التحسين'}
            </p>
          </div>

          <div className="call-feedback-thanks">
            <Check className="w-4 h-4" />
            <span>تم حفظ تقييمك بنجاح</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-feedback-overlay" onClick={dismissFeedback}>
      <div className="call-feedback-card" onClick={(e) => e.stopPropagation()}>
        <div className="call-feedback-header">
          <img src={participant.avatar} alt={participant.name} className="call-feedback-avatar" />
          <h3 className="call-feedback-title">كيف كانت تجربتك؟</h3>
          <p className="call-feedback-subtitle">
            مع <strong>{participant.name}</strong> • @{participant.username}
          </p>
          <span className="call-feedback-duration">
            <Clock className="w-3 h-3" />
            {formatCallDuration(duration)}
          </span>
        </div>

        <div className="like-unlike-radio">
          <div>
            <input
              checked={feedback === 'like'}
              id="like"
              name="feedback"
              value="like"
              className="custom-radio-fb"
              type="radio"
              onChange={handleLike}
            />
            <label htmlFor="like" className="feedback-label like-label" onClick={handleLike}>
              <svg
                className="icon"
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.7229 26.5H5.92292V10.9008H0.7229V26.5ZM26.6299 15.2618L24.372 23.7566C23.9989 25.3696 22.5621 26.5 20.9072 26.5H8.52293V10.9278L10.7573 2.87293C10.9669 1.50799 12.1418 0.5 13.524 0.5C15.0699 0.5 16.323 1.7527 16.323 3.29837V10.8998H23.1651C25.4519 10.9009 27.1453 13.0335 26.6299 15.2618Z"
                  fill="currentColor"
                ></path>
              </svg>
              ممتازة
            </label>
          </div>

          <div>
            <input
              name="feedback"
              value="unlike"
              id="unlike"
              className="custom-radio-fb"
              type="radio"
              checked={feedback === 'unlike'}
              onChange={handleUnlike}
            />
            <label htmlFor="unlike" className="feedback-label unlike-label" onClick={handleUnlike}>
              <svg
                className="icon"
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.7229 0.5L21.5229 0.5L21.5229 16.0992L26.7229 16.0992L26.7229 0.5ZM0.815853 11.7382L3.07376 3.24339C3.44687 1.63037 4.88372 0.500027 6.53861 0.500027L18.9229 0.500028L18.9229 16.0722L16.6885 24.1271C16.4789 25.492 15.304 26.5 13.9218 26.5C12.3759 26.5 11.1228 25.2473 11.1228 23.7016L11.1228 16.1002L4.28068 16.1002C1.99391 16.0991 0.300502 13.9664 0.815853 11.7382Z"
                  fill="currentColor"
                ></path>
              </svg>
              سيئة
            </label>
          </div>
        </div>

        <button className="call-feedback-skip" onClick={dismissFeedback}>
          تخطي
        </button>
      </div>
    </div>
  );
};
