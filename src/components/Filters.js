import React, { useState } from 'react';
import { BsWrenchAdjustableCircle, BsCrop } from 'react-icons/bs';
import { BiText } from 'react-icons/bi';
import { SecondSubMenu } from './FiltersSub/secondSubMenu';

function Filter({
  setBrightnessValue,
  setContrastValue,
  setGrayScaleValue,
  setInputText,
  contrastValue,
  brightnessValue,
  grayScaleValue,
  setTextProperties,
  setCropStart,
  cropStart,
  textProperties,
  editingIndex,
}) {
  const [condition, setCondition] = useState('crop');

  return (
    <div className="w-[100%] h-[100%] flex flex-col justify-center">
      <div className="flex-grow" />
      <div className="flex mb-4">
        <div className="flex-grow"></div>
        <SecondSubMenu
          condition={condition}
          setInputText={setInputText}
          setBrightnessValue={setBrightnessValue}
          setContrastValue={setContrastValue}
          setGrayScaleValue={setGrayScaleValue}
          brightnessValue={brightnessValue}
          contrastValue={contrastValue}
          grayScaleValue={grayScaleValue}
          setTextProperties={setTextProperties}
          textProperties={textProperties}
          editingIndex={editingIndex}
        />
        <div className="flex-grow"></div>
      </div>
      <div className="flex-grow" />
      <div className="  flex flex-row">
        <div className="flex-grow"></div>
        <button
          onClick={() => setCondition('adjust')}
          className="pl-4 flex bg-[rgba(130,176,77,255)]"
        >
          <BsWrenchAdjustableCircle />
          Adjust
        </button>
        <button
          onClick={() => setCondition('text')}
          className="pl-4 flex bg-[rgba(130,176,77,255)]"
        >
          <BiText /> Text{' '}
        </button>
        <button
          onClick={() => setCropStart(!cropStart)}
          className="pl-4 flex bg-[rgba(130,176,77,255)]"
        >
          <BsCrop /> Crop{' '}
        </button>
        <div className="flex-grow"></div>
      </div>
    </div>
  );
}

export default Filter;
