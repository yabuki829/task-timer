import { useState, useEffect } from 'react';
import { Task } from '../types/tasks';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsedItem = JSON.parse(item);

                // データマイグレーション: タスクの場合、必要なフィールドを追加
                if (key === 'tasks') {
                    return (parsedItem as Task[]).map(task => ({
                        ...task,
                        timeSpent: task.timeSpent ?? 0,
                        sessions: task.sessions ?? [],
                        completedAt: task.completedAt ?? (task.status === 'complete' ? task.createdAt : undefined)
                    }));
                }

                return parsedItem;
            }
            return initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}