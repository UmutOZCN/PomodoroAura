import React from 'react';


type Props = {
  percent: number; 
};

const STROKE_WIDTH = 12; 
const RADIUS = 130; 
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; 

export const CircularProgress: React.FC<Props> = ({ percent }) => {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <svg 
      className="progress-ring" 
      width="300" 
      height="300" 
      viewBox="0 0 300 300"
    >
      <g transform="rotate(-90 150 150)">
        <circle
          className="progress-ring__track"
          cx="150"
          cy="150"
          r={RADIUS}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
        />
        
        <circle
          className="progress-ring__bar"
          cx="150"
          cy="150"
          r={RADIUS}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset} 
          strokeLinecap="round" 
        />
      </g>
    </svg>
  );
};