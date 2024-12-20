import { useState } from 'react';
import axios from 'axios';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Function to evaluate the expression
  const evaluateExpression = async () => {
    try {
      // Using `eval` to evaluate mathematical expression (be careful, this should be safe for only numbers/expressions here)
      const evaluatedResult = eval(expression); // DON'T use eval in production for security reasons
      setResult(evaluatedResult);

      // Save to database
      await axios.post('http://localhost:3000/api/saveCalculation', {
        expression,
        result: evaluatedResult,
      });
    } catch {
      setResult('Error');
      console.error("Error evaluating expression");
    }
  };

  // Function to fetch calculation history
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Calculator</h1>

      {/* Calculator Input */}
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter expression"
        className="w-64 p-2 border border-gray-400 rounded-md mb-4 text-center"
      />

      <button
        onClick={evaluateExpression}
        className="w-64 p-2 bg-blue-500 text-white rounded-md mb-4 hover:bg-blue-700"
      >
        Calculate
      </button>

      {/* Display Result */}
      <div className="text-xl font-semibold mb-4">
        <h2>Result: {result}</h2>
      </div>

      <hr className="w-full my-6" />

      {/* History Section */}
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Calculation History</h2>

        <button
          onClick={fetchHistory}
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-700 mb-4"
        >
          Get History
        </button>

        <ul className="list-disc pl-6">
          {history.map((item) => (
            <li key={item._id} className="mb-2">
              <span className="font-semibold">{item.expression}</span> = {item.result} (on{' '}
              {new Date(item.date).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
