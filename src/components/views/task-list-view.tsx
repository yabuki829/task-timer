import { Clock, Check, Trash2, ChevronRight, Watch as Stopwatch } from 'lucide-react';
import { Task } from '../../types/tasks';

interface TaskListProps {
    tasks: Task[];
    onToggleStatus: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (task: Task) => void;
    sortBy: 'priority' | 'dueDate';
    onSortChange: (sort: 'priority' | 'dueDate') => void;
}

const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
};

function formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
}

export function TaskList({ tasks, onToggleStatus, onDelete, onSelect, sortBy, onSortChange }: TaskListProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => onSortChange('priority')}
                    className={`px-3 py-1 text-sm rounded-md ${sortBy === 'priority' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    優先度順
                </button>
                <button
                    onClick={() => onSortChange('dueDate')}
                    className={`px-3 py-1 text-sm rounded-md ${sortBy === 'dueDate' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    期限順
                </button>
            </div>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-4 rounded-lg border ${task.status === 'complete' ? 'bg-gray-50' : 'bg-white'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 cursor-pointer" onClick={() => onSelect(task)}>
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-lg font-medium ${task.status === 'complete' ? 'line-through text-gray-500' : ''
                                        }`}>
                                        {task.title}
                                    </h3>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                                <div className="mt-2 flex items-center space-x-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {new Date(task.dueDate).toLocaleString('ja-JP')}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                        {task.priority === 'low' ? '低' : task.priority === 'medium' ? '中' : '高'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Stopwatch className="h-4 w-4 mr-1" />
                                        {formatTimeSpent(task.timeSpent)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onToggleStatus(task.id)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <Check className={`h-5 w-5 ${task.status === 'complete' ? 'text-green-500' : ''}`} />
                                </button>
                                <button
                                    onClick={() => onDelete(task.id)}
                                    className="p-2 text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}