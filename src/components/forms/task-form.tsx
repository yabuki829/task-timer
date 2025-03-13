import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import { Clock } from 'lucide-react';

interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'timeSpent'>) => void;
    onCancel: () => void;
}

interface PriorityOption {
    value: 'high' | 'medium' | 'low';
    emoji: string;
    label: string;
    color: string;
}

const priorityOptions: PriorityOption[] = [
    { value: 'high', emoji: '🔴', label: '高優先度', color: 'bg-red-400 border-red-200 text-white font-bold' },
    { value: 'medium', emoji: '🟡', label: '中優先度', color: 'bg-yellow-400 border-yellow-200 text-black font-bold' },
    { value: 'low', emoji: '🟢', label: '低優先度', color: 'bg-green-400 border-green-200 text-black font-bold' },
];

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            dueDate,
            priority,
            description: '',
            sessions: [],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">タイトル</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700 p-2"
                />
            </div>

            <div className='flex items-center gap-4'>
                <div>
                    <label className="block text-sm font-medium text-gray-700">期限</label>
                    <div className="mt-1 relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="datetime-local"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="h-10 pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700 p-2"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
                    <div className="flex gap-3">
                        {priorityOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setPriority(option.value)}
                                className={`flex items-center px-4 py-2 rounded-full border transition-all ${priority === option.value
                                    ? `${option.color} border-2 `
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2 text-xl">{option.emoji}</span>
                                <span className="text-sm font-medium">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>


            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md hover:bg-blue-300"
                >
                    保存
                </button>
            </div>
        </form>
    );
}