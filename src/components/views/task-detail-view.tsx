import React from 'react';
import { Task, Timer as TimerType, TaskSession } from '../../types/tasks';

import { Clock, AlertCircle, ArrowLeft, Watch as Stopwatch, Check, History } from 'lucide-react';
import { Timer } from '../common/others/timer-view';

interface TaskDetailProps {
    task: Task;
    timer: TimerType;
    onBack: () => void;
    onTimerStart: () => void;
    onTimerPause: () => void;
    onTimerReset: () => void;
    onTimerDurationChange: (duration: number) => void;
}

function formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
}

function formatSessionTime(session: TaskSession) {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return `${start.toLocaleTimeString('ja-JP')} - ${end.toLocaleTimeString('ja-JP')} (${formatTimeSpent(session.duration)})`;
}

export function TaskDetail({
    task,
    timer,
    onBack,
    onTimerStart,
    onTimerPause,
    onTimerReset,
    onTimerDurationChange,
}: TaskDetailProps) {
    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    return (
        <div className="min-h-screen  bg-gray-700">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-white   hover:bg-gray-600 rounded-full p-2 m-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />

                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Timer Section */}
                    <div className="border-b border-gray-200">
                        <Timer
                            timer={timer}
                            onStart={onTimerStart}
                            onPause={onTimerPause}
                            onReset={onTimerReset}
                            onDurationChange={onTimerDurationChange}
                        />
                    </div>

                    {/* Task Details */}
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-black mb-2">{task.title}</h1>
                                <p className="text-gray-600 mb-4">{task.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                                {task.priority === 'low' ? '低' : task.priority === 'medium' ? '中' : '高'}
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                期限: {new Date(task.dueDate).toLocaleString('ja-JP')}
                            </div>
                            <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                作成日: {new Date(task.createdAt).toLocaleString('ja-JP')}
                            </div>
                            <div className="flex items-center">
                                <Stopwatch className="h-4 w-4 mr-1" />
                                総作業時間: {formatTimeSpent(task.timeSpent)}
                            </div>
                        </div>

                        {task.completedAt && (
                            <div className="mt-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Check className="h-4 w-4 mr-1" />
                                    完了日時: {new Date(task.completedAt).toLocaleString('ja-JP')}
                                </div>
                            </div>
                        )}

                        {/* Session History */}
                        {task.sessions.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                    <History className="h-5 w-5 mr-2" />
                                    作業履歴
                                </h3>
                                <div className="space-y-2">
                                    {task.sessions.map((session, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                            {formatSessionTime(session)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}