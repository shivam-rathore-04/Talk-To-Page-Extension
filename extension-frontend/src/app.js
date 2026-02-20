export const sendToBackend = async (question, context, sessionId) => {
  // 1. Declare variables with 'const' and wrap the URLs in quotes (strings)
  const local = 'http://localhost:8000';
  const cloud = 'https://p01--talk-to-page-backend--n2qttbzfzv22.code.run'; // Don't forget https:// !

  // 2. Use a template literal (backticks) to safely inject the variable into the fetch URL
  const response = await fetch(`${cloud}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        question, 
        context, 
        session_id: sessionId // <--- Sending the ID
    }),
  });
  
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};