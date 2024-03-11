import React, { useState, useEffect } from 'react'

export default function App(){
  const [transcription, setTranscription] = useState('')
  const [translation, setTranslation] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognition = new window.webkitSpeechRecognition() // Chrome-specific API

  useEffect(() => {
    recognition.lang = 'es-ES'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = event => {
      const last = event.results.length - 1
      const transcription = event.results[last][0].transcript
      setTranscription(transcription)
      
      fetch('http://localhost:5000/translate',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text:transcription})
      }).then(incoming=>incoming.json())
      .then(data=>{
        console.log("Response: ", data)
        setTranslation(data.response)
  
      })
   
 
    }

    recognition.onend = () => {
      // setIsListening(false)
      recognition.start()
    }

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    return () => {
      recognition.abort()
    }
  }, [])


  const speak = (txt) => {
    const utterance = new SpeechSynthesisUtterance(txt)
    utterance.lang = 'en-US' // Set language
    utterance.pitch = 1. // Set pitch (0 to 2)
    utterance.rate = 1 // Set rate (0.1 to 10)
    utterance.volume = 1 // Set volume (0 to 1)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(()=>{
    speak(translation)
  },[translation])
  
  

  const toggleListening = () => {
    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  return (
    <div>
      <h1>Speech to Text Transcriber</h1>
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div>
        <h2>Transcription:</h2>
        <p>{transcription}</p>
        <h2>Translation:</h2>
        <p>{translation}</p>
      </div>
    </div>
  )
}


