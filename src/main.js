let session;

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = true;
recognition.start();

recognition.onresult = function(event) {
  const numTranscripts = Object.keys(event.results).length;

  if (!numTranscripts) {
    console.log('No transcripts');
    return;
  }

  const result = event.results[numTranscripts - 1];
  const transcript = result[0].transcript;

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
var SERVER_BASE_URL = 'https://v-kpheng-sample-app.herokuapp.com';
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
  var publisher = OT.initPublisher('speaker', {
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
    const { connectionId } = session.connection;

    document.getElementById('transcript').innerText = data;
  });
}
