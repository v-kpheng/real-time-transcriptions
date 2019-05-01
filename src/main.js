let session;

const api = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;

if (!api) {
  throw new Error("This browser doesn't support the Speech Recognition API");
}

const recognition = new api();

// Language Speech Recognition engine (SR) should understand
// If not specified, then it will default to the language the user agent
// (i.e., browser) is set to
recognition.lang = 'en-US';
recognition.interimResults = false;

// Keep listening and transcribing as long as the app is open
recognition.continuous = true;

// Brings up the "Allow microphone access" dialog and starts the SR engine
recognition.start();

// An utterance (the word(s), phrase(s), and/or sentence(s)) was detected
// and understood
recognition.onresult = function(event) {
  // Index of the most recent utterance that was understood
  const { resultIndex } = event;

  // Parse the most recent utterance
  const result = event.results[resultIndex];
  const transcript = result[0].transcript;

  // Broadcast transcript
  session.signal(
    {
      retryAfterReconnect: false,
      data: transcript,
      type: 'transcript'
    },
    function(error) {
      if (error) {
        console.log(JSON.stringify(error));
      }
    }
  );
};

recognition.onerror = function(event) {
  console.log(`Error: ${event.error}`);
};

// (optional) add server code here
const SERVER_BASE_URL = 'https://v-kpheng-sample-app.herokuapp.com';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
  return res.json();
}).then(function(res) {
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeSession();
}).catch(handleError);

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream

  // Create a publisher
  const publisher = OT.initPublisher('speaker', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  // Subscribe to a newly created stream

  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'participants', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    });
  });

  session.on('signal:transcript', function(event) {
    const { data, from } = event;

    document.getElementById('transcript').innerText = data;
  });
}
