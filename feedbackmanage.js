// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
  
    // Load existing feedback from local storage
    loadFeedback();
  
    // Handle form submission
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const name = document.getElementById('name').value.trim();
      const message = document.getElementById('message').value.trim();
  
      if (name === '' || message === '') {
        alert('Please fill in all fields.');
        return;
      }
  
      const feedback = {
        name: name,
        message: message,
        date: new Date().toLocaleString()
      };
  
      saveFeedback(feedback);
      displayFeedback(feedback);
      feedbackForm.reset();
    });
  
    // Save feedback to local storage
    function saveFeedback(feedback) {
      let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks.push(feedback);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  
    // Load and display feedback from local storage
    function loadFeedback() {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks.forEach(displayFeedback);
    }
  
    // Display feedback on the page
    function displayFeedback(feedback) {
      const item = document.createElement('li');
      item.innerHTML = `<strong>${feedback.name}</strong> (${feedback.date}): ${feedback.message}`;
      feedbackList.appendChild(item);
    }
  });