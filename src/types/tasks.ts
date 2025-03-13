export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'incomplete' | 'complete';
    createdAt: string;
    completedAt?: string;
    timeSpent: number;
    sessions: TaskSession[];
}

export interface TaskSession {
    startTime: string;
    endTime: string;
    duration: number;
}

export interface Timer {
    duration: number;
    isRunning: boolean;
    remainingTime: number;
    startTime: Date | null;
}