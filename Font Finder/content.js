let createdDiv = null;
let hoverdiv = null;
let timeoutId = null;
let ext_id = chrome.runtime.id;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "hey") {
    fontFinder();
    sendResponse({ message: "Font finder initiated" });
  }
});

function fontFinder() {
  let body = document.querySelector("body");
  body.style.cursor = "pointer";

  // Create a button element
  const button = document.createElement("button");

  button.textContent = "Exit";
  button.className = "exit";

  // Style the button
  button.style.margin = "none";
  button.style.position = "fixed";
  button.style.top = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.width = "90px";
  button.style.height = "40px";
  button.style.padding = "3px";
  button.style.border = "2px solid grey";
  button.style.background = "black";
  button.style.color = "white";
  button.style.opacity = "0.7";

  // Add event listener to the button
  button.addEventListener("click", handleExitButtonClick);

  createdDiv = document.createElement("div");
  createdDiv.className = "display";
  createdDiv.id = "displayhover";
  createdDiv.style.position = "fixed";
  createdDiv.style.top = "20px";
  createdDiv.style.left = "20px";
  createdDiv.style.zIndex = "9999"; // Set z-index property

  hoverdiv = document.createElement("div");
  hoverdiv.className = "hover-display";
  hoverdiv.style.position = "fixed";
  hoverdiv.style.zIndex = "9999";
  hoverdiv.style.opacity = "0.7";
  hoverdiv.style.background = "black"; // Set background color
  hoverdiv.style.color = "white"; // Set text color

  function handleExitButtonClick() {
    // Handle button click event
    body.style.cursor = "auto";
    button.style.display = "none";
    createdDiv.innerHTML = ""; // Clear the font details div
    body.removeEventListener("click", divdisplay);
    clearTimeout(timeoutId);
    body.removeEventListener("mouseover", handleMouseOver);
    body.removeEventListener("mouseout", handleMouseOut);
    const hoverdiv = document.querySelector(".hover-display");
    if (hoverdiv) {
      hoverdiv.style.display = "none";
    }
  }
  
  

  function divdisplay(event) {
    const targett = event.target;

    if (targett === createdDiv || createdDiv.contains(targett)) {
      return;
    }

    if (createdDiv.style.display === "none") {
      createdDiv.style.display = "block";
    }

    const target = event.target;
    const fontSize = window
      .getComputedStyle(target)
      .getPropertyValue("font-size");
    const fontFamily = window
      .getComputedStyle(target)
      .getPropertyValue("font-family");
    const fontWeight = window
      .getComputedStyle(target)
      .getPropertyValue("font-weight");
    const fontLineHeight = window
      .getComputedStyle(target)
      .getPropertyValue("line-height");
    const fontColor = window.getComputedStyle(target).getPropertyValue("color");

    const posX = event.clientX;
    const posY = event.clientY;

    let ext_id = chrome.runtime.id;

    let str = `
      <div id="details" style="position: absolute; height: fit-content; width: 328px; background-color: black; color: white; padding: 20px; border-radius: 15px; opacity: 0.7; font-size: 14px; top:${
        posY + 4
      }px; left:${posX + 4}px; cursor: auto;">
        <div style="padding: 5px;">
          <img src="chrome-extension://${ext_id}/assets/imgs/Close_round.png" class="cancel_btn" id="cancel_btn" alt="" style="position: absolute; height: 18px; width: 18px; right: 17px;"> 
          <div class="ffamily">Font Family: ${fontFamily}</div>
          <button class="copy_img" style="display: block; height: 30px; width: fit-content; background-color: black; color: white; border: 1px solid white; border-radius: 2px; padding: 4px; margin-top: 10px; margin-right: 10px;">Copy</button> 
          <span class="copyMessage" id="copyMessage" style="display: none; position: absolute; width: fit-content; background-color: black; color: white; border: 1px solid white; border-radius: 2px; padding: 4px; top: 53px; right: 10px;">Font Copied</span>
        </div>
        <div style="column-count: 3; padding: 5px;">
          <div class="fsize">Font Size: ${fontSize}</div>
          <div class="fweight">Font Weight: ${fontWeight}</div>
        </div>
        <div style="column-count: 3; padding: 5px;">
          <div class="fstyle">Style</div>
          <div class="fline">Line Height: ${fontLineHeight}</div>
          <div class="fcolor">Font Color: ${fontColor}<span style="display: block; height: 10px; width: 10px; background-color: ${fontColor};"></span></div>
        </div>
      </div>`;
    // Append the font details div to the body
    createdDiv.innerHTML = str;
    document.body.appendChild(createdDiv);
    // const copyMessage = createdDiv.querySelector(".copyMessage");
    const copyImg = createdDiv.querySelector(".copy_img");

    copyImg.addEventListener("click", () => {
      const copiedText = `${fontFamily}`;
      navigator.clipboard
        .writeText(copiedText)
        .then(() => {
          copyMessage.style.display = "block";
          setTimeout(() => {
            copyMessage.style.display = "none";
          }, 2000);
        })
        .catch((error) => {
          console.error("Font details copy failed:", error);
          // Handle the error, if any, during copying.
        });
    });

    const cancelBtn = createdDiv.querySelector("#cancel_btn");

    cancelBtn.addEventListener("click", () => {
      createdDiv.style.display = "none";
    });

    // Show the font details div for 10 seconds
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      createdDiv.innerHTML = "";
    }, 10000);
  }

  function handleMouseOver(event) {
    const target = event.target;
    const fontFamily = window.getComputedStyle(target).getPropertyValue("font-family");
    const fontFamilydiv = fontFamily.split(",");
  
    // Create the div for displaying font family on mouseover
    const hoverdiv = document.createElement("div");
    hoverdiv.className = "hover-display";
    hoverdiv.textContent = `Font Family: ${fontFamilydiv[0]}`;
  
    // Set the style for the hoverdiv
    hoverdiv.style.position = "fixed";
    hoverdiv.style.zIndex = "9999";
    hoverdiv.style.opacity = "0.7";
    hoverdiv.style.background = "black";
    hoverdiv.style.color = "white";
    hoverdiv.style.padding = "4px";
    hoverdiv.style.borderRadius = "6px";
    hoverdiv.style.display = "block";
    hoverdiv.style.marginTop = "10px";
  
    // Calculate the adjusted positions based on scroll position
    const adjustedTop = event.clientY;
    const adjustedLeft = event.clientX;
  
    // Set the position of the hoverdiv
    hoverdiv.style.top = `${adjustedTop + 4}px`;
    hoverdiv.style.left = `${adjustedLeft + 4}px`;
  
    // Append the hoverdiv to the document body
    document.body.appendChild(hoverdiv);
  }
  
  function handleMouseOut(event) {
    const hoverdiv = document.querySelector(".hover-display");
    if (hoverdiv) {
      hoverdiv.remove();
    }
  }
  
  // // Remove the existing event listeners for mouseover and mouseout
  // body.removeEventListener("mouseover", handleMouseOver);
  // body.removeEventListener("mouseout", handleMouseOut);
  
  // Add the updated event listeners for mouseover and mouseout
  body.addEventListener("mouseover", handleMouseOver);
  body.addEventListener("mouseout", handleMouseOut);
  
  body.addEventListener("click", divdisplay);


  // Append the button to the document body
  document.body.appendChild(button);
}

// Call the fontFinder function
// fontFinder();
