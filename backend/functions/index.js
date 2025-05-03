const functions = require("firebase-functions");

/**
 * A very simple callable function for testing.
 * It expects a 'name' property in the data object and returns a greeting.
 * If no name is provided, it uses "world".
 */
exports.sayHello = functions.https.onCall((data, context) => {
  // Log the data received (useful for debugging)
  console.log("Data received:", data);

  // Get the name from the data object passed by the client, default to "world"
  const name = data?.name || "world";

  // Construct the greeting message
  const message = `Hello, ${name}! This message came from the local emulator.`;

  // Log the message we're sending back
  console.log("Sending back:", message);

  // Return the greeting as a JSON object
  return {
    greeting: message,
  };
});