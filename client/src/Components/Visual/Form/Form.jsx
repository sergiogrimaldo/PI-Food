import React, { useState } from "react";
import { postRecipe } from "../../Redux/actions";
import { useDispatch } from "react-redux";
import useDiets from "../../Custom Hooks/useDiets";
import FormContainer from "./FormContainer";
import ThanksForm from "./ThanksForm";
import "./Form.css";


const Form = () => {
  const dispatch = useDispatch();
  const dietsLoaded = useDiets(); //gets diets on mount
  const [done, setDone] = useState(false);
  const [danger, setDanger] = useState(false);
  let dietList = {};
  const stepModel = ["", ""];
  const initialState = {
    name: "",
    summary: "",
    score: 0,
    healthScore: 0,
    steps: ["", []],
    diets: [],
  };
  const [submission, setSubmission] = useState({ ...initialState });
  const [part, setPart] = useState(["", [[...stepModel]]]);

  dietsLoaded && dietsLoaded.forEach((diet) => {dietList[diet.name] = false;}); //prettier-ignore

  const addStep = () => {
    let step = [...part];
    step[1].push([...stepModel]);
    setPart(step);
  };
  

  const removeStep = () => {
    let step = [...part];
    if (step[1].length > 1) {
      step[1].pop();
    }
    setPart(step);
  };

  const handleInstrucctions = (e) => {
    let { value, name, id } = e.target;
    let step = [...part];
    if (name === "Title") {
      step[0] = value;
    } else {
      let num = Number(id) + 1;
      step[1][id] = [num.toString(), value];
    }
    setPart([...step]);
  };

  const handleSubmissionChange = (e) => {
    setSubmission({ ...submission, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    dietList[name] = checked;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submission.name === "" || submission.summary === "")return setDanger(true); //prettier-ignore
    Object.entries(dietList).map((e) => e[1] && submission.diets.push(e[0]));
    submission.steps = [[...part]];
    dispatch(postRecipe(submission));
    setDone(true);
    setDanger(false);
    setSubmission({ ...initialState });
    setPart(["", [[...stepModel]]]);
  };

  return (
    <div>
      {done ? (
        <ThanksForm setDone={setDone}/>
      ) : (
        <FormContainer 
        handleSubmit={handleSubmit}
        handleSubmissionChange={handleSubmissionChange}
        handleCheckboxChange={handleCheckboxChange}
        handleInstrucctions={handleInstrucctions}
        addStep={addStep}
        removeStep={removeStep}
        danger={danger}
        submission={submission}
        dietsLoaded={dietsLoaded}
        part={part}
        />
      )}
    </div>
  );
};

export default Form;

