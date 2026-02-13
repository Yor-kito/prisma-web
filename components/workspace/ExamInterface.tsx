"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamQuestion {
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
}

interface ExamInterfaceProps {
    questions: ExamQuestion[];
    onRetake?: () => void;
}

export function ExamInterface({ questions, onRetake }: ExamInterfaceProps) {
    const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleAnswerChange = (questionIndex: number, answer: 'A' | 'B' | 'C' | 'D') => {
        if (!submitted) {
            setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleRetake = () => {
        setAnswers({});
        setSubmitted(false);
        onRetake?.();
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correct++;
        });
        return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
    };

    const score = submitted ? calculateScore() : null;

    if (questions.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                No exam questions available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {submitted && score && (
                <Card className="p-6 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Award className="h-8 w-8 text-primary" />
                            <div>
                                <h3 className="font-semibold text-lg">Exam Results</h3>
                                <p className="text-sm text-muted-foreground">
                                    {score.correct} out of {score.total} correct ({score.percentage}%)
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleRetake} variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake
                        </Button>
                    </div>
                </Card>
            )}

            {questions.map((question, qIndex) => {
                const userAnswer = answers[qIndex];
                const isCorrect = submitted && userAnswer === question.correctAnswer;
                const isIncorrect = submitted && userAnswer && userAnswer !== question.correctAnswer;

                return (
                    <Card key={qIndex} className={cn(
                        "p-6",
                        submitted && isCorrect && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
                        submitted && isIncorrect && "border-red-500/50 bg-red-50/50 dark:bg-red-950/20"
                    )}>
                        <div className="flex gap-3">
                            {submitted && (
                                <div className="flex-shrink-0">
                                    {isCorrect ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : isIncorrect ? (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    ) : (
                                        <div className="h-5 w-5" />
                                    )}
                                </div>
                            )}
                            <div className="flex-1 space-y-4">
                                <p className="font-medium">
                                    {qIndex + 1}. {question.question}
                                </p>

                                <RadioGroup
                                    value={userAnswer}
                                    onValueChange={(value) => handleAnswerChange(qIndex, value as 'A' | 'B' | 'C' | 'D')}
                                    disabled={submitted}
                                >
                                    {(['A', 'B', 'C', 'D'] as const).map((option) => {
                                        const isThisCorrect = submitted && option === question.correctAnswer;
                                        const isThisUserAnswer = submitted && option === userAnswer;

                                        return (
                                            <div
                                                key={option}
                                                className={cn(
                                                    "flex items-center space-x-2 p-3 rounded border",
                                                    submitted && isThisCorrect && "bg-green-100 dark:bg-green-950/30 border-green-500/50",
                                                    submitted && isThisUserAnswer && !isThisCorrect && "bg-red-100 dark:bg-red-950/30 border-red-500/50",
                                                    !submitted && "hover:bg-muted/50"
                                                )}
                                            >
                                                <RadioGroupItem value={option} id={`q${qIndex}-${option}`} />
                                                <Label
                                                    htmlFor={`q${qIndex}-${option}`}
                                                    className="flex-1 cursor-pointer font-normal"
                                                >
                                                    <span className="font-semibold mr-2">{option}.</span>
                                                    {question.options[option]}
                                                </Label>
                                                {submitted && isThisCorrect && (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </RadioGroup>

                                {submitted && isIncorrect && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                                        <p className="text-sm font-semibold mb-1">Explanation:</p>
                                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}

            {!submitted && (
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    disabled={Object.keys(answers).length !== questions.length}
                >
                    Submit Exam
                </Button>
            )}
        </div>
    );
}
