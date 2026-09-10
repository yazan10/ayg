import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  name = 'star-rating',
}) => {
  const idRef = React.useId();
  const uniqueName = `${name}-${idRef.replace(/:/g, '')}`;

  const handleChange = (starValue: number) => {
    if (readonly) return;
    onChange?.(starValue);
  };

  return (
    <div className={`star-rating ${size} ${readonly ? 'readonly display' : ''}`}>
      <input
        type="radio"
        id={`${uniqueName}-star-5`}
        name={uniqueName}
        value="5"
        checked={value === 5}
        onChange={() => handleChange(5)}
        disabled={readonly}
      />
      <label htmlFor={`${uniqueName}-star-5`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            pathLength={360}
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          ></path>
        </svg>
      </label>

      <input
        type="radio"
        id={`${uniqueName}-star-4`}
        name={uniqueName}
        value="4"
        checked={value === 4}
        onChange={() => handleChange(4)}
        disabled={readonly}
      />
      <label htmlFor={`${uniqueName}-star-4`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            pathLength={360}
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          ></path>
        </svg>
      </label>

      <input
        type="radio"
        id={`${uniqueName}-star-3`}
        name={uniqueName}
        value="3"
        checked={value === 3}
        onChange={() => handleChange(3)}
        disabled={readonly}
      />
      <label htmlFor={`${uniqueName}-star-3`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            pathLength={360}
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          ></path>
        </svg>
      </label>

      <input
        type="radio"
        id={`${uniqueName}-star-2`}
        name={uniqueName}
        value="2"
        checked={value === 2}
        onChange={() => handleChange(2)}
        disabled={readonly}
      />
      <label htmlFor={`${uniqueName}-star-2`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            pathLength={360}
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          ></path>
        </svg>
      </label>

      <input
        type="radio"
        id={`${uniqueName}-star-1`}
        name={uniqueName}
        value="1"
        checked={value === 1}
        onChange={() => handleChange(1)}
        disabled={readonly}
      />
      <label htmlFor={`${uniqueName}-star-1`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            pathLength={360}
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          ></path>
        </svg>
      </label>
    </div>
  );
};

interface StarDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  rating,
  size = 'sm',
  showValue = true,
}) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5">
      <StarRating value={rounded} readonly size={size} />
      {showValue && (
        <span className="text-xs font-bold text-neutral-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
