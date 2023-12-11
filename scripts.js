
// Global Variables
let moviesData = [];

const emotionToMoodMapping = { 
    "happy": ["Joyful", "Cheerful", "Playful", "Excited", "Energetic", "Whimsical"],
    "sad": ["Somber", "Nostalgic", "Reflective"],
    "curious": ["Inquisitive", "Curious", "Puzzled", "Perplexed"],
    "angry": ["Tense", "Intense", "Suspicious"],
    "relaxed": ["Relaxed", "Calm", "Soulful"],
    "anxious": ["Anxious", "Worried", "Nervous", "Tense"],
    "bored": ["Reflective", "Thoughtful", "Contemplative"],
    "amused": ["Amused", "Playful", "Whimsical"],
    "inspired": ["Inspired", "Motivated", "Energetic", "Daring"],
    "tired": ["Calm", "Relaxed", "Somber"],
    "excited": ["Excited", "Energetic", "Joyful"],
    "confused": ["Puzzled", "Perplexed", "Inquisitive"],
    "hopeful": ["Hopeful", "Optimistic", "Joyful"],
    "fearful": ["Fearful", "Terrified", "Horrified"],
    "content": ["Content", "Satisfied", "Relaxed"],
    "disappointed": ["Somber", "Reflective"],
    "overwhelmed": ["Anxious", "Tense", "Nervous"],
    "romantic": ["Affectionate", "Loving", "Tender"],
    "lonely": ["Somber", "Nostalgic"],
    "determined": ["Determined", "Brave", "Fearless", "Tenacious"],
    "scared": ["Fearful", "Terrified", "Horrified"],
    "depressed": ["Somber", "Nostalgic", "Reflective"],
    "stressed": ["Anxious", "Tense", "Nervous"],
    "melancholic": ["Somber", "Nostalgic", "Reflective"],
    "joyous": ["Joyful", "Cheerful", "Excited"],
    "intrigued": ["Curious", "Inquisitive"],
    "irate": ["Angry", "Tense", "Intense"],
    "chill": ["Relaxed", "Calm", "Soulful"],
    "panicked": ["Anxious", "Tense", "Nervous"],
    "lighthearted": ["Playful", "Whimsical", "Cheerful"],
    "motivated": ["Inspired", "Energetic", "Daring"],
    "exhausted": ["Calm", "Somber"],
    "elated": ["Excited", "Joyful", "Energetic"],
    "bewildered": ["Confused", "Puzzled", "Perplexed"],
    "optimistic": ["Hopeful", "Joyful"],
    "pessimistic": ["Somber", "Reflective"],
    "enraged": ["Angry", "Intense"],
    "satisfied": ["Content", "Relaxed"],
    "disheartened": ["Disappointed", "Somber"],
    "frustrated": ["Tense", "Anxious"],
    "infatuated": ["Romantic", "Affectionate", "Loving"],
    "isolated": ["Lonely", "Somber", "Nostalgic"],
    "resolute": ["Determined", "Brave"],
    "apathetic": ["Calm", "Relaxed"],
    "ecstatic": ["Excited", "Energetic", "Joyful"],
    "morose": ["Somber", "Reflective", "Nostalgic"],
    "apprehensive": ["Anxious", "Nervous", "Tense"]
};

function populateDropdowns() {
    let genreDropdown = document.getElementById('sortCriteriaGenre');
    let decadeDropdown = document.getElementById('sortCriteriaDecade');

    let uniqueGenres = [...new Set(moviesData.map(movie => movie.primary_genre))];
    let uniqueDecades = [...new Set(moviesData.map(movie => movie.decade))];

    uniqueGenres.forEach(genre => {
        let option = document.createElement('option');
        option.value = genre;
        option.text = genre;
        genreDropdown.appendChild(option);
    });

    uniqueDecades.forEach(decade => {
        let option = document.createElement('option');
        option.value = decade;
        option.text = decade;
        decadeDropdown.appendChild(option);
    });
}

