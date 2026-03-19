import React, { useState } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { VisualizationPanel } from './components/VisualizationPanel';
import { ControlPanel } from './components/ControlPanel';
import { InputOutput } from './components/InputOutput';
import { ExecutionProvider } from './context/ExecutionContext';

function App() {
  return (
    <ExecutionProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        
        <main className="flex flex-col gap-6 p-6 max-w-[1800px] mx-auto">
          {/* Top Row - Code Editor, Input, Call Stack - Fixed height at 75vh */}
          <div className="grid grid-cols-12 gap-6" style={{ height: '75vh' }}>
            {/* Code Editor - Left side (5 columns) - Fixed width */}
            <div className="col-span-5 min-w-0">
              <CodeEditor />
            </div>
            
            {/* Input - Middle (3 columns) - Fixed width */}
            <div className="col-span-3 min-w-0">
              <InputOutput />
            </div>
            
            {/* Call Stack - Right side (4 columns) - Fixed width */}
            <div className="col-span-4 min-w-0">
              <VisualizationPanel showOnlyStack={true} />
            </div>
          </div>
          
          {/* Bottom Row - Control Panel and Heap Memory */}
          <div className="grid grid-cols-12 gap-6">
            {/* Control Panel - Left side (5 columns) - Fixed width */}
            <div className="col-span-5 min-w-0">
              <ControlPanel />
            </div>
            
            {/* Heap Memory - Right side (7 columns) - Fixed width */}
            <div className="col-span-7 min-w-0">
              <VisualizationPanel showOnlyHeap={true} />
            </div>
          </div>
        </main>
      </div>
    </ExecutionProvider>
  );
}

export default App;