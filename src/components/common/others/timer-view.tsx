import React, { useEffect, useRef } from 'react';
import { Timer as TimerType } from '../../../types/tasks';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface TimerProps {
    timer: TimerType;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onDurationChange: (duration: number) => void;
}

export function Timer({ timer, onStart, onPause, onReset, onDurationChange }: TimerProps) {
    const minutes = Math.floor(timer.remainingTime / 60);
    const seconds = timer.remainingTime % 60;
    const progress = (timer.remainingTime / timer.duration) * 100;
    const isLowTime = progress <= 10;
    const circumference = 2 * Math.PI * 120; // radius = 120
    const strokeDashoffset = circumference * ((100 - progress) / 100);
    const progressRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        if (timer.remainingTime === 0 && timer.isRunning) {
            //　ソナーを表示
        }
    }, [timer.remainingTime, timer.isRunning]);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.transition = timer.isRunning ? 'stroke-dashoffset 1s linear' : 'none';
        }
    }, [timer.isRunning]);

    return (
        <div className="bg-[#F5F5F7] p-8 rounded-2xl shadow-lg">
            <div className="text-center">
                <div className="relative w-[280px] h-[280px] mx-auto mb-6">
                    {/* Background circle */}
                    <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 256 256"
                    >
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke="#E5E5EA"
                            strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                            ref={progressRef}
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke={isLowTime ? '#FF3B30' : '#007AFF'}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    {/* Timer display */}
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        role="timer"
                        aria-label={`残り時間 ${minutes}分${seconds}秒`}
                    >
                        <div className="text-6xl text-gray-500 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] tracking-tight">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => onDurationChange(25 * 60)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${timer.duration === 25 * 60
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        25分
                    </button>
                    <button
                        onClick={() => onDurationChange(60 * 60)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${timer.duration === 60 * 60
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        60分
                    </button>
                    <button
                        onClick={() => onDurationChange(90 * 60)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${timer.duration === 90 * 60
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        90分
                    </button>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={timer.isRunning ? onPause : onStart}
                        className={`p-4 rounded-full transition-colors ${timer.isRunning
                            ? 'bg-[#FF3B30] text-white hover:bg-[#FF453A]'
                            : 'bg-[#007AFF] text-white hover:bg-[#0071EB]'
                            }`}
                        aria-label={timer.isRunning ? 'タイマーを一時停止' : 'タイマーを開始'}
                    >
                        {timer.isRunning ? (
                            <Pause className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </button>
                    <button
                        onClick={onReset}
                        className="p-4 rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-200 rounded-full cursor-pointer"
                        aria-label="タイマーをリセット"
                    >
                        <RefreshCw className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}