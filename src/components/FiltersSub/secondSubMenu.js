import React, { useEffect, useState } from 'react';
import { BsBrightnessHigh } from 'react-icons/bs';

import { Slider } from './slider';
import { IoIosContrast } from 'react-icons/io';

import { AiOutlineEdit } from 'react-icons/ai';
import Select from 'react-select';

const FontFamilyOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

const FontStyleOptions = [
  { value: 'normal', label: 'normal' },
  { value: 'bold', label: 'bold' },
  { value: 'italic', label: 'italic' },
  { value: 'bold italic', label: 'bold italic' },
];

const TextColorOptions = [
  { value: 'black', label: 'black' },
  { value: 'white', label: 'white' },
  { value: 'red', label: 'red' },
  { value: 'green', label: 'green' },
  { value: 'blue', label: 'blue' },
];

export function SecondSubMenu({
  condition,
  setInputText,
  setBrightnessValue,
  setContrastValue,
  setGrayScaleValue,
  grayScaleValue,
  contrastValue,
  brightnessValue,
  setTextProperties,
  textProperties,
  editingIndex,
}) {
  const [sliderActive, setSliderActive] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [step, setStep] = useState(1);
  const [whatoadjust, setWhatoadjust] = useState('brightnessValue');
  let content;
  useEffect(() => {
    setSliderActive(false);
    setMaxValue(100);
    setMinValue(0);
    setStep(1);
    setWhatoadjust('brightnessValue');
  }, [editingIndex]);
  if (condition === 'adjust') {
    content = (
      <div className="flex justify-center flex-col">
        {sliderActive && (
          <div className="flex">
            <Slider
              minValue={minValue}
              maxValue={maxValue}
              step={step}
              whatoadjust={
                whatoadjust === 'brightnessValue'
                  ? setBrightnessValue
                  : whatoadjust === 'contrastValue'
                  ? setContrastValue
                  : setGrayScaleValue
              }
              currentValue={
                whatoadjust === 'brightnessValue'
                  ? brightnessValue
                  : whatoadjust === 'contrastValue'
                  ? contrastValue
                  : grayScaleValue
              }
            />
            <div className="flex-grow"></div>
          </div>
        )}
        <div className="flex flex-row">
          <button
            className="outline-none bg-gray-200 w-24 h-8 text-xs"
            onClick={() => {
              setMinValue(-1);
              setMaxValue(1);
              setStep(0.1);
              setWhatoadjust('brightnessValue');
              setSliderActive(!sliderActive);
            }}
          >
            <BsBrightnessHigh /> Brightness
          </button>
          <button
            className="outline-none bg-gray-200 w-24 h-8 text-xs"
            onClick={() => {
              setMinValue(-80);
              setMaxValue(80);
              setStep(2);
              setWhatoadjust('contrastValue');
              setSliderActive(!sliderActive);
            }}
          >
            <IoIosContrast /> Contrast
          </button>

          <button
            className="outline-none bg-gray-200 w-24 h-8 text-xs"
            onClick={() => {
              setGrayScaleValue(!grayScaleValue);
              setSliderActive(false);
            }}
          >
            <AiOutlineEdit /> GrayScale
          </button>
        </div>
      </div>
    );
  } else if (condition === 'text') {
    content = (
      <div className="flex justify-center flex-row">
        <input
          className="pl-2 ring-1 ring-[rgba(130,176,77,255)] focus:outline-none"
          type="text"
          placeholder="Search audio file"
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex flex-row text-[12px]">
          <Select
            label="Font Family"
            value={textProperties.fontFamily}
            defaultValue={textProperties.fontFamily}
            onChange={(e) =>
              setTextProperties((prevObje) => ({
                ...prevObje,
                fontFamily: e.value,
              }))
            }
            options={FontFamilyOptions}
            menuPlacement="auto"
            maxMenuHeight={150}
          />
          <Select
            label="Font Style"
            value={textProperties.fontStyle}
            defaultValue={textProperties.fontStyle}
            onChange={(e) =>
              setTextProperties((prevObje) => ({
                ...prevObje,
                fontStyle: e.value,
              }))
            }
            options={FontStyleOptions}
            menuPlacement="auto"
            maxMenuHeight={150}
          />
          <Select
            label="Text Color"
            value={textProperties.fontColor}
            defaultValue={textProperties.fontColor}
            onChange={(e) =>
              setTextProperties((prevObje) => ({
                ...prevObje,
                fontColor: e.value,
              }))
            }
            options={TextColorOptions}
            menuPlacement="auto"
            maxMenuHeight={150}
          />
        </div>
      </div>
    );
  }
  return content;
}
