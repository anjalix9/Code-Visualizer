import React, { useEffect, useRef } from 'react';
import { useExecution } from '../context/ExecutionContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Copy, Download, Upload, FileText, Save } from 'lucide-react';

const languageExamples = {
  python: `def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Test the functions
result = factorial(5)
print(f"Factorial of 5 is: {result}")

fib_result = fibonacci(6)
print(f"Fibonacci of 6 is: {fib_result}")

# Array example
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")`,
  
  java: `public class MathOperations {
    public static int factorial(int n) {
        if (n <= 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        } else {
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    }
    
    public static void main(String[] args) {
        int result = factorial(5);
        System.out.println("Factorial of 5 is: " + result);
        
        int fibResult = fibonacci(6);
        System.out.println("Fibonacci of 6 is: " + fibResult);
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Array created with 5 elements");
        
        // Test System.out.print (no newline)
        System.out.print("Testing print without newline: ");
        System.out.println(result);
    }
}`,
  
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int factorial(int n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

int main() {
    int result = factorial(5);
    cout << "Factorial of 5 is: " << result << endl;
    
    int fibResult = fibonacci(6);
    cout << "Fibonacci of 6 is: " << fibResult << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Vector created with 5 elements" << endl;
    
    // Test cout without endl
    cout << "Testing output without newline: ";
    cout << result << endl;
    
    return 0;
}`
};

export const CodeEditor = () => {
  const { language, setLanguage, code, setCode, executionState } = useExecution();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const syntaxHighlighterRef = useRef(null);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(languageExamples[newLanguage]);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const extensions = { python: 'py', java: 'java', cpp: 'cpp' };
    const extension = extensions[language];
    const filename = `code.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setCode(content);
          
          // Try to detect language from file extension
          const extension = file.name.split('.').pop()?.toLowerCase();
          if (extension === 'py') {
            setLanguage('python');
          } else if (extension === 'java') {
            setLanguage('java');
          } else if (extension === 'cpp' || extension === 'cc' || extension === 'cxx') {
            setLanguage('cpp');
          }
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleClearCode = () => {
    setCode('');
  };

  const handleLoadExample = () => {
    setCode(languageExamples[language]);
  };

  const getLanguageForPrism = (lang) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'python';
    }
  };

  // Sync textarea scroll with syntax highlighter
  const handleScroll = (e) => {
    if (syntaxHighlighterRef.current) {
      const syntaxElement = syntaxHighlighterRef.current.querySelector('pre');
      if (syntaxElement) {
        syntaxElement.scrollTop = e.target.scrollTop;
        syntaxElement.scrollLeft = e.target.scrollLeft;
      }
    }
  };

  // Get the current executing line number for highlighting
  const getCurrentExecutingLine = () => {
    if (executionState.currentLine <= 0) return -1;
    return executionState.currentLine;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-full w-full">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {Object.keys(languageExamples).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Download code"
              >
                <Download className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleUpload}
                className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                title="Upload code file"
              >
                <Upload className="h-4 w-4" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".py,.java,.cpp,.cc,.cxx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        {/* Additional Controls */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadExample}
              className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Load Example
            </button>
            <button
              onClick={handleClearCode}
              className="text-sm px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear Code
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {executionState.currentLine > 0 && (
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                Executing Line: {executionState.currentLine}
              </div>
            )}
            <div className="text-sm text-gray-500">
              Lines: {code.split('\n').length} | Characters: {code.length}
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative h-[calc(100%-140px)] overflow-hidden">
        {/* Visible textarea for editing */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset border-0 overflow-auto"
          spellCheck={false}
          style={{ 
            fontFamily: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
            lineHeight: '1.6',
            caretColor: '#60A5FA',
            tabSize: 4
          }}
          placeholder={`Enter your ${language} code here...`}
        />
        
        {/* Debug pointer indicator */}
        {getCurrentExecutingLine() > 0 && (
          <div 
            className="absolute left-2 pointer-events-none z-20"
            style={{
              top: `${(getCurrentExecutingLine() - 1) * 1.6 * 14 + 16}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="flex items-center">
              <div className="w-0 h-0 border-l-8 border-l-blue-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              <div className="bg-blue-400 text-white text-xs px-2 py-1 rounded-r ml-1 font-semibold">
                EXECUTING
              </div>
            </div>
          </div>
        )}
        
        {/* Line highlighting overlay */}
        {getCurrentExecutingLine() > 0 && (
          <div 
            className="absolute left-0 right-0 pointer-events-none z-10 bg-blue-500 bg-opacity-20 border-l-4 border-blue-400"
            style={{
              top: `${(getCurrentExecutingLine() - 1) * 1.6 * 14 + 16}px`,
              height: `${1.6 * 14}px`
            }}
          />
        )}
      </div>
    </div>
  );
};