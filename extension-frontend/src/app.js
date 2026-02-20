export const sendToBackend = async (question, context, sessionId) => {
  const response = await fetch('http://localhost:8000/chat', {
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