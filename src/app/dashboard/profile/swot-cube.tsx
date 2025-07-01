'use client';

import React, { useState, useRef, type MouseEvent } from 'react';
import { Lightbulb, Target, TrendingUp, ShieldAlert } from 'lucide-react';
import type { GenerateSwotAnalysisOutput } from '@/app/questionnaire/types';
import { cn } from '@/lib/utils';

interface SwotCubeProps {
  swot: GenerateSwotAnalysisOutput;
}

const CUBE_FACE_SIZE = 160;
const CUBE_TRANSLATE_Z = CUBE_FACE_SIZE / 2;

export function SwotCube({ swot }: SwotCubeProps) {
  const [rotationY, setRotationY] = useState(-30);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const cubeRef = useRef<HTMLDivElement>(null);

  const faces = [
    { title: 'Forças', content: swot.strengths, Icon: Lightbulb, colorClass: 'text-chart-2', rotation: 0 },
    { title: 'Oportunidades', content: swot.opportunities, Icon: TrendingUp, colorClass: 'text-primary', rotation: 90 },
    { title: 'Fraquezas', content: swot.weaknesses, Icon: Target, colorClass: 'text-chart-4', rotation: 180 },
    { title: 'Ameaças', content: swot.threats, Icon: ShieldAlert, colorClass: 'text-destructive', rotation: 270 },
  ];

  const snapToNearestFace = (currentRotation: number) => {
    const nearestAngle = Math.round(currentRotation / 90) * 90;
    
    // To bring a face to the front, the scene must rotate by the negative of the face's angle.
    // So, the target face's angle is the negative of the scene's rotation.
    const targetFaceAngle = -nearestAngle;
    
    const normalizedAngle = (targetFaceAngle % 360 + 360) % 360;
    const newIndex = faces.findIndex(f => f.rotation === normalizedAngle);

    if (newIndex !== -1) {
      setActiveIndex(newIndex);
    }
    setRotationY(nearestAngle);
  };
  
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRotationRef.current = rotationY;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newRotation = startRotationRef.current - deltaX / 2.5; 
    setRotationY(newRotation);
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToNearestFace(rotationY);
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const activeFace = faces[activeIndex];

  return (
    <div className="w-full">
        <div className="grid md:grid-cols-3 gap-4 items-start">
            {/* Left side: Cube and instruction */}
            <div className="md:col-span-1 flex flex-col items-center gap-4">
                <div
                    className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    style={{ height: `${CUBE_FACE_SIZE}px` }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={{ perspective: '800px', width: `${CUBE_FACE_SIZE}px`, height: `${CUBE_FACE_SIZE}px` }}>
                        <div
                            ref={cubeRef}
                            className="relative w-full h-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: `rotateY(${rotationY}deg)`,
                                transition: isDragging ? 'none' : 'transform 0.5s ease-out',
                            }}
                        >
                             {faces.map((face, index) => (
                                <div
                                    key={index}
                                    className="absolute w-full h-full p-4 border bg-card rounded-lg flex flex-col items-center justify-center text-center select-none"
                                    style={{
                                        transform: `rotateY(${face.rotation}deg) translateZ(${CUBE_TRANSLATE_Z}px)`,
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    <face.Icon className={cn("h-8 w-8 mb-2", face.colorClass)} />
                                    <h3 className="font-headline text-lg font-semibold">
                                        {face.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    Clique e arraste o cubo para girar a análise.
                </p>
            </div>

            {/* Right side: Content */}
            <div key={activeIndex} className="md:col-span-2 animate-in fade-in-50 duration-500">
                <div className="p-4 rounded-lg bg-muted/50 border h-full min-h-[210px]">
                    <h3 className={cn("font-headline text-xl flex items-center gap-3 mb-3", activeFace.colorClass)}>
                        <activeFace.Icon className="h-6 w-6" />
                        {activeFace.title}
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[180px] overflow-y-auto pr-2">
                        {activeFace.content}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
