'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task, Timer as TimerType } from '../types/tasks';
import { TaskForm } from '../components/forms/task-form';
import { TaskDetail } from '../components/views/task-detail-view';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '../libs/store';
import { TaskList } from '@/components/views/task-list-view';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate'>('dueDate');
  const [activeTab, setActiveTab] = useState<'incomplete' | 'complete'>('incomplete');
  const [timer, setTimer] = useState<TimerType>({
    duration: 25 * 60,
    isRunning: false,
    remainingTime: 25 * 60,
    startTime: null,
  });

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const calculateSessionDuration = useCallback(() => {
    if (!timer.startTime) return 0;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timer.startTime.getTime()) / 1000);
    return duration;
  }, [timer.startTime]);

  const updateTaskTime = useCallback((taskId: string, duration: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newSession = {
          startTime: timer.startTime!.toISOString(),
          endTime: new Date().toISOString(),
          duration,
        };
        return {
          ...task,
          timeSpent: task.timeSpent + duration,
          sessions: [...task.sessions, newSession],
        };
      }
      return task;
    }));
  }, [tasks, setTasks, timer.startTime]);

  const handleTimerComplete = useCallback(() => {
    if (selectedTask && timer.startTime) {
      const duration = calculateSessionDuration();
      updateTaskTime(selectedTask.id, duration);
    }
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
    }));
  }, [selectedTask, timer.startTime, calculateSessionDuration, updateTaskTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer.isRunning && timer.remainingTime > 0) {
      interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          remainingTime: prev.remainingTime - 1,
        }));
      }, 1000);
    } else if (timer.isRunning && timer.remainingTime === 0) {
      // タイマー終了時の処理
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.remainingTime, handleTimerComplete]);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'status' | 'timeSpent' | 'sessions'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'incomplete',
      timeSpent: 0,
      sessions: [],
    };
    setTasks([...tasks, task]);
    setShowForm(false);
  };

  const handleToggleStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
            ...task,
            status: task.status === 'complete' ? 'incomplete' : 'complete',
            completedAt: task.status === 'incomplete' ? new Date().toISOString() : undefined,
          }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTimerStart = () => {
    setTimer((prev) => ({
      ...prev,
      isRunning: true,
      startTime: new Date(),
    }));
  };

  const handleTimerPause = () => {
    if (selectedTask && timer.startTime) {
      const duration = calculateSessionDuration();
      updateTaskTime(selectedTask.id, duration);
    }
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
    }));
  };

  const handleTimerReset = () => {
    if (selectedTask && timer.isRunning && timer.startTime) {
      const duration = calculateSessionDuration();
      updateTaskTime(selectedTask.id, duration);
    }
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      remainingTime: prev.duration,
      startTime: null,
    }));
  };

  const handleDurationChange = (duration: number) => {
    setTimer({
      duration,
      isRunning: false,
      remainingTime: duration,
      startTime: null,
    });
  };

  const filteredTasks = tasks.filter(task => task.status === activeTab);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });

  if (selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        timer={timer}
        onBack={() => setSelectedTask(null)}
        onTimerStart={handleTimerStart}
        onTimerPause={handleTimerPause}
        onTimerReset={handleTimerReset}
        onTimerDurationChange={handleDurationChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-700">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex justify-end items-center">

            <button
              onClick={() => {
                setShowForm(!showForm);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >

              <Plus className="h-5 w-5 mr-1" />
              {showForm ? '閉じる' : '新規'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : null}

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('incomplete')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'incomplete'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  未完了 ({tasks.filter(t => t.status === 'incomplete').length})
                </button>
                <button
                  onClick={() => setActiveTab('complete')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'complete'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  完了済み ({tasks.filter(t => t.status === 'complete').length})
                </button>
              </nav>
            </div>

            <div className="p-4">
              <TaskList
                tasks={sortedTasks}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onSelect={handleTaskSelect}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
