import React from 'react';
import { GrPowerReset } from 'react-icons/gr';

export function Slider({
  minValue,
  maxValue,
  step,
  whatoadjust,
  currentValue,
}) {
  return (
    <div className="flex justify-center pb-4">
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={currentValue}
        onChange={(e) => whatoadjust(e.target.value)}
        className="px-2"
      />
      <div className="pl-2"></div>
      <GrPowerReset
        onClick={() => whatoadjust(0)}
        className="ring-[rgba(130,176,77,255)] ring-2"
      />
    </div>
  );
}
