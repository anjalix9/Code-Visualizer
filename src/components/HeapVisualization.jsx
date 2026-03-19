import React from 'react';
import { useExecution } from '../context/ExecutionContext';
import { Box, ArrowRight, Hash, Link } from 'lucide-react';

export const HeapVisualization = () => {
  const { executionState } = useExecution();

  if (executionState.heapObjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Box className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No heap objects yet</p>
        <p className="text-xs text-gray-400 mt-1">Objects and arrays will appear here during execution</p>
      </div>
    );
  }

  const getObjectColor = (type) => {
    switch (type) {
      case 'array':
        return 'border-orange-300 bg-orange-50 text-orange-700';
      case 'object':
        return 'border-green-300 bg-green-50 text-green-700';
      case 'list':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'vector':
        return 'border-purple-300 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getReferencingVariables = (objectId) => {
    const references = [];
    
    // Check global variables
    Object.entries(executionState.variables).forEach(([name, variable]) => {
      if (variable.reference === objectId) {
        references.push(name);
      }
    });
    
    // Check local variables in stack frames
    executionState.stackFrames.forEach(frame => {
      Object.entries(frame.variables).forEach(([name, variable]) => {
        if (variable.reference === objectId) {
          references.push(`${frame.function}.${name}`);
        }
      });
    });
    
    return references;
  };

  return (
    <div className="space-y-4">
      {executionState.heapObjects.map((obj) => {
        const references = getReferencingVariables(obj.id);
        
        return (
          <div
            key={obj.id}
            className={`border-2 rounded-xl p-4 ${getObjectColor(obj.type)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Box className="h-4 w-4" />
                <span className="font-semibold">{obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}</span>
                <div className="flex items-center space-x-1 text-sm">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">#{obj.id}</span>
                </div>
              </div>
              {references.length > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <Link className="h-3 w-3" />
                  <span>{references.length} reference{references.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {Array.isArray(obj.value) ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium opacity-75">
                    Elements ({obj.value.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {obj.value.map((item, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-white rounded-lg px-3 py-2 text-sm shadow-sm">
                        <span className="text-gray-500 font-mono">[{index}]</span>
                        <span className="font-mono font-semibold">
                          {typeof item === 'string' ? `"${item}"` : String(item)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : typeof obj.value === 'object' && obj.value !== null ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium opacity-75">Properties:</div>
                  <div className="space-y-1">
                    {Object.entries(obj.value).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2 text-sm bg-white rounded-lg px-3 py-2 shadow-sm">
                        <span className="font-mono text-blue-600 font-semibold">{key}</span>
                        <span className="text-gray-500">:</span>
                        <span className="font-mono">
                          {typeof value === 'string' ? `"${value}"` : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="font-mono text-sm bg-white rounded-lg px-3 py-2 shadow-sm">
                  {typeof obj.value === 'string' ? `"${obj.value}"` : String(obj.value)}
                </div>
              )}
            </div>
            
            {references.length > 0 && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="text-xs font-medium mb-2 opacity-75">Referenced by:</div>
                <div className="flex flex-wrap gap-1">
                  {references.map((ref, index) => (
                    <span key={index} className="bg-white bg-opacity-70 px-2 py-1 rounded text-xs font-mono shadow-sm">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};