"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
    front: string;
    back: string;
}

interface FlashcardCarouselProps {
    cards: Flashcard[];
}

export function FlashcardCarousel({ cards }: FlashcardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const card = cards[currentIndex];

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full h-64 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={cn(
                    "relative w-full h-full transition-all duration-500 transform-style-3d", // Add transform-style-3d once we configure TW properly or use style
                    isFlipped ? "rotate-y-180" : ""
                )} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    {/* Front */}
                    <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-background border-primary/20">
                        <CardContent className="text-center font-medium text-lg">
                            <span className="text-muted-foreground text-xs uppercase block mb-4">Question</span>
                            {card.front}
                        </CardContent>
                    </Card>

                    {/* Back */}
                    <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-primary text-primary-foreground transform rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
                        <CardContent className="text-center font-medium text-lg">
                            <span className="text-primary-foreground/70 text-xs uppercase block mb-4">Answer</span>
                            {card.back}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>{currentIndex + 1} / {cards.length}</span>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground animate-pulse">Tap card to flip</p>
        </div>
    );
}
