import React, { useState } from 'react';
import { Task } from '../../types/tasks';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'timeSpent'>) => void;
    onCancel: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            dueDate,
            priority,
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
                    className="mt-1 h-10 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md  border border-gray-300 shadow-sm sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">期限</label>
                    <div className="mt-1 relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="datetime-local"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="h-10 pl-10 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm text-gray-700"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">優先度</label>
                    <div className="mt-1 relative">
                        <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                            className="h-10 pl-10 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm text-gray-700"
                        >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                    保存
                </button>
            </div>
        </form>
    );
}