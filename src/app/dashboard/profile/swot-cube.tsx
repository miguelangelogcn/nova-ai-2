'use client';

import React, { useState, useRef, type MouseEvent } from 'react';
import { Lightbulb, Target, TrendingUp, ShieldAlert } from 'lucide-react';
import type { GenerateSwotAnalysisOutput } from '@/app/questionnaire/types';
import { cn } from '@/lib/utils';

interface SwotCubeProps {
  swot: GenerateSwotAnalysisOutput;
}

const CUBE_FACE_SIZE = 320; // in pixels
const CUBE_TRANSLATE_Z = CUBE_FACE_SIZE / 2;

export function SwotCube({ swot }: SwotCubeProps) {
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const cubeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRotationRef.current = rotationY;
    if (cubeRef.current) {
      cubeRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newRotation = startRotationRef.current + deltaX / 2.5; // Adjust sensitivity
    setRotationY(newRotation);
  };
  
  const snapToNearestFace = (currentRotation: number) => {
    const nearestAngle = Math.round(currentRotation / 90) * 90;
    setRotationY(nearestAngle);
  }

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cubeRef.current) {
      cubeRef.current.style.transition = 'transform 0.5s ease-out';
    }
    snapToNearestFace(rotationY);
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const faces = [
    {
      title: 'Forças',
      content: swot.strengths,
      Icon: Lightbulb,
      colorClass: 'text-chart-2',
      rotation: 0,
    },
    {
      title: 'Oportunidades',
      content: swot.opportunities,
      Icon: TrendingUp,
      colorClass: 'text-primary',
      rotation: 90,
    },
    {
      title: 'Fraquezas',
      content: swot.weaknesses,
      Icon: Target,
      colorClass: 'text-chart-4',
      rotation: 180,
    },
    {
      title: 'Ameaças',
      content: swot.threats,
      Icon: ShieldAlert,
      colorClass: 'text-destructive',
      rotation: -90,
    },
  ];

  return (
    <div
      className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{ 
            perspective: '1200px', 
            width: `${CUBE_FACE_SIZE}px`, 
            height: `${CUBE_FACE_SIZE}px` 
        }}
        >
        <div
          ref={cubeRef}
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationY}deg)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          {faces.map((face, index) => (
            <div
              key={index}
              className="absolute w-full h-full p-6 border bg-card rounded-lg flex flex-col items-start overflow-y-auto"
              style={{
                transform: `rotateY(${face.rotation}deg) translateZ(${CUBE_TRANSLATE_Z}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <h3 className={cn("font-headline text-2xl flex items-center gap-3 mb-3", face.colorClass)}>
                <face.Icon className="h-7 w-7" />
                {face.title}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {face.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Clique e arraste para girar a análise.
      </p>
    </div>
  );
}
