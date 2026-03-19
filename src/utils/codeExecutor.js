// Enhanced code executor with proper parsing and execution simulation
export const executeCode = async (code, language, input = '') => {
  const steps = [];
  let stepCounter = 0;
  let globalVariables = {};
  let output = [];
  let callStack = [];
  let heapObjects = [];
  let heapCounter = 1;
  let currentOutputBuffer = ''; // Buffer for handling print without newline

  // Helper function to create a new step
  const createStep = (line, description, additionalData = {}) => {
    return {
      step: stepCounter++,
      line,
      stackFrames: [...callStack],
      heapObjects: [...heapObjects],
      variables: { ...globalVariables },
      output: [...output],
      description,
      ...additionalData
    };
  };

  // Helper function to add variable
  const addVariable = (name, value, type, reference = null) => {
    globalVariables[name] = { name, value, type, reference };
  };

  // Helper function to add heap object
  const addHeapObject = (type, value, references = []) => {
    const obj = {
      id: heapCounter++,
      type,
      value,
      references
    };
    heapObjects.push(obj);
    return obj.id;
  };

  // Helper function to push to call stack
  const pushFrame = (functionName, line, localVars = {}) => {
    callStack.push({
      id: `${functionName}_${callStack.length}`,
      function: functionName,
      line,
      variables: localVars
    });
  };

  // Helper function to pop from call stack
  const popFrame = () => {
    callStack.pop();
  };

  // Helper function to handle output with proper buffering
  const addOutput = (text, newline = true) => {
    if (newline) {
      if (currentOutputBuffer) {
        output.push(currentOutputBuffer + text);
        currentOutputBuffer = '';
      } else {
        output.push(text);
      }
    } else {
      currentOutputBuffer += text;
    }
  };

  // Parse input lines
  const inputLines = input.split('\n').filter(line => line.trim());
  let inputIndex = 0;

  try {
    if (language === 'python') {
      await executePython(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex);
    } else if (language === 'java') {
      await executeJava(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex);
    } else if (language === 'cpp') {
      await executeCpp(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex);
    }
  } catch (error) {
    steps.push(createStep(-1, `Error: ${error.message}`, { error: true }));
  }

  // Flush any remaining output buffer
  if (currentOutputBuffer) {
    output.push(currentOutputBuffer);
  }

  return steps;
};

