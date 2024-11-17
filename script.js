
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const suggestion = document.getElementById('suggestion').value.trim();
  const errorDiv = document.getElementById('error');
  
  errorDiv.innerHTML = ''; // Clear previous error messages

  let errors = [];

  // Name validation
  if (name.length <= 3) {
      errors.push('Name must be more than 3 characters long.');
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      errors.push('Please enter a valid email address.');
  }

  // Phone number validation
  const phonePattern = /^\d+$/;
  if (!phonePattern.test(phone)) {
      errors.push('Phone number must only contain numeric values.');
  }

  // Suggestion validation
  if (suggestion === '') {
      errors.push('Suggestion box cannot be empty.');
  }

  // Display errors or submit form
  if (errors.length > 0) {
      errorDiv.innerHTML = errors.join('<br>');
  } else {
      alert('Form submitted successfully!');
      document.getElementById('contactForm').reset();
  }
}
