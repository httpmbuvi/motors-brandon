document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuBtn.querySelector('i');

    menuBtn.addEventListener('click', () => {
        // Toggle the 'active' class to show/hide the mobile menu
        navLinks.classList.toggle('active');

        // Toggle the hamburger/close icon
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            menuIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // --- Admin Photo Uploader Logic ---
    const photoUploadInput = document.getElementById('photo-upload-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const addCarForm = document.getElementById('add-car-form');
    let uploadedFiles = []; // Array to store the actual File objects

    if (photoUploadInput && imagePreviewContainer) {
        photoUploadInput.addEventListener('change', function(event) {
            const files = Array.from(event.target.files);
            if (files) {
                handleFiles(files);
            }
        });
    }

    function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith('image/')) { continue }

            // Store the file object
            uploadedFiles.push(file);

            const previewWrapper = document.createElement('div');
            previewWrapper.classList.add('image-preview-wrapper');
            // Associate the preview with the file for easy removal
            previewWrapper.setAttribute('data-filename', file.name);

            const img = document.createElement('img');
            img.classList.add('image-preview');
            img.file = file;

            const reader = new FileReader();
            reader.onload = (e) => { img.src = e.target.result; };
            reader.readAsDataURL(file);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-image-btn');
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', function() {
                previewWrapper.remove();
                // Remove the file from our array
                uploadedFiles = uploadedFiles.filter(f => f.name !== file.name);
            });

            previewWrapper.appendChild(img);
            previewWrapper.appendChild(removeBtn);
            imagePreviewContainer.appendChild(previewWrapper);
        }
        // Clear the input so the user can add more files if they want
        photoUploadInput.value = '';
    }

    // --- Form Submission Logic ---
    if (addCarForm) {
        addCarForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default form submission

            // 1. Create a FormData object to hold all form data
            const formData = new FormData(addCarForm);

            // 2. Append the uploaded image files
            uploadedFiles.forEach(file => {
                formData.append('photos[]', file); // 'photos[]' is a common convention for multiple files
            });

            // 3. --- THIS IS WHERE THE BACKEND INTEGRATION HAPPENS ---
            // A backend developer would replace this block with a real API call.
            // The `fetch` function sends the data to the server.
            console.log("--- Sending data to server (simulation) ---");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            console.log("-------------------------------------------");

            alert("Car data and images are ready to be sent to the server!\n\n(Check the console for details). In a real application, you would now be redirected.");

            // 4. On success, redirect to the manage cars page.
            // In a real app, this would be inside the .then() of a successful fetch() call.
            window.location.href = 'admin-manage-cars.html';

            /* Example of a real fetch call:
            fetch('/api/cars', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = 'admin-manage-cars.html';
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            */
        });
    }
});