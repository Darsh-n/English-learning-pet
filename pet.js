import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, BookOpen, Star, Sparkles, Award } from 'lucide-react';

const DigitalPet = () => {
  const [pet, setPet] = useState({
    name: 'Wordy',
    level: 1,
    experience: 0,
    happiness: 80,
    intelligence: 10,
    vocabulary: ['hello', 'friend', 'learn', 'grow'],
    personality: 'curious',
    color: '#4F46E5',
    size: 100,
    phrases: ['Hello there!', 'I love learning!', 'Teach me more!'],
    lastInteraction: new Date().toDateString(),
    streakDays: 1,
    totalWords: 4,
    favoriteWords: [],
    mood: 'happy'
  });

  const [userInput, setUserInput] = useState('');
  const [petSaying, setPetSaying] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Pet personalities and their effects
  const personalities = {
    curious: { color: '#4F46E5', bonus: 'learns 2x faster' },
    playful: { color: '#EC4899', bonus: 'gains extra happiness' },
    wise: { color: '#059669', bonus: 'remembers more words' },
    energetic: { color: '#DC2626', bonus: 'levels up faster' },
    gentle: { color: '#7C3AED', bonus: 'very loyal companion' }
  };

  // Extract words from input
  const extractWords = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  };

  // Calculate level from experience
  const calculateLevel = (exp) => Math.floor(exp / 100) + 1;

  // Get pet's mood based on stats
  const getPetMood = (happiness, intelligence) => {
    if (happiness > 80 && intelligence > 50) return 'excited';
    if (happiness > 60) return 'happy';
    if (happiness > 40) return 'content';
    if (happiness > 20) return 'tired';
    return 'sad';
  };

  // Generate pet response
  const generateResponse = (newWords, totalWords) => {
    const responses = [
      `Wow! I learned ${newWords.length} new words: ${newWords.slice(0, 3).join(', ')}!`,
      `Amazing! My vocabulary is growing! I now know ${totalWords} words!`,
      `That's fascinating! I especially like the word "${newWords[0]}"!`,
      `Thank you for teaching me! I feel smarter already!`,
      `Incredible! These new words make me so happy!`,
      `I'm getting better at English thanks to you!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle user input
  const handleInteraction = () => {
    if (!userInput.trim()) return;

    const inputWords = extractWords(userInput);
    const newWords = inputWords.filter(word => !pet.vocabulary.includes(word));
    
    setIsAnimating(true);
    
    setPet(prevPet => {
      const newVocabulary = [...prevPet.vocabulary, ...newWords];
      const experienceGain = newWords.length * 15 + inputWords.length * 2;
      const newExperience = prevPet.experience + experienceGain;
      const newLevel = calculateLevel(newExperience);
      const happinessGain = Math.min(newWords.length * 5 + 10, 20);
      const intelligenceGain = newWords.length * 2;
      
      // Update favorite words (most frequent)
      const wordCount = {};
      newVocabulary.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      const favoriteWords = Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);

      // Check for personality evolution
      let newPersonality = prevPet.personality;
      if (newLevel > prevPet.level && newLevel % 3 === 0) {
        const personalityKeys = Object.keys(personalities);
        newPersonality = personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
      }

      const newHappiness = Math.min(prevPet.happiness + happinessGain, 100);
      const newIntelligence = prevPet.intelligence + intelligenceGain;
      const newMood = getPetMood(newHappiness, newIntelligence);

      return {
        ...prevPet,
        vocabulary: newVocabulary,
        experience: newExperience,
        level: newLevel,
        happiness: newHappiness,
        intelligence: newIntelligence,
        personality: newPersonality,
        color: personalities[newPersonality].color,
        size: Math.min(100 + newLevel * 10, 200),
        totalWords: newVocabulary.length,
        favoriteWords,
        mood: newMood,
        lastInteraction: new Date().toDateString()
      };
    });

    // Generate pet response
    if (newWords.length > 0) {
      setPetSaying(generateResponse(newWords, pet.totalWords + newWords.length));
    } else {
      setPetSaying("I love chatting with you! Tell me something new!");
    }

    setUserInput('');
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Pet visual component
  const PetVisual = () => {
    const eyeStyle = pet.mood === 'excited' ? '◉' : pet.mood === 'happy' ? '●' : pet.mood === 'sad' ? '◔' : '○';
    const mouthStyle = pet.mood === 'excited' ? '▽' : pet.mood === 'happy' ? '◡' : pet.mood === 'sad' ? '◜' : '—';
    
    return (
      <div 
        className={`relative mx-auto transition-all duration-1000 ${isAnimating ? 'animate-bounce' : ''}`}
        style={{ 
          width: pet.size, 
          height: pet.size,
          backgroundColor: pet.color,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: pet.size / 6,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: `4px solid ${pet.color}20`
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          {eyeStyle} {eyeStyle}
        </div>
        <div>{mouthStyle}</div>
        {pet.level > 5 && (
          <Sparkles 
            className="absolute -top-2 -right-2 text-yellow-400" 
            size={20}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meet {pet.name}! 
            <Star className="inline ml-2 text-yellow-500" size={28} />
          </h1>
          <p className="text-gray-600">Your AI companion that grows with every word you teach!</p>
        </div>

        {/* Pet Display */}
        <div className="flex justify-center mb-6">
          <PetVisual />
        </div>

        {/* Pet Speech */}
        {petSaying && (
          <div className="bg-blue-100 rounded-lg p-4 mb-6 text-center">
            <MessageCircle className="inline mr-2 text-blue-600" size={20} />
            <span className="text-blue-800 font-medium">{petSaying}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-100 rounded-lg p-4 text-center">
            <Award className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-2xl font-bold text-purple-800">Level {pet.level}</div>
            <div className="text-sm text-purple-600">Experience: {pet.experience}</div>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-600" size={24} />
            <div className="text-2xl font-bold text-red-800">{pet.happiness}%</div>
            <div className="text-sm text-red-600">Happiness</div>
          </div>
          
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-green-600" size={24} />
            <div className="text-2xl font-bold text-green-800">{pet.intelligence}</div>
            <div className="text-sm text-green-600">Intelligence</div>
          </div>
          
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <Sparkles className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold text-blue-800">{pet.totalWords}</div>
            <div className="text-sm text-blue-600">Words Known</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Teach {pet.name} something new in English:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInteraction()}
              placeholder="Type a sentence, story, or anything in English..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleInteraction}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Teach!
            </button>
          </div>
        </div>

        {/* Pet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">Pet Profile</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Personality:</strong> {pet.personality} ({personalities[pet.personality].bonus})</div>
              <div><strong>Mood:</strong> {pet.mood}</div>
              <div><strong>Last Interaction:</strong> {pet.lastInteraction}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">Favorite Words</h3>
            <div className="flex flex-wrap gap-2">
              {pet.favoriteWords.slice(0, 10).map((word, index) => (
                <span 
                  key={index}
                  className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress to Level {pet.level + 1}</span>
            <span>{pet.experience % 100}/100 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(pet.experience % 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-800 mb-2">💡 Tips to help your pet grow:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Share stories, poems, or interesting facts</li>
          <li>• Use varied vocabulary and complex sentences</li>
          <li>• Interact daily to keep your pet happy</li>
          <li>• Watch your pet evolve personalities as it levels up!</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalPet;
