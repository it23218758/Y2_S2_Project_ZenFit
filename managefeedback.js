document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');
  
    let editingIndex = null;
  
    loadFeedback();
  
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();
  
      if (!name || !message) {
        alert('Please fill in all fields.');
        return;
      }
  
      const feedback = {
        name,
        message,
        date: new Date().toLocaleString()
      };
  
      if (editingIndex !== null) {
        updateFeedback(editingIndex, feedback);
        editingIndex = null;
        submitButton.textContent = "Submit";
      } else {
        saveFeedback(feedback);
      }
  
      feedbackForm.reset();
      feedbackList.innerHTML = '';
      loadFeedback();
    });
  
    function saveFeedback(feedback) {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks.push(feedback);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  
    function loadFeedback() {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks.forEach((feedback, index) => {
        displayFeedback(feedback, index);
      });
    }
  
    function displayFeedback(feedback, index) {
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${feedback.name}</strong> (${feedback.date}): ${feedback.message}
        <button onclick="editFeedback(${index})">Edit</button>
      `;
      feedbackList.appendChild(item);
    }
  
    window.editFeedback = function (index) {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      const feedback = feedbacks[index];
      nameInput.value = feedback.name;
      messageInput.value = feedback.message;
      editingIndex = index;
      submitButton.textContent = "Update";
    }
  
    function updateFeedback(index, newFeedback) {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks[index] = newFeedback;
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  });