import { useEffect, useState } from "react";
import "./App.css";
import Progress from "./components/Progress";
import appwriteService from "./services/appwrite/config";
import { Models } from "appwrite";
import Question from "./components/Question";

enum moveVectorEnum {
  Next,
  Prev,
}

function App() {
  const [questions, setQuestions] = useState<
    Models.DocumentList<Models.Document> | undefined
  >();
  const [currentNumQuestion, setCurrentNumQuestion] = useState(0);
  const [answer, setAnswer] = useState<string | undefined>();
  const [userAnswer, setUserAnswer] = useState<string | undefined>();
  const [totalAmountOfPoints, setTotalAmountOfPoints] = useState(0);

  // const [activeQuestion, setActiveQuestion] =
  //   useState<Models.Document> | undefined();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await appwriteService.getQuestions();
      if (response && response.documents) {
        console.log(response);
        setQuestions(response);
        setAnswer(response.documents[0].answer);
        response.documents.map((document) => {
          setTotalAmountOfPoints((prev) => prev + document.points_gives);
        });
      } else {
        console.log("No Questions found");
      }
    };
    fetchPosts();
  }, []);

  console.log(totalAmountOfPoints);
  function QuestionNavigation(moveVector: moveVectorEnum) {
    if (userAnswer === answer) {
      console.log("arab is right");
    }
    if (moveVector === moveVectorEnum.Next) {
      setCurrentNumQuestion(currentNumQuestion + 1);
      setAnswer(questions?.documents[currentNumQuestion + 1].answer);
    } else {
      setCurrentNumQuestion(currentNumQuestion - 1);
      setAnswer(questions?.documents[currentNumQuestion - 1].answer);
    }
    setUserAnswer(undefined);
  }
  console.log("Users Answer::", userAnswer);
  console.log("Right Answer::", answer);
  return (
    <div className="w-[800px]">
      <Progress
        currentQuestion={currentNumQuestion + 1}
        maxQuestions={questions?.total}
        currentPoints={10}
        maxPoints={totalAmountOfPoints}
      />
      {
        <Question
          key={questions?.documents[currentNumQuestion].id}
          questionData={questions?.documents[currentNumQuestion]}
          setUserAnswer={setUserAnswer}
        />
      }
      {/* {questions?.documents.map((document) => (
        <Question key={document.$id} questionData={document} />
      ))} */}
      <div className="mt-5 flex justify-between items-center">
        <p className="outline outline-[#44CC80] rounded-sm  text-center px-5 py-2">
          6:37
        </p>
        <div className="flex gap-2">
          <button onClick={() => QuestionNavigation(moveVectorEnum.Prev)}>
            Prev
          </button>
          <button onClick={() => QuestionNavigation(moveVectorEnum.Next)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
