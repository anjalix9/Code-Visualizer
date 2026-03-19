import React from 'react';
import { BookOpen, Code, Play, Eye, Layers, Database, ArrowRight, CheckCircle } from 'lucide-react';

export const Documentation = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">CodeViz Documentation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Getting Started */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <span>Getting Started</span>
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>CodeViz is a step-by-step code execution visualizer that helps you understand how your programs run by showing:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Call stack with function frames</li>
                <li>Variable states and memory allocation</li>
                <li>Heap memory for objects and arrays</li>
                <li>Program output in real-time</li>
              </ul>
            </div>
          </section>

          {/* How to Use */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-600" />
              <span>How to Use</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Step 1: Write or Load Code</h4>
                <p className="text-blue-700 text-sm">
                  Select your programming language (Python, Java, or C++) and either write your code or load an example.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Step 2: Add Test Input (Optional)</h4>
                <p className="text-green-700 text-sm">
                  If your program requires input, add it in the Test Input section.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Step 3: Visualize Execution</h4>
                <p className="text-purple-700 text-sm">
                  Click "Visualize Execution" to start the step-by-step analysis of your code.
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Step 4: Control Execution</h4>
                <p className="text-orange-700 text-sm">
                  Use the control buttons to step through execution, pause, resume, or jump to specific steps.
                </p>
              </div>
            </div>
          </section>

          {/* Understanding the Visualization */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span>Understanding the Visualization</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Call Stack</h4>
                </div>
                <p className="text-purple-700 text-sm">
                  Shows active function calls with the newest frame at the top. Each frame displays local variables and the current line being executed.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Variables</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Displays all variables with their current values, types, and scope. Local variables are marked with an eye icon.
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">Heap Memory</h4>
                </div>
                <p className="text-orange-700 text-sm">
                  Shows objects, arrays, and lists allocated in memory with their contents and which variables reference them.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800">Execution Pointer</h4>
                </div>
                <p className="text-green-700 text-sm">
                  The blue arrow and highlighting in the code editor shows exactly which line is currently being executed.
                </p>
              </div>
            </div>
          </section>

          {/* Supported Features */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Supported Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">Python</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Functions and recursion</li>
                  <li>• Variables and lists</li>
                  <li>• Print statements</li>
                  <li>• F-strings</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-800">Java</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Static methods</li>
                  <li>• Arrays and variables</li>
                  <li>• System.out.print/println</li>
                  <li>• Recursion</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">C++</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Functions and main</li>
                  <li>• Vectors and variables</li>
                  <li>• cout with/without endl</li>
                  <li>• Recursion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Control Panel Guide */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Control Panel Guide</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="bg-blue-100 p-2 rounded-lg mb-2">
                    <Play className="h-4 w-4 text-blue-600 mx-auto" />
                  </div>
                  <div className="font-semibold">Play/Pause</div>
                  <div className="text-gray-600">Auto-step through execution</div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 p-2 rounded-lg mb-2">
                    <ArrowRight className="h-4 w-4 text-gray-600 mx-auto" />
                  </div>
                  <div className="font-semibold">Step Forward</div>
                  <div className="text-gray-600">Execute next step</div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 p-2 rounded-lg mb-2">
                    <ArrowRight className="h-4 w-4 text-gray-600 mx-auto transform rotate-180" />
                  </div>
                  <div className="font-semibold">Step Back</div>
                  <div className="text-gray-600">Go to previous step</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 p-2 rounded-lg mb-2">
                    <CheckCircle className="h-4 w-4 text-red-600 mx-auto" />
                  </div>
                  <div className="font-semibold">Reset</div>
                  <div className="text-gray-600">Return to beginning</div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips and Best Practices */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tips and Best Practices</h3>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 Tip:</strong> Start with simple examples like factorial or fibonacci to understand how recursion works.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>🔍 Debug:</strong> Use the step-by-step controls to identify exactly where your logic might be going wrong.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  <strong>📚 Learn:</strong> Watch how variables change and how the call stack grows and shrinks during function calls.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Troubleshooting</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-1">Code not executing?</h4>
                <p className="text-gray-700 text-sm">Make sure your code has executable statements and follows the supported syntax patterns.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-1">Execution pointer not showing?</h4>
                <p className="text-gray-700 text-sm">The pointer only appears during active execution. Click "Visualize Execution" first.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-1">Variables not updating?</h4>
                <p className="text-gray-700 text-sm">Use the step controls to move through execution and watch variables change in real-time.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};