// Python execution simulation
async function executePython(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex) {
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const actualLineNumbers = [];
  
  // Map filtered lines to their actual line numbers
  code.split('\n').forEach((line, index) => {
    if (line.trim() && !line.trim().startsWith('#')) {
      actualLineNumbers.push(index + 1);
    }
  });
  
  // Simple Python parser and executor
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const actualLineNumber = actualLineNumbers[i];

    if (line.startsWith('def ')) {
      // Function definition
      const funcName = line.match(/def\s+(\w+)/)[1];
      steps.push(createStep(actualLineNumber, `Define function: ${funcName}`));
      
      // Find function body
      let j = i + 1;
      const funcBody = [];
      while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
        if (lines[j].trim()) {
          funcBody.push(lines[j].trim());
        }
        j++;
      }
      
      // Store function for later execution
      globalThis[`python_${funcName}`] = { body: funcBody, params: line.match(/\(([^)]*)\)/)[1].split(',').map(p => p.trim()).filter(p => p) };
      i = j - 1; // Skip function body
      
    } else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
      // Variable assignment
      const [varName, expression] = line.split('=').map(s => s.trim());
      
      if (expression.includes('(') && !expression.includes('"') && !expression.includes("'")) {
        // Function call
        const funcMatch = expression.match(/(\w+)\(([^)]*)\)/);
        if (funcMatch) {
          const [, funcName, args] = funcMatch;
          const argValues = args.split(',').map(arg => {
            const trimmed = arg.trim();
            if (!isNaN(trimmed)) return parseInt(trimmed);
            if (trimmed.startsWith('"') || trimmed.startsWith("'")) return trimmed.slice(1, -1);
            return globalVariables[trimmed]?.value || trimmed;
          });

          steps.push(createStep(actualLineNumber, `Call ${funcName}(${argValues.join(', ')})`));
          
          // Execute function (simplified)
          if (funcName === 'factorial') {
            const result = await executeFactorial(argValues[0], steps, createStep, pushFrame, popFrame, actualLineNumber);
            addVariable(varName, result, 'int');
            steps.push(createStep(actualLineNumber, `${varName} = ${result}`));
          } else if (funcName === 'fibonacci') {
            const result = await executeFibonacci(argValues[0], steps, createStep, pushFrame, popFrame, actualLineNumber);
            addVariable(varName, result, 'int');
            steps.push(createStep(actualLineNumber, `${varName} = ${result}`));
          } else if (funcName === 'input') {
            const inputValue = inputLines[inputIndex++] || '';
            addVariable(varName, inputValue, 'str');
            steps.push(createStep(actualLineNumber, `${varName} = "${inputValue}" (from input)`));
          }
        }
      } else {
        // Simple assignment
        let value = expression;
        let type = 'str';
        
        if (!isNaN(expression)) {
          value = parseFloat(expression);
          type = expression.includes('.') ? 'float' : 'int';
        } else if (expression.startsWith('"') || expression.startsWith("'")) {
          value = expression.slice(1, -1);
          type = 'str';
        } else if (expression === 'True' || expression === 'False') {
          value = expression === 'True';
          type = 'bool';
        } else if (expression.startsWith('[') && expression.endsWith(']')) {
          // List
          const listItems = expression.slice(1, -1).split(',').map(item => {
            const trimmed = item.trim();
            if (!isNaN(trimmed)) return parseFloat(trimmed);
            if (trimmed.startsWith('"') || trimmed.startsWith("'")) return trimmed.slice(1, -1);
            return trimmed;
          });
          const heapId = addHeapObject('list', listItems, [varName]);
          addVariable(varName, `@${heapId}`, 'list', heapId);
          steps.push(createStep(actualLineNumber, `${varName} = [${listItems.join(', ')}] (heap object #${heapId})`));
          continue;
        }
        
        addVariable(varName, value, type);
        steps.push(createStep(actualLineNumber, `${varName} = ${value} (${type})`));
      }
      
    } else if (line.startsWith('print(')) {
      // Print statement
      const content = line.match(/print\(([^)]+)\)/)[1];
      let printValue = '';
      
      if (content.startsWith('f"') || content.startsWith("f'")) {
        // f-string
        const fstring = content.slice(2, -1);
        printValue = fstring.replace(/\{([^}]+)\}/g, (match, varName) => {
          const variable = globalVariables[varName.trim()];
          return variable ? variable.value : varName;
        });
      } else if (content.includes('+')) {
        // String concatenation
        const parts = content.split('+').map(part => {
          const trimmed = part.trim();
          if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
            return trimmed.slice(1, -1);
          }
          const variable = globalVariables[trimmed];
          return variable ? variable.value : trimmed;
        });
        printValue = parts.join('');
      } else {
        // Simple variable or string
        const trimmed = content.trim();
        if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
          printValue = trimmed.slice(1, -1);
        } else {
          const variable = globalVariables[trimmed];
          printValue = variable ? variable.value : trimmed;
        }
      }
      
      addOutput(printValue, true);
      steps.push(createStep(actualLineNumber, `Print: ${printValue}`));
    }
  }
}

// Factorial execution helper
async function executeFactorial(n, steps, createStep, pushFrame, popFrame, callerLine) {
  if (n <= 1) {
    pushFrame('factorial', callerLine, { n: { name: 'n', value: n, type: 'int' } });
    steps.push(createStep(callerLine, `factorial(${n}): base case, return 1`));
    popFrame();
    return 1;
  }
  
  pushFrame('factorial', callerLine, { n: { name: 'n', value: n, type: 'int' } });
  steps.push(createStep(callerLine, `factorial(${n}): recursive case, calculate ${n} * factorial(${n-1})`));
  
  const result = n * await executeFactorial(n - 1, steps, createStep, pushFrame, popFrame, callerLine);
  
  steps.push(createStep(callerLine, `factorial(${n}): return ${result}`));
  popFrame();
  
  return result;
}

