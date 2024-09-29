import React from "react";
import { Models } from "appwrite";
// interface QuestionProps {
//   question: number;
//   maxQuestions: number;
//   currentPoints: number;
//   maxPoints: number;
// }

interface QuestionProps {
  questionData: Models.Document | undefined;
  setUserAnswer: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function Question({ questionData, setUserAnswer }: QuestionProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      <h2 className="">{questionData?.question}</h2>
      <button onClick={() => setUserAnswer(questionData?.variant_1)}>
        {questionData?.variant_1}
      </button>
      <button onClick={() => setUserAnswer(questionData?.variant_2)}>
        {questionData?.variant_2}
      </button>
      <button onClick={() => setUserAnswer(questionData?.variant_3)}>
        {questionData?.variant_3}
      </button>
      <button onClick={() => setUserAnswer(questionData?.variant_4)}>
        {questionData?.variant_4}
      </button>
    </div>
  );
}

export default Question;
