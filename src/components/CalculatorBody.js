import "./CalculatorBody.css";

const Calculator = ({ children }) => {
    return (<div className="calculator">
        {children}
    </div>
    );
};

export default Calculator;
