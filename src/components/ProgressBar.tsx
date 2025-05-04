
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-teacher-purple">Progress</span>
        <span className="text-sm font-medium text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-teacher-purple to-teacher-blue h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