// Fibonacci execution helper
async function executeFibonacci(n, steps, createStep, pushFrame, popFrame, callerLine) {
  if (n <= 1) {
    pushFrame('fibonacci', callerLine, { n: { name: 'n', value: n, type: 'int' } });
    steps.push(createStep(callerLine, `fibonacci(${n}): base case, return ${n}`));
    popFrame();
    return n;
  }
  
  pushFrame('fibonacci', callerLine, { n: { name: 'n', value: n, type: 'int' } });
  steps.push(createStep(callerLine, `fibonacci(${n}): recursive case, calculate fibonacci(${n-1}) + fibonacci(${n-2})`));
  
  const result = await executeFibonacci(n - 1, steps, createStep, pushFrame, popFrame, callerLine) + 
                 await executeFibonacci(n - 2, steps, createStep, pushFrame, popFrame, callerLine);
  
  steps.push(createStep(callerLine, `fibonacci(${n}): return ${result}`));
  popFrame();
  
  return result;
}

// Java execution simulation
async function executeJava(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex) {
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
  const actualLineNumbers = [];
  
  // Map filtered lines to their actual line numbers
  code.split('\n').forEach((line, index) => {
    if (line.trim() && !line.trim().startsWith('//')) {
      actualLineNumbers.push(index + 1);
    }
  });
  
  let inMainMethod = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const actualLineNumber = actualLineNumbers[i];
    
    if (line.includes('public static void main')) {
      inMainMethod = true;
      pushFrame('main', actualLineNumber, {});
      steps.push(createStep(actualLineNumber, 'Enter main method'));
      continue;
    }
    
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    
    if (inMainMethod && braceCount > 0) {
      if (line.includes('=') && !line.includes('==')) {
        // Variable declaration/assignment
        const parts = line.replace(';', '').split('=');
        if (parts.length === 2) {
          const [declaration, value] = parts.map(s => s.trim());
          const varName = declaration.split(' ').pop();
          const type = declaration.split(' ')[0];
          
          let actualValue = value;
          if (!isNaN(value)) {
            actualValue = parseInt(value);
          } else if (value.includes('(')) {
            // Method call
            const methodMatch = value.match(/(\w+)\(([^)]*)\)/);
            if (methodMatch && methodMatch[1] === 'factorial') {
              const arg = parseInt(methodMatch[2]);
              actualValue = await executeFactorial(arg, steps, createStep, pushFrame, popFrame, actualLineNumber);
            } else if (methodMatch && methodMatch[1] === 'fibonacci') {
              const arg = parseInt(methodMatch[2]);
              actualValue = await executeFibonacci(arg, steps, createStep, pushFrame, popFrame, actualLineNumber);
            }
          } else if (value.startsWith('{') && value.endsWith('}')) {
            // Array initialization
            const arrayItems = value.slice(1, -1).split(',').map(item => {
              const trimmed = item.trim();
              return !isNaN(trimmed) ? parseFloat(trimmed) : trimmed;
            });
            const heapId = addHeapObject('array', arrayItems, [varName]);
            addVariable(varName, `@${heapId}`, type + '[]', heapId);
            steps.push(createStep(actualLineNumber, `${varName} = {${arrayItems.join(', ')}} (heap object #${heapId})`));
            continue;
          }
          
          addVariable(varName, actualValue, type);
          steps.push(createStep(actualLineNumber, `${varName} = ${actualValue} (${type})`));
        }
      } else if (line.includes('System.out.println')) {
        // Print statement with newline
        const content = line.match(/System\.out\.println\(([^)]+)\)/)[1];
        let printValue = content.replace(/"/g, '');
        
        if (content.includes('+')) {
          const parts = content.split('+').map(part => {
            const trimmed = part.trim().replace(/"/g, '');
            const variable = globalVariables[trimmed];
            return variable ? variable.value : trimmed;
          });
          printValue = parts.join('');
        }
        
        addOutput(printValue, true);
        steps.push(createStep(actualLineNumber, `Print: ${printValue}`));
      } else if (line.includes('System.out.print')) {
        // Print statement without newline
        const content = line.match(/System\.out\.print\(([^)]+)\)/)[1];
        let printValue = content.replace(/"/g, '');
        
        if (content.includes('+')) {
          const parts = content.split('+').map(part => {
            const trimmed = part.trim().replace(/"/g, '');
            const variable = globalVariables[trimmed];
            return variable ? variable.value : trimmed;
          });
          printValue = parts.join('');
        }
        
        addOutput(printValue, false);
        steps.push(createStep(actualLineNumber, `Print: ${printValue} (no newline)`));
      }
    }
  }
  
  if (inMainMethod) {
    popFrame();
    steps.push(createStep(actualLineNumbers[actualLineNumbers.length - 1], 'Exit main method'));
  }
}

