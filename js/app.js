// replace these values with those generated in your Video API account
// var apiKey = "YOUR_API_KEY";
// var sessionId = "YOUR_SESSION_ID";
// var token = "YOUR_TOKEN";

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

const connectElement = document.getElementById("connect");
const sendSignalElement = document.getElementById("send-signal");
const publishElement = document.getElementById("publish");

const apiElement = document.getElementById("apiKey");
const sessionIdElement = document.getElementById("sessionId");
const tokenElement = document.getElementById("token");

var currentSession = null;

connectElement.addEventListener("click", () => {
  currentSession = initializeSession(
    apiElement.value,
    sessionIdElement.value,
    tokenElement.value
  );
  // initializeSession();
});

sendSignalElement.addEventListener("click", () => {
  if (!currentSession) {
    alert("Please connect first");
    return;
  }
  currentSession.signal(
    {
      type: "foo",
      data: "hello",
    },
    function (error) {
      if (error) {
        console.log("signal error: " + error.message);
      } else {
        console.log("signal sent");
      }
    }
  );
});
// (optional) add server code here
// initializeSession();

function initializeSession(apiKey, sessionId, token) {
  const session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on("streamCreated", function (event) {
    console.log("streamCreated", event);
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      handleError
    );
  });

  session.on("signal", function (event) {
    console.log("Signal sent from connection: " + event.from.id);
    console.log("Signal data: " + event.data);
  });

  // Create a publisher

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      // session.publish(publisher, handleError);
      console.log("connected");
    }
  });

  return session;
}

publishElement.addEventListener("click", () => {
  if (!currentSession) {
    alert("Please connect first");
    return;
  }

  var publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%",
    },
    handleError
  );

  currentSession.publish(publisher, handleError);
});
