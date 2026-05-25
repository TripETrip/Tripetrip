export async function chatWithAI(messages: { role: 'user' | 'bot', text: string }[]) {
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "I'm having trouble connecting to my local travel knowledge right now. Try again later!";
  }
}

export async function getVendorInsights(bookingData: any) {
  try {
    const response = await fetch("/api/gemini/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Insights Proxy Error:", error);
    return "I can't analyze your data right now, but your hospitality is always appreciated!";
  }
}
