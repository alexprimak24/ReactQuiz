import { useEffect, useState } from "react";
import "./App.css";
import Progress from "./components/Progress";
import appwriteService from "./services/appwrite/config";
import { Models } from "appwrite";
import Question from "./components/Question";
import { useTimer } from "react-timer-hook";

enum MoveVectorEnum {
  Next,
  Prev,
}

enum QuizState {
  Playing,
  Finished,
}

function App() {
  const TIMER = 300; //constant for current timer 5 mins
  const [questions, setQuestions] = useState<
    Models.DocumentList<Models.Document> | undefined
  >();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [totalAmountOfQuestions, setTotalAmountOfQuestions] = useState(0);
  const [totalAmountOfPoints, setTotalAmountOfPoints] = useState(0);

  const [answer, setAnswer] = useState<string | undefined>();
  const [userAnswer, setUserAnswer] = useState<string | undefined>();
  const [userPoints, setUserPoints] = useState(0);

  const [gameState, setGameState] = useState<QuizState>(QuizState.Playing);
  //initialized timer on page load
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + TIMER);
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => handleSubmit(),
  });

  useEffect(() => {
    //fetching questions from Appwrite
    const fetchQuestions = async () => {
      //get questions from appwrite
      //response returns: document - questions itself and total - total number of questions
      const response = await appwriteService.getQuestions();
      //if questions exist
      if (response && response.documents) {
        //set the questions to setQuestions
        setQuestions(response);
        //get the answer for the first question and set it once the page loads
        setAnswer(response.documents[0].answer);
        //set the total amount of questions
        setTotalAmountOfQuestions(response.total);
        // Calculate total points and save it to totalPoints
        let totalPoints = 0;
        //forEach is used as we are not manipulating data, just reading it
        response.documents.forEach((document) => {
          totalPoints += document.points_gives;
        });
        //once we finished with forEach => we totalPoints to setTotalAmountOfPoints
        setTotalAmountOfPoints(totalPoints);
      } else {
        console.log("No Questions found");
      }
    };
    fetchQuestions();
  }, []);

  //How I initially wrote it
  // function questionNavigation(moveVector: MoveVectorEnum) {
  //   if (currentQuestion + 1 < totalAmountOfQuestions) {
  //     if (userAnswer === answer) {
  //       setUserPoints(
  //         (prev) => prev + questions?.documents[currentQuestion].points_gives
  //       );
  //     }
  //     if (moveVector === MoveVectorEnum.Next) {
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
  function questionNavigation(moveVector: MoveVectorEnum) {
    //get nextIndex based on which button has been set -> next sets MoveVectorEnum.Next
    const nextIndex =
      moveVector === MoveVectorEnum.Next
        ? currentQuestion + 1
        : currentQuestion - 1;
    //in case next question is in range of existing question
    if (nextIndex >= 0 && nextIndex < totalAmountOfQuestions) {
      //in case user answers right
      if (userAnswer === answer) {
        //give him points for that question
        setUserPoints(
          (prev) => prev + questions?.documents[currentQuestion].points_gives
        );
      }
      //set next question
      setCurrentQuestion(nextIndex);
      //set answer for next question
      setAnswer(questions?.documents[nextIndex].answer);
      //set user answer to undefined - so it hasn't chosen anything atm
      setUserAnswer(undefined);
    } else {
      //in any other case - finish the game
      setGameState(QuizState.Finished);
    }
  }

  function handleSubmit() {
    setGameState(QuizState.Finished);
  }

  function handleRestart() {
    //setGameState again to Playing
    setGameState(QuizState.Playing);
    //setCurrentQuestion to the first question
    setCurrentQuestion(0);
    //get currentTime
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + TIMER);
    //restart the timer and add a new timer
    restart(newExpiryTimestamp);
  }

  return (
    <div className="w-[800px]">
      {gameState === QuizState.Playing ? (
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
            <div className="outline outline-[#44CC80] rounded-sm text-center px-5 py-2">
              Time left: {minutes} : {seconds}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => questionNavigation(MoveVectorEnum.Prev)}
                disabled={currentQuestion === 0}
              >
                Prev
              </button>
              {currentQuestion + 1 < totalAmountOfQuestions ? (
                <button onClick={() => questionNavigation(MoveVectorEnum.Next)}>
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
