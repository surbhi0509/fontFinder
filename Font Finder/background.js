function sendMessage(item) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, item, (response) => {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("Message received successfully:", response);
            resolve(response);
          }
        });
      } else {
        const errorMessage = "No active tab found.";
        console.log(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  console.log("clicked");
  try {
    await sendMessage({ message: "hey" });
    console.log("Message sent successfully");
    // Perform any additional actions after the message is successfully sent
  } catch (error) {
    console.log("Error sending message:", error);
    // Handle the error, such as displaying an error message or taking appropriate action
  }
});




