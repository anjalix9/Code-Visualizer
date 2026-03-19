import React from 'react';
import { useExecution } from '../context/ExecutionContext';
import { FileInput as Input } from 'lucide-react';

export const InputOutput = () => {
  const { testInput, setTestInput } = useExecution();

  return (
    <div className="h-full">
      {/* Input Section Only */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-full">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
              <Input className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Test Input</h3>
          </div>
        </div>
        <div className="p-6 h-[calc(100%-80px)]">
          <textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Enter test input (optional)..."
            className="w-full h-full p-4 border border-gray-200 rounded-xl font-mono text-sm bg-gray-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none text-gray-800 caret-blue-500"
            style={{ caretColor: '#3B82F6' }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Provide input that your program might need (one value per line)
          </p>
        </div>
      </div>
    </div>
  );
};
