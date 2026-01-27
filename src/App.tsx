import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">
          Sanilady V2
        </h1>

        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Counter Demo</p>
            <div className="text-6xl font-bold text-blue-600 mb-6">{count}</div>
          </div>

          <button
            onClick={() => setCount(count + 1)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Increment
          </button>

          <button
            onClick={() => setCount(0)}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
