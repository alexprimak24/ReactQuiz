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

enum quizState {
  Playing,
  Finished,
}

function App() {
  const [questions, setQuestions] = useState<
    Models.DocumentList<Models.Document> | undefined
  >();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [totalAmountOfQuestions, setTotalAmountOfQuestions] = useState(0);
  const [totalAmountOfPoints, setTotalAmountOfPoints] = useState(0);

  const [answer, setAnswer] = useState<string | undefined>();
  const [userAnswer, setUserAnswer] = useState<string | undefined>();
  const [userPoints, setUserPoints] = useState(0);

  const [gameState, setGameState] = useState<quizState>(quizState.Playing);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await appwriteService.getQuestions();
      if (response && response.documents) {
        console.log(response);
        setQuestions(response);
        setAnswer(response.documents[0].answer);
        setTotalAmountOfQuestions(response.total);
        // Calculate total points
        let totalPoints = 0;
        response.documents.forEach((document) => {
          totalPoints += document.points_gives;
        });
        setTotalAmountOfPoints(totalPoints);
      } else {
        console.log("No Questions found");
      }
    };
    fetchPosts();
  }, []);

  console.log(currentQuestion);

  //How I initially wrote it
  // function questionNavigation(moveVector: moveVectorEnum) {
  //   if (currentQuestion + 1 < totalAmountOfQuestions) {
  //     if (userAnswer === answer) {
  //       setUserPoints(
  //         (prev) => prev + questions?.documents[currentQuestion].points_gives
  //       );
  //     }
  //     if (moveVector === moveVectorEnum.Next) {
  //       setCurrentQuestion(currentQuestion + 1);
  //       setAnswer(questions?.documents[currentQuestion + 1].answer);
  //     } else {
  //       setCurrentQuestion(currentQuestion - 1);
  //       setAnswer(questions?.documents[currentQuestion - 1].answer);
  //     }
  //     setUserAnswer(undefined);
  //   } else {
  //     setCurrentQuestion(0);
  //   }
  // }

  //How I optimized it
  function questionNavigation(moveVector: moveVectorEnum) {
    const nextIndex =
      moveVector === moveVectorEnum.Next
        ? currentQuestion + 1
        : currentQuestion - 1;
    if (nextIndex >= 0 && nextIndex < totalAmountOfQuestions) {
      if (userAnswer === answer) {
        setUserPoints(
          (prev) => prev + questions?.documents[currentQuestion].points_gives
        );
      }
      setCurrentQuestion(nextIndex);
      setAnswer(questions?.documents[nextIndex].answer);
      setUserAnswer(undefined);
    } else {
      setGameState(quizState.Finished);
    }
  }

  function handleSubmit() {
    setGameState(quizState.Finished);
  }

  function handleRestart() {
    setGameState(quizState.Playing);
    setCurrentQuestion(0);
  }

  console.log("Users Answer::", userAnswer);
  console.log("Right Answer::", answer);
  return (
    <div className="w-[800px]">
      {gameState === quizState.Playing ? (
        <>
          <Progress
            currentQuestion={currentQuestion + 1}
            maxQuestions={questions?.total}
            currentPoints={userPoints}
            maxPoints={totalAmountOfPoints}
          />
          <Question
            key={questions?.documents[currentQuestion].id}
            questionData={questions?.documents[currentQuestion]}
            setUserAnswer={setUserAnswer}
          />
          <div className="mt-5 flex justify-between items-center">
            <p className="outline outline-[#44CC80] rounded-sm text-center px-5 py-2">
              6:37
            </p>
            <div className="flex gap-2">
              <button onClick={() => questionNavigation(moveVectorEnum.Prev)}>
                Prev
              </button>
              {currentQuestion + 1 < totalAmountOfQuestions ? (
                <button onClick={() => questionNavigation(moveVectorEnum.Next)}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <h1>Thank you for participating</h1>
          <p className="bold underline text-green-300">
            Your score is {userPoints}
          </p>
          <button onClick={handleRestart} className="w-1/2">
            Restart The Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
