import React, { useState, useEffect } from 'react';
import { BusData } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  Sparkles, 
  ArrowRight, 
  MessageSquare,
  Bus,
  RefreshCw,
  Check
} from 'lucide-react';

interface AIVoiceProps {
  buses: BusData[];
  onSelectBus: (bus: BusData) => void;
}

type Language = 'en' | 'ta';

export const AIVoice: React.FC<AIVoiceProps> = ({ buses, onSelectBus }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<{
    text: string;
    tamilText?: string;
    matchedBus?: BusData;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize with welcome query
  useEffect(() => {
    if (!assistantReply) {
      setAssistantReply({
        text: 'Hello! I am your Smart Bus Chennai voice companion. Ask me about crowd levels, routes, or arrival times for buses like 70A, 65, or 26G.',
        tamilText: 'வணக்கம்! நான் உங்கள் ஸ்மார்ட் பஸ் குரல் உதவியாளர். 70A, 65 அல்லது 26G பஸ்களின் கூட்ட நெரிசல் மற்றும் வருகை நேரம் பற்றி கேளுங்கள்.',
      });
    }
  }, []);

  const exampleQueries = {
    en: [
      'Which bus goes to Broadway?',
      'Is Bus 70A crowded?',
      'When will Bus 65 arrive?',
      'Show me less crowded buses',
    ],
    ta: [
      'பிராட்வே செல்லும் பேருந்து எது?',
      'பஸ் 70A கூட்டமாக இருக்கிறதா?',
      'பஸ் 65 எப்போது வரும்?',
      'கூட்டம் குறைந்த பேருந்துகள் எவை?',
    ],
  };

  const processQuery = (query: string) => {
    const q = query.toLowerCase();
    setTranscript(query);

    // Bus 70A query
    if (q.includes('70a') || q.includes('70') || q.includes('70ஏ')) {
      const bus = buses.find((b) => b.busNumber === '70A') || buses[0];
      setAssistantReply({
        text: `Bus 70A (Avadi to Broadway) is currently ${bus.status} with ${bus.standing_count ?? 11} standing passengers. It will arrive in ${bus.eta}.`,
        tamilText: `பஸ் 70A (ஆவடி முதல் பிராட்வே) தற்போது ${bus.status === 'Crowded' ? 'கூட்டமாக உள்ளது (Crowded)' : bus.status}. ${bus.standing_count ?? 11} பேர் நிற்கின்றனர். ${bus.eta} நிமிடத்தில் வரும்.`,
        matchedBus: bus,
      });
      speakText(
        language === 'ta'
          ? `பஸ் 70A தற்போது கூட்டமாக உள்ளது. 11 பேர் நிற்கின்றனர். ${bus.eta} நிமிடத்தில் வரும்.`
          : `Bus 70A is currently ${bus.status} with ${bus.standing_count ?? 11} standing passengers. Arriving in ${bus.eta}.`
      );
      return;
    }

    // Bus 65 query
    if (q.includes('65') || q.includes('t nagar') || q.includes('டி நகர்')) {
      const bus = buses.find((b) => b.busNumber === '65') || buses[1];
      setAssistantReply({
        text: `Bus 65 is ${bus.eta} away heading towards T Nagar. The onboard YOLO camera reports: ${bus.status} with ${bus.standing_count ?? 9} standing.`,
        tamilText: `பஸ் 65 டி நகர் நோக்கி செல்கிறது. வருகை நேரம் ${bus.eta}. கூட்ட நிலை: ${bus.status}. ${bus.standing_count ?? 9} பேர் நிற்கின்றனர்.`,
        matchedBus: bus,
      });
      speakText(
        language === 'ta'
          ? `பஸ் 65 வருகை நேரம் 5 நிமிடங்கள். கூட்ட நிலை: ${bus.status}.`
          : `Bus 65 is ${bus.eta} away heading towards T Nagar with status ${bus.status}.`
      );
      return;
    }

    // Broadway query
    if (q.includes('broadway') || q.includes('பிராட்வே')) {
      const broadwayBuses = buses.filter((b) => b.destination.toLowerCase().includes('broadway'));
      const bestBus = broadwayBuses.find((b) => b.status !== 'Overcrowded') || broadwayBuses[0];
      setAssistantReply({
        text: `Buses 70A and 26G both run to Broadway. Bus 70A is ${buses.find(b => b.busNumber === '70A')?.status} (ETA 6m), while Bus 26G is currently Overcrowded (ETA 5m). We recommend Bus 70A.`,
        tamilText: `பிராட்வேக்கு பஸ் 70A மற்றும் 26G செல்கின்றன. பஸ் 70A மிதமான கூட்டம் (Crowded), ஆனால் பஸ் 26G அதிக கூட்டம் (Overcrowded). பஸ் 70A பரிந்துரைக்கப்படுகிறது.`,
        matchedBus: bestBus,
      });
      speakText(
        language === 'ta'
          ? `பிராட்வேக்கு பஸ் 70A மற்றும் 26G செல்கின்றன. பஸ் 70A பரிந்துரைக்கப்படுகிறது.`
          : `Buses 70A and 26G go to Broadway. We recommend Bus 70A.`
      );
      return;
    }

    // Less crowded query
    if (q.includes('less') || q.includes('comfortable') || q.includes('குறைந்த')) {
      const lessCrowded = buses.find((b) => b.status === 'Less Crowded') || buses[4];
      setAssistantReply({
        text: `Bus ${lessCrowded.busNumber} (${lessCrowded.route}) is currently Less Crowded with only ${lessCrowded.standing_count ?? 2} standing passengers!`,
        tamilText: `பஸ் ${lessCrowded.busNumber} (${lessCrowded.route}) தற்போது கூட்டம் குறைவாக உள்ளது. ${lessCrowded.standing_count ?? 2} பேர் மட்டுமே நிற்கின்றனர்!`,
        matchedBus: lessCrowded,
      });
      speakText(
        language === 'ta'
          ? `பஸ் ${lessCrowded.busNumber} தற்போது கூட்டம் குறைவாக உள்ளது.`
          : `Bus ${lessCrowded.busNumber} is currently Less Crowded.`
      );
      return;
    }

    // General fallback response
    const defaultBus = buses[0];
    setAssistantReply({
      text: `Tracking 5 active buses on Chennai corridors. Bus 70A is ${buses[0].status} (${buses[0].eta}), Bus 65 is ${buses[1].status} (${buses[1].eta}), and Bus 41D is ${buses[4].status}.`,
      tamilText: `சென்னையில் 5 பஸ்கள் கண்காணிக்கப்படுகின்றன. பஸ் 70A: ${buses[0].status}, பஸ் 65: ${buses[1].status}, பஸ் 41D: ${buses[4].status}.`,
      matchedBus: defaultBus,
    });
    speakText(
      language === 'ta'
        ? `சென்னையில் 5 பஸ்கள் இயக்கத்தில் உள்ளன.`
        : `Tracking 5 active buses across Chennai corridors.`
    );
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setIsSpeaking(false);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check if browser SpeechRecognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setIsListening(false);
          processQuery(speechResult);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation if microphone access is blocked in iframe sandbox
          simulateVoiceInput();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback simulation
        simulateVoiceInput();
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const randomQuery = language === 'ta'
        ? exampleQueries.ta[Math.floor(Math.random() * exampleQueries.ta.length)]
        : exampleQueries.en[Math.floor(Math.random() * exampleQueries.en.length)];
      processQuery(randomQuery);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Languages className="w-3.5 h-3.5 text-teal-400" />
          <span>Multilingual Voice Engine (English / தமிழ்)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multilingual AI Voice Assistant
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium">
          Ask about buses, routes and crowd levels using your voice.
        </p>
      </div>

      {/* Language Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            id="lang-en-btn"
            onClick={() => setLanguage('en')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              language === 'en'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>English</span>
            {language === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
          <button
            id="lang-ta-btn"
            onClick={() => setLanguage('ta')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              language === 'ta'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>தமிழ் (Tamil)</span>
            {language === 'ta' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* Large Microphone Hero Centerpiece */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative">
          {/* Animated pulse ripple rings when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-teal-500/30 animate-ping" />
              <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-pulse" />
            </>
          )}

          <button
            id="btn-voice-mic"
            onClick={toggleListening}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-rose-500/40 ring-4 ring-rose-400/40'
                : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-slate-950 hover:from-teal-400 hover:to-cyan-500 shadow-teal-500/40 ring-4 ring-teal-500/20'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-10 h-10 animate-bounce" />
                <span className="text-[10px] font-extrabold uppercase mt-1">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 stroke-[2.5]" />
                <span className="text-[10px] font-extrabold uppercase mt-1">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-1.5">
          {isListening ? (
            <span className="text-amber-400 animate-pulse font-semibold">
              Listening to voice input... speak your query now
            </span>
          ) : (
            <span>Tap the microphone or click an example query below</span>
          )}
        </p>
      </div>

      {/* Assistant Voice Response Display Card */}
      {assistantReply && (
        <div 
          id="voice-response-card"
          className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-950/70 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold uppercase">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Smart Bus AI Voice Companion</span>
            </div>

            <button
              onClick={() => speakText(language === 'ta' && assistantReply.tamilText ? assistantReply.tamilText : assistantReply.text)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 transition-colors"
              title="Replay Audio Voice"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-amber-400' : ''}`} />
            </button>
          </div>

          {transcript && (
            <div className="mb-3 text-xs text-slate-400 font-medium italic">
              User: "{transcript}"
            </div>
          )}

          <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
            {language === 'ta' && assistantReply.tamilText 
              ? assistantReply.tamilText 
              : assistantReply.text}
          </p>

          {/* If a specific bus was matched in query */}
          {assistantReply.matchedBus && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 p-4 sm:px-7 rounded-b-2xl">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 font-black flex items-center justify-center text-sm border border-teal-500/30">
                  {assistantReply.matchedBus.busNumber}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">
                    BUS {assistantReply.matchedBus.busNumber} • {assistantReply.matchedBus.route}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ETA: {assistantReply.matchedBus.eta} • Location: {assistantReply.matchedBus.currentLocation}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CrowdBadge status={assistantReply.matchedBus.status} standingCount={assistantReply.matchedBus.standing_count} size="sm" />
                <button
                  onClick={() => onSelectBus(assistantReply.matchedBus!)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-3 py-1.5 rounded-lg border border-teal-500/30 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Example queries chips */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
          <span>Or try one of these voice queries:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(language === 'ta' ? exampleQueries.ta : exampleQueries.en).map((query, idx) => (
            <button
              key={idx}
              onClick={() => processQuery(query)}
              className="text-left px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-xs sm:text-sm text-slate-300 hover:text-teal-200 transition-all flex items-center justify-between group"
            >
              <span>"{query}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
