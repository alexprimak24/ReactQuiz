import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

interface ProgressProps {
  currentQuestion: number;
  maxQuestions: number | undefined;
  currentPoints: number;
  maxPoints: number;
}
function Progress({
  currentQuestion,
  maxQuestions,
  currentPoints,
  maxPoints,
}: ProgressProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      <ProgressBar
        width="800px"
        height="30px"
        completed={currentQuestion.toString()}
        maxCompleted={maxQuestions}
        bgColor="#44CC80"
        baseBgColor="#000"
      />
      <div className="w-full flex justify-between">
        <div className="">
          Question
          <span> {currentQuestion} / </span>
          <span>{maxQuestions}</span>
        </div>
        <div className="">
          Points
          <span> {currentPoints} / </span>
          <span>{maxPoints}</span>
        </div>
      </div>
    </div>
  );
}

export default Progress;
