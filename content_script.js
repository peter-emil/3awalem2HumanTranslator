const detect3awalem = function (innerHTML){
  let detected3awalem = [];
  let STATE_INITIAL = 0;
  let STATE_COMMIT = 1;
  let currentState = STATE_INITIAL;
  let lines = innerHTML.split("\n");
  let tokens = [];
  for (let line of lines){
    tokens = tokens.concat(line.split(" "));
  }
  let confirmationCounter = 0;
  let buffer = [];
  for (let token of tokens){
    let sanitizedToken = token.trim();
    if (sanitizedToken.startsWith("الس")) {
      sanitizedToken = sanitizedToken.substring(2, sanitizedToken.length);
    }
    if (currentState == STATE_INITIAL) {
      buffer = [];
      if (!sanitizedToken.startsWith("س")) {
        currentState = STATE_INITIAL;
        if (confirmationCounter < 2) {
          confirmationCounter = 0;
        }
        continue;
      } else {
        currentState = STATE_COMMIT;
        buffer = buffer.concat(token.split("\n")[0]);
        continue;
      }
    }
    if (currentState == STATE_COMMIT){
      buffer = buffer.concat(token.split("\n")[0]);
      confirmationCounter++;
      detected3awalem.push(buffer);
      currentState = STATE_INITIAL;
      continue
    }
  }
  if (confirmationCounter >=2){
    return detected3awalem;
  } else {
    return [];
  }
}

const humanize3awalem = function (tokenPair) {
  let sinWord = tokenPair[0];
  let afterWord = tokenPair[1];
  let sanitizedSinWord = sinWord;
  //let sanitizedSinWord = sinWord.trim();
  if (sanitizedSinWord.startsWith("الس")) {
    sanitizedSinWord = sanitizedSinWord.substring(2, sanitizedSinWord.length);
  }
  let finalSanitizedWord = afterWord[0] + sanitizedSinWord.substring(1, sanitizedSinWord.length);
  let finalWord = sinWord.replace(sanitizedSinWord, finalSanitizedWord);
  return finalWord
}


const verifyDataKey = function (item) {
  if (item.getAttribute("data-text") == "true"){
    return true;
  }
  for (let i=0; i<item.children.length; i++){
    if (item.children[i].getAttribute("data-text") == "true"){
      return true;
    }
    if (verifyDataKey(item.children[i])) {
      return true;
    }
  }
  return false;
}

const checkOccurences = function (replace=true){
  const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span, a');

  for (let i=0; i < text.length; i++){
    if (!verifyDataKey(text[i])) {
      if (replace) {
          let tokenPairs = detect3awalem(text[i].innerText);
          if (tokenPairs.length > 0) {
            console.log(text[i]);
            console.log(tokenPairs);
          }
        for (let pair of tokenPairs) {
          let original = pair[0] + " " + pair[1];
          let fixed = humanize3awalem(pair);
          text[i].innerHTML = text[i].innerHTML.replace(original, fixed);
        }
      } else {
        console.log(text[i]);
      }

    }
  }
  setTimeout(checkOccurences, 1000);
}

checkOccurences();