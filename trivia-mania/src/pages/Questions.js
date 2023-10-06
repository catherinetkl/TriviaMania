import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { handleScoreChange } from "../redux/actions/quizActions";
import styles from "./Questions.module.css";

const Questions = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let apiUrl = `/api.php?amount=${amount_of_question}`;
  if (question_category) {
    apiUrl = apiUrl.concat(`&category=${question_category}`);
  }
  if (question_difficulty) {
    apiUrl = apiUrl.concat(`&difficulty=${question_difficulty}`);
  }
  if (question_type) {
    apiUrl = apiUrl.concat(`&type=${question_type}`);
  }

  const { response, loading } = useAxios({ url: apiUrl });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (response?.results.length) {
      const question = response.results[questionIndex];
      let answers = [question.correct_answer, ...question.incorrect_answers];
      answers = shuffleArray(answers); // Shuffle the answers randomly
      setOptions(answers);
    }
  }, [response, questionIndex]);

  if (loading) {
    return (
      <Box mt={20}>
        <CircularProgress />
      </Box>
    );
  }

  const handleClickAnswer = (e) => {
    const question = response.results[questionIndex];
    const selectedAnswer = e.target.textContent;

    if (selectedAnswer === question.correct_answer) {
      // Check if the selected answer is correct
      dispatch(handleScoreChange(score + 1));
    }

    if (questionIndex + 1 < response.results.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      navigate("/score");
    }
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <Box className={styles.questionContainer}>
      <Typography variant="h4" className={styles.questionHeader}>
        Questions {questionIndex + 1}
      </Typography>
      <Typography className={styles.questionText}>
        {decode(response.results[questionIndex].question)}
      </Typography>
      <div className={styles.answerOptions}>
        {options.map((data, id) => (
          <Button
            key={id}
            onClick={handleClickAnswer}
            variant="contained"
            className={styles.answerButton}
          >
            {decode(data)}
          </Button>
        ))}
      </div>
      <Typography mt={5}>
        Score: {score} / {response.results.length}
      </Typography>
    </Box>
  );
};

export default Questions;