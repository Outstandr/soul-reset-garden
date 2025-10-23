import { CheckCircle, Circle, Lock } from "lucide-react";

interface Lesson {
  id: string;
  status: "locked" | "available" | "in-progress" | "completed";
}

interface ProgressPathProps {
  lessons: Lesson[];
  currentLesson: number;
}

export const ProgressPath = ({ lessons, currentLesson }: ProgressPathProps) => {
  return (
    <div className="relative bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
      <h3 className="text-2xl font-black text-white mb-8 text-center">Your Journey Map</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-reset-rhythm via-purple-500 to-reset-energy transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${((currentLesson - 1) / (lessons.length - 1)) * 100}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>

        {/* Lesson Nodes */}
        <div className="relative flex justify-between">
          {lessons.map((lesson, index) => {
            const isCompleted = lesson.status === "completed";
            const isInProgress = lesson.status === "in-progress";
            const isLocked = lesson.status === "locked";
            const isCurrent = index + 1 === currentLesson;

            return (
              <div key={lesson.id} className="flex flex-col items-center gap-3 z-10">
                {/* Node Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                    isCompleted
                      ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50"
                      : isInProgress || isCurrent
                      ? "bg-reset-rhythm border-purple-500 shadow-lg shadow-reset-rhythm/50 animate-scale-pulse"
                      : isLocked
                      ? "bg-slate-800 border-slate-700"
                      : "bg-slate-800 border-slate-600 hover:border-reset-rhythm/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isCurrent ? "text-white animate-pulse" : "text-slate-400"}`} />
                  )}
                </div>

                {/* Lesson Number */}
                <span
                  className={`text-sm font-black ${
                    isCompleted || isInProgress || isCurrent
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-reset-rhythm animate-pulse" />
          <span className="text-gray-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-800" />
          <span className="text-gray-400">Locked</span>
        </div>
      </div>
    </div>
  );
};