function getResponse(input) {
    let emotions = input.split(',').map(emotion => emotion.trim().toLowerCase());
    let allRecommendations = [];

    let foundValidEmotion = false;  // A flag to track if we found at least one valid emotion

    emotions.forEach(emotion => {
        if (emotionToMoodMapping[emotion]) {
            foundValidEmotion = true;
            emotionToMoodMapping[emotion].forEach(mood => {
                let movieRecommendations = getMoviesByMood(mood);
                allRecommendations = allRecommendations.concat(movieRecommendations);
            });
        }
    });

    if (!foundValidEmotion) {
        alert('Please enter a valid emotion.');
        return;
    }

    // Sort movies by popularity and vote count before displaying
    allRecommendations.sort((a, b) => (b.popularity + b.vote_count + Math.random() * 0.5) - (a.popularity + a.vote_count + Math.random() * 0.5));

    displayRecommendations(allRecommendations);
    
    return `Based on your emotion, I've listed some movie recommendations for you below.`;
}

function getMoviesByMood(mood) {
    let genreFilter = document.getElementById('sortCriteriaGenre').value;
    let decadeFilter = document.getElementById('sortCriteriaDecade').value;

    let recommendedMovies = moviesData.filter(movie => {
        let matchesMood = movie.movie_mood.includes(mood) || movie.genre_moods.includes(mood);
        let matchesGenre = (genreFilter === "all" || movie.primary_genre === genreFilter);
        let matchesDecade = (decadeFilter === "all" || movie.decade === decadeFilter);
        return matchesMood && matchesGenre && matchesDecade;
    });

    return recommendedMovies;
}

function displayRecommendations(movies) {
    let movieListDiv = document.getElementById('movieList');
    movieListDiv.innerHTML = '<strong>Top 50 Recommendations:</strong><br>';
    movies.slice(0, 50).forEach((movie, index) => {
        movieListDiv.innerHTML += `<div>${index + 1}. ${movie.title} (${movie.release_year}, Genre: ${movie.primary_genre}) - Rating: ${movie.vote_average}</div>`;
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    let chatLog = document.getElementById("chatLog");
    chatLog.innerHTML += '<div>Bot: Hello! How are you feeling today? Select an emotion from the dropdown, and I\'ll recommend a movie for you.</div>';
    populateDropdowns();  // Ensure dropdowns are populated
    populateEmotionDropdown(); // Initialize the emotion dropdown
});


function populateEmotionDropdown() {
    const select = document.getElementById('emotionSelect');
    Object.keys(emotionToMoodMapping).forEach(emotion => {
        let option = document.createElement('option');
        option.value = emotion;
        option.textContent = emotion;
        select.appendChild(option);
    });
}

document.getElementById('emotionSelect').addEventListener('change', function() {
    const selectedEmotion = this.value;
    if (selectedEmotion) {
        let chatLog = document.getElementById('chatLog');
        chatLog.innerHTML += `<div class="user-message">User: ${selectedEmotion}</div>`;
        let botResponse = getResponse(selectedEmotion);
        chatLog.innerHTML += `<div class="bot-message">Bot: ${botResponse}</div>`;
    }
});

function sortAndDisplayMovies() {
    let genreFilter = document.getElementById('sortCriteriaGenre').value;
    let decadeFilter = document.getElementById('sortCriteriaDecade').value;

    let sortedAndFilteredMovies = moviesData.filter(movie => {
        let matchesGenre = genreFilter === 'all' || movie.primary_genre === genreFilter;
        let matchesDecade = decadeFilter === 'all' || movie.decade === decadeFilter;
        return matchesGenre && matchesDecade;
    });

    // Sort by rating in descending order
    sortedAndFilteredMovies.sort((a, b) => b.vote_average - a.vote_average);

    displayRecommendations(sortedAndFilteredMovies);
}

document.getElementById('sortButton').addEventListener('click', sortAndDisplayMovies);


// Load movies data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data;
        populateDropdowns();
    });
