"use client";

import { useEffect, useState } from "react";

interface StudyProgress {
    currentDocument: string | null;
    lastPosition: number;
    completedSections: string[];
    bookmarks: { page: number; note: string }[];
}

export function useStudyProgress(documentId: string) {
    const [progress, setProgress] = useState<StudyProgress>({
        currentDocument: null,
        lastPosition: 0,
        completedSections: [],
        bookmarks: [],
    });

    useEffect(() => {
        if (documentId) {
            const saved = localStorage.getItem(`progress-${documentId}`);
            if (saved) {
                setProgress(JSON.parse(saved));
            }
        }
    }, [documentId]);

    const saveProgress = (updates: Partial<StudyProgress>) => {
        const newProgress = { ...progress, ...updates };
        localStorage.setItem(`progress-${documentId}`, JSON.stringify(newProgress));
        setProgress(newProgress);
    };

    const markSectionComplete = (sectionId: string) => {
        const completedSections = [...progress.completedSections, sectionId];
        saveProgress({ completedSections });

        // Award points for gamification
        awardPoints(10, "Sección completada");
    };

    const addBookmark = (page: number, note: string) => {
        const bookmarks = [...progress.bookmarks, { page, note }];
        saveProgress({ bookmarks });
    };

    const updatePosition = (position: number) => {
        saveProgress({ lastPosition: position });
    };

    return {
        progress,
        saveProgress,
        markSectionComplete,
        addBookmark,
        updatePosition,
    };
}

// Gamification helper
export function awardPoints(points: number, reason: string) {
    const gamification = JSON.parse(
        localStorage.getItem("prisma-gamification") ||
        '{"points":0,"level":1,"streak":0,"achievements":[]}'
    );

    gamification.points += points;

    // Level up logic
    const pointsPerLevel = 100;
    const newLevel = Math.floor(gamification.points / pointsPerLevel) + 1;
    if (newLevel > gamification.level) {
        gamification.level = newLevel;
        // Show level up notification
        console.log(`🎉 ¡Subiste al nivel ${newLevel}!`);
    }

    localStorage.setItem("prisma-gamification", JSON.stringify(gamification));

    // Update stats
    updateStats(reason);
}

// Stats helper
export function updateStats(action: string) {
    const stats = JSON.parse(
        localStorage.getItem("prisma-stats") ||
        '{"documentsUploaded":0,"chatMessages":0,"summariesGenerated":0,"podcastsCreated":0,"flashcardsCreated":0,"examsCompleted":0,"studyTime":0,"streak":0}'
    );

    switch (action) {
        case "document-uploaded":
            stats.documentsUploaded++;
            awardPoints(20, "Documento subido");
            break;
        case "chat-message":
            stats.chatMessages++;
            if (stats.chatMessages % 10 === 0) awardPoints(5, "10 mensajes");
            break;
        case "summary-generated":
            stats.summariesGenerated++;
            awardPoints(15, "Resumen generado");
            break;
        case "podcast-created":
            stats.podcastsCreated++;
            awardPoints(25, "Podcast creado");
            break;
        case "flashcard-created":
            stats.flashcardsCreated++;
            awardPoints(10, "Flashcard creada");
            break;
        case "exam-completed":
            stats.examsCompleted++;
            awardPoints(30, "Examen completado");
            break;
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("last-active-date");

    if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive === yesterday.toDateString()) {
            stats.streak++;
        } else {
            stats.streak = 1;
        }

        localStorage.setItem("last-active-date", today);
    }

    localStorage.setItem("prisma-stats", JSON.stringify(stats));
}
