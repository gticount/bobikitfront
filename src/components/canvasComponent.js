import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Image, Transformer, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Filter from './Filters';
import { dataURItoBlob } from './utilities';
const defaultText = {
  fontFamily: 'Arial',
  fontStyle: 'normal',
  fontColor: 'black',
};

function CanvasComponent({
  editingIndex,
  uploadedImages,
  setCurrentAction,
  setEditedImages,
  submitbutton,
}) {
  const [brightnessValue, setBrightnessValue] = useState(0);
  const [contrastValue, setContrastValue] = useState(0);
  const [grayScaleValue, SetGrayScaleValue] = useState(false);
  const [textProperties, setTextProperties] = useState(defaultText);
  const [cropStart, setCropStart] = useState(false);

  const [inputText, setInputText] = useState('');

  const [editingImage, setEditingImage] = useState(false);
  const [image] = useImage(editingImage);

  const imageRef = useRef();
  const textRef = useRef();
  const imageTransformerRef = useRef();
  const textTransformerRef = useRef();
  const stageRef = useRef();
  const rectRef = useRef();
  const rectTransformerRef = useRef();
  const layerRef = useRef();

  useEffect(() => {
    setBrightnessValue(0);
    setContrastValue(0);
    SetGrayScaleValue(false);
    setTextProperties(defaultText);
    setCropStart(false);
    setInputText('');
  }, [editingIndex]);

  useEffect(() => {
    if (image) {
      imageRef.current.cache();
      stageRef.current.batchDraw();
    }
  }, [
    image,
    brightnessValue,
    contrastValue,
    grayScaleValue,
    cropStart,
    inputText,
  ]);

  useEffect(() => {
    if (uploadedImages[editingIndex]) {
      const imageUrl = URL.createObjectURL(uploadedImages[editingIndex]);
      setEditingImage(imageUrl);
    }
  }, [uploadedImages, editingIndex]);

  useEffect(() => {
    if (cropStart) {
      layerRef.current.batchDraw();
      rectRef.current.show();

      rectRef.current.setWidth(
        imageRef.current.attrs.image.width * imageRef.current.attrs.scaleX,
      );
      rectRef.current.setHeight(
        imageRef.current.attrs.image.height * imageRef.current.attrs.scaleY,
      );
      rectRef.current.setX(imageRef.current.attrs.x);
      rectRef.current.setY(imageRef.current.attrs.y);
    } else {
      if (rectRef.current.isVisible()) {
        const crop = {
          x: rectRef.current.attrs.x,
          y: rectRef.current.attrs.y,
          width: rectRef.current.attrs.scaleX * rectRef.current.attrs.width,
          height: rectRef.current.attrs.scaleY * rectRef.current.attrs.height,
        };
        imageRef.current.crop(crop);
        imageRef.current.getLayer().batchDraw();
        rectRef.current.hide();
      }
    }
  }, [cropStart]);

  return (
    <div className="flex flex-row width-[100%] h-[100%]">
      <Stage
        className="ring-1 ring-[rgba(130,176,77,255)]"
        ref={stageRef}
        width={600}
        height={700}
        onClick={(e) => {
          if (e.target === stageRef.current) {
            imageTransformerRef.current.detach();
            textTransformerRef.current.detach();
            imageTransformerRef.current.hide();
            textTransformerRef.current.hide();
            rectTransformerRef.current.hide();
          }
        }}
      >
        <Layer ref={layerRef}>
          <Image
            ref={imageRef}
            x={5}
            y={5}
            scaleX={0.6}
            scaleY={0.6}
            image={image}
            filters={
              grayScaleValue
                ? [Konva.Filters.Grayscale]
                : [Konva.Filters.Brighten, Konva.Filters.Contrast]
            }
            brightness={brightnessValue * 1}
            contrast={contrastValue * 1}
            onMouseDown={(e) => {
              imageTransformerRef.current.nodes([e.currentTarget]);
            }}
            onClick={(e) => {
              imageTransformerRef.current.show();
              imageTransformerRef.current.nodes([e.currentTarget]);
            }}
            onMouseUp={(e) => {
              imageTransformerRef.current.hide();
              imageTransformerRef.current.detach();
            }}
            transformable
            draggable
            // ... other image properties
          />
          <Rect
            ref={rectRef}
            x={100}
            y={100}
            width={200}
            height={150}
            stroke="black"
            strokeWidth={1}
            fill="transparent"
            visible={false}
            onMouseDown={(e) => {
              rectTransformerRef.current.nodes([e.currentTarget]);
            }}
            onClick={(e) => {
              rectTransformerRef.current.show();
              rectTransformerRef.current.nodes([e.currentTarget]);
            }}
            onMouseUp={(e) => {
              rectTransformerRef.current.hide();
              rectTransformerRef.current.detach();
            }}
            transformable
            draggable
          />
          <Transformer visible={false} ref={imageTransformerRef} />
          <Transformer visible={false} ref={rectTransformerRef} />
        </Layer>

        <Layer>
          <Text
            text={inputText}
            ref={textRef}
            x={100}
            y={100}
            transformable
            draggable
            fontFamily={textProperties.fontFamily}
            fontStyle={textProperties.fontStyle}
            fill={textProperties.fontColor}
            onMouseDown={(e) => {
              textTransformerRef.current.show();
              textTransformerRef.current.nodes([e.currentTarget]);
            }}
            onClick={(e) => {
              textTransformerRef.current.show();
              textTransformerRef.current.nodes([e.currentTarget]);
            }}
            onMouseUp={(e) => {
              textTransformerRef.current.hide();
              textTransformerRef.current.detach();
            }}
          />
          <Transformer visible={false} ref={textTransformerRef} />
        </Layer>
      </Stage>
      <div className="flex-col">
        <div className="pt-8 object-right-top h-[30%] w-[100%] justify-center">
          <Filter
            setBrightnessValue={setBrightnessValue}
            setContrastValue={setContrastValue}
            setGrayScaleValue={SetGrayScaleValue}
            brightnessValue={brightnessValue}
            contrastValue={contrastValue}
            grayScaleValue={grayScaleValue}
            setInputText={setInputText}
            setTextProperties={setTextProperties}
            setCropStart={setCropStart}
            cropStart={cropStart}
            textProperties={textProperties}
            editingIndex={editingIndex}
          />
        </div>

        <div className="py-[4rem]">
          <button
            onClick={async () => {
              const blob = await dataURItoBlob(
                stageRef.current.toDataURL(),
                editingIndex,
              );
              setEditedImages((prev) => [...prev, blob]);
              setCurrentAction('next');
            }}
            className={`ring-1 text-white bg-[rgba(130,176,77,255)]`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CanvasComponent;
