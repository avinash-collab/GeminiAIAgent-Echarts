'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const TreeChart = dynamic(() => import('./components/TreeChart'), { ssr: false });

export default function LearnPage() {
  const [phase, setPhase] = useState<'ask' | 'show'>('ask');
  const [userInput, setUserInput] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
  if (!userInput.trim()) {
    alert('Please enter a valid topic.');
    return;
  }

  try {
    setLoading(true);
    const res = await fetch('http://localhost:8080/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });

    const raw = await res.text();
    const parsedData = JSON.parse(raw);

    if (parsedData.error) {
      alert(parsedData.error);
      return;
    }

    setChartData(parsedData);
    setPhase('show');
  } catch (err) {
    console.error('Fetch or JSON error:', err);
    alert('Something went wrong while generating the roadmap.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="flex flex-col gap-6 p-6 max-w-4xl w-full mx-auto text-center">
        {phase === 'ask' && (
          <>
            <h1 className="text-2xl font-bold">What do you want to learn?</h1>
            <input
              type="text"
              className="border px-4 py-2 w-full max-w-md mx-auto rounded text-black"
              placeholder="e.g., Java, Python, Kotlin"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
            />

            {loading ? (
              <div className="flex justify-center items-center gap-2 text-blue-600 font-semibold">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Loading roadmap...
              </div>
            ) : (
              <div className='flex justify-center'>
              <button
                onClick={handleStart}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 w-fit"
              >
                Show Roadmap
              </button>
              </div>
            )}
          </>
        )}

        {phase === 'show' && chartData && (
          <>
            <TreeChart data={chartData} userInput={userInput} />
            <button
              onClick={() => {
                setPhase('ask');
                setUserInput('');
                setChartData(null);
              }}
              
              className="mt-4 text-blue-800 hover:text-blue-800"
            >
              Go BACK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
