import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Set {
    weight: string;
    reps: string;
    completed: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    date: string;
    duration: number; // in seconds
    exercises: Exercise[];
    templateName?: string;
}

export interface ProgressEntry {
    id: string;
    date: string;
    weight: string;
    waist: string;
    chest: string;
    hips: string;
    photoUri?: string;
}

interface WorkoutContextType {
    history: Workout[];
    addWorkout: (workout: Workout) => void;
    progressLogs: ProgressEntry[];
    addProgressEntry: (entry: ProgressEntry) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<Workout[]>([]);
    const [progressLogs, setProgressLogs] = useState<ProgressEntry[]>([]);

    const addWorkout = (workout: Workout) => {
        setHistory((prev) => [workout, ...prev]);
    };

    const addProgressEntry = (entry: ProgressEntry) => {
        setProgressLogs((prev) => [entry, ...prev]);
    };

    return (
        <WorkoutContext.Provider value={{ history, addWorkout, progressLogs, addProgressEntry }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
}