// C++ execution simulation
async function executeCpp(code, steps, createStep, addVariable, addHeapObject, pushFrame, popFrame, addOutput, inputLines, inputIndex) {
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#'));
  const actualLineNumbers = [];
  
  // Map filtered lines to their actual line numbers
  code.split('\n').forEach((line, index) => {
    if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
      actualLineNumbers.push(index + 1);
    }
  });
  
  let inMainFunction = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const actualLineNumber = actualLineNumbers[i];
    
    if (line.includes('int main()')) {
      inMainFunction = true;
      pushFrame('main', actualLineNumber, {});
      steps.push(createStep(actualLineNumber, 'Enter main function'));
      continue;
    }
    
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    
    if (inMainFunction && braceCount > 0) {
      if (line.includes('=') && !line.includes('==')) {
        // Variable declaration/assignment
        const parts = line.replace(';', '').split('=');
        if (parts.length === 2) {
          const [declaration, value] = parts.map(s => s.trim());
          const varName = declaration.split(' ').pop();
          const type = declaration.split(' ')[0];
          
          let actualValue = value;
          if (!isNaN(value)) {
            actualValue = parseInt(value);
          } else if (value.includes('(')) {
            // Function call
            const funcMatch = value.match(/(\w+)\(([^)]*)\)/);
            if (funcMatch && funcMatch[1] === 'factorial') {
              const arg = parseInt(funcMatch[2]);
              actualValue = await executeFactorial(arg, steps, createStep, pushFrame, popFrame, actualLineNumber);
            } else if (funcMatch && funcMatch[1] === 'fibonacci') {
              const arg = parseInt(funcMatch[2]);
              actualValue = await executeFibonacci(arg, steps, createStep, pushFrame, popFrame, actualLineNumber);
            }
          } else if (value.startsWith('{') && value.endsWith('}')) {
            // Vector/array initialization
            const arrayItems = value.slice(1, -1).split(',').map(item => {
              const trimmed = item.trim();
              return !isNaN(trimmed) ? parseFloat(trimmed) : trimmed;
            });
            const heapId = addHeapObject('vector', arrayItems, [varName]);
            addVariable(varName, `@${heapId}`, 'vector<int>', heapId);
            steps.push(createStep(actualLineNumber, `${varName} = {${arrayItems.join(', ')}} (heap object #${heapId})`));
            continue;
          }
          
          addVariable(varName, actualValue, type);
          steps.push(createStep(actualLineNumber, `${varName} = ${actualValue} (${type})`));
        }
      } else if (line.includes('cout')) {
        // Output statement
        const content = line.match(/cout\s*<<\s*(.+?)\s*;/);
        if (content) {
          let printValue = content[1].replace(/"/g, '');
          const hasEndl = printValue.includes('endl');
          printValue = printValue.replace(/endl/g, '').replace(/<<\s*$/g, '').trim();
          
          if (printValue.includes('<<')) {
            const parts = printValue.split('<<').map(part => {
              const trimmed = part.trim().replace(/"/g, '');
              if (trimmed === '') return '';
              const variable = globalVariables[trimmed];
              return variable ? variable.value : trimmed;
            });
            printValue = parts.join('');
          }
          
          addOutput(printValue, hasEndl);
          steps.push(createStep(actualLineNumber, `Output: ${printValue}${hasEndl ? ' (with newline)' : ' (no newline)'}`));
        }
      } else if (line.includes('return')) {
        steps.push(createStep(actualLineNumber, 'Return from main'));
        break;
      }
    }
  }
  
  if (inMainFunction) {
    popFrame();
    steps.push(createStep(actualLineNumbers[actualLineNumbers.length - 1], 'Exit main function'));
  }
}