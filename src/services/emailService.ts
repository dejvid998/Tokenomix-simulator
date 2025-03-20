
export const sendEmailWithAnswers = async (answers: Record<string, string>, userEmail?: string) => {
  try {
    // Format the data as HTML for better email readability
    const formattedAnswers = Object.entries(answers).map(([key, value]) => {
      // Convert the camelCase key to a more readable format
      const readableKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      
      return `<p><strong>${readableKey}:</strong> ${value}</p>`;
    }).join('');
    
    // Create the email payload
    const emailData = {
      to: "dejvid814@gmail.com",
      from: userEmail || "noreply@unlockfi.com",
      subject: "New Web3 Launch Questionnaire Submission",
      html: `
        <h1>New Questionnaire Submission</h1>
        <div>${formattedAnswers}</div>
        ${userEmail ? `<p>Respondent email: ${userEmail}</p>` : ''}
      `
    };
    
    // Send the email using Email JS
    // Note: We're using a direct server approach here for simplicity
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: 'default_service', // Replace with your EmailJS service ID
        template_id: 'template_default', // Replace with your EmailJS template ID
        user_id: 'YOUR_EMAILJS_PUBLIC_KEY', // Will be replaced by user
        template_params: emailData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
