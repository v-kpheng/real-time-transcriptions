# Real-time transcriptions of video stream

This is an app that showcases real-time-ish transcriptions of a video stream using TokBox and the experimental [Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Introduction

Speech recognition is the ability of a computer to hear what you are saying and understand what is being said.  The Speech Recognition API facilitates this.  The API is a subset of the Web Speech API, which is composed of the Speech Synthesis API (text-to-speech) and Speech Recognition API (speech-to-text).  The Speech Recognition API is experimental.  Only Chrome supports it.

## A brief intro to linguistics

Linguistics is the study of language and it's structure.  The words in a language are composed of phonemes, or sounds.

__Phonemes of "food"__
* `f`
* `oo`
* `d`

A dictionary maps words to their pronounications.

__Dictionary with three words__
* food: `f`, `oo`, `d`
* is: `i`, `z`
* yummy: `y`, `uh`, `m`, `m`

A lexicon helps provide context.

__Lexicon__
* food: noun
* is: verb
* yummy: adjective

Speech is composed of utterances.  Utterances are delimited by some pause.  An utterance can be a word, phrase, one or more sentences, or some mixture of the preceeding.

__Utterances__
* Word: "Hi"
* Phrase: "Open door"
* Sentence: "The door is closed."
* Sentences: "The door is closed.  Please open the door."
* Mix: "The door is closed.  Please open the door.  Fridge"

The grammar is the words and phrases a speech recognition engine should understand.  The grammar below specifies the words and phrases a speech recognition engine should recognize.

```
#JSGF V1.0;                           // Self-identifying header (tells parser that this is a grammar file)
grammar colors;                       // Name of this grammar
                                      // Alternative, can also be called 'com.tokbox.grammars.colors'
public <color> = blue | red | green ; // Grammar rule
```
## Theory of operation

Speech is captured by a recording device.  The API makes a REST call to a Speech Recognition (SR) service (the API is tech agnostic; a different service can be specified and used, like Alexa or Siri), including the (digitized and encoded) speech as the payload to the request.  The SR service returns a response.  If the utterance was understood, a `result` event is fired.  Else, an `error` event is triggered.

## The code

In this application, no grammar is defined.  As a result, the API will dispatch a `result` event everytime a match (i.e., the speech recognition service understood what was being said) is found.

```
recognition.onresult = function(event) {
  // SR service understood what speaker was saying.  Send transcript to other subscribers.
  const transcript = getTranscript(event);

  session.signal(
    {
      retryAfterReconnect: false,
      data: transcript,
      type: 'transcript'
    }
  );
}
```

## Running

Clone the repository and open up `src/index.html` in Chrome.  You will be asked to grant the browser with microphone and camera access.  Please do so.  Once your image appears on screen, feel free to speak.  With some delay, you'll see a transcription of you what said appear beneath the video.

You can open up the page in additional browser tabs as well.  Subsequent video feeds will appear at the bottom of the page.

## Notes
The Speech Recognition API is experimental and is [currently only supported by Chrome](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility).

## References
* [Voice command demo](https://mdn.github.io/web-speech-api/speech-color-changer/)
* [Glossary of speech recognition terms](https://www.lumenvox.com/resources/tips/tipsGlossary.aspx)
* [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
* [Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
* [W3 Web Speech API spec](https://w3c.github.io/speech-api)
