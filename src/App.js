//import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import React, { useState } from "react";

import Calculator from "./components/CalculatorBody";
import Screen from "./components/screen";
import Button from "./components/button";
import ButtonBox from "./components/buttonBox";


const btnValues = [
  ["AC", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

function App() {
  let [calc, setCalc] = useState({
    sign: "",
    num: "0",
    res: "0",
  });  

  const numberClickHandler = (value) => {
    setCalc((prevCalc) => {
      if (prevCalc.num.length >= 16) return prevCalc;
  
      return {
        ...prevCalc,
        num:
          prevCalc.num === "0" && value === "0"
            ? "0"
            : prevCalc.num === "0"
            ? value
            : prevCalc.num + value,
        res: !prevCalc.sign ? "" : prevCalc.res,
      };
    });
  };
  
  const decimalClickHandler = (value) => {
    setCalc((prevCalc) => ({
      ...prevCalc,
      num: !prevCalc.num.toString().includes(".")
        ? prevCalc.num + value
        : prevCalc.num,
    }));
  };
  
  const signClickHandler = (value) => {
    setCalc((prevCalc) => ({
      sign: value,
      num: "",
      res: prevCalc.num && !prevCalc.res ? prevCalc.num : prevCalc.res || "0",
    }));
  };

  const equalsClickHandler = () => {
    setCalc((prevCalc) => {
      if (prevCalc.sign && prevCalc.num) {
        const math = (a, b, sign) => {
          switch (sign) {
            case "+": return a + b;
            case "-": return a - b;
            case "X": return a * b;
            case "/": return b === 0 ? "Can't divide with 0" : a / b;
            default: return b;
          }
        };
  
        const result = math(
          Number(prevCalc.res),
          Number(prevCalc.num),
          prevCalc.sign
        );
  
        return {
          sign: "",
          num: "",
          res: result.toString(),
        };
      }
      return prevCalc;
    });
  };
  

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? calc.num * -1 : 0,
      res: calc.res ? calc.res * -1 : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    if (calc.num) {
      const percent = Number(calc.num) / 100;
      setCalc({
        ...calc,
        num: percent.toString(),
      });
    }
  };

  const resetClickHandler = () => {
    setCalc({
      sign: "",
      num: "",
      res: "",
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
  
      if (!isNaN(key)) {               //isNaN returns true if the string is not a number, so !isNaN will give true if it is a number. 
        numberClickHandler(key);
      } else if (key === ".") {
        decimalClickHandler(".");
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        const op = key === "*" ? "X" : key; // mapping * to X
        signClickHandler(op);
      } else if (key === "%") {
        if (calc.num) {
          const percent = Number(calc.num) / 100;       //parseFloat converts a string into a float number. 
          setCalc((prev) => ({
            ...prev,
            num: percent.toString(),
          }));
        }
      } else if (key === "Enter" || key === "=") {
        equalsClickHandler();
      } else if (key === "c" || key === "C") {
        resetClickHandler();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calc.num]); 


  return (
    <Calculator>
    <Screen value={(calc.num !== "" ? calc.num : calc.res) || "0"} />
    <ButtonBox> {
    btnValues.flat().map((btn, i) => (
      <Button
        key={i}
        className={btn === "=" ? "equals" : ""}
        value={btn}
        onClick={() =>
          btn === "AC"
            ? resetClickHandler()
            : btn === "+-"
            ? invertClickHandler()
            : btn === "%"
            ? percentClickHandler()
            : btn === "="
            ? equalsClickHandler()
            : btn === "/" || btn === "X" || btn === "-" || btn === "+"
            ? signClickHandler(btn)
            : btn === "."
            ? decimalClickHandler(btn)
            : numberClickHandler(btn)
        }
        />
      ))
      }
      </ButtonBox>
    </Calculator>
  );
};

export default App;
