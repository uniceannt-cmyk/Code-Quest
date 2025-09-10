        window.onload = function(){  //chechks of the image was saved.
            const saveImage = localStorage.getItem('profile'); //retrieves the saved images.
            if (saveImage){
                document.getElementById('set-pfp').src = saveImage; //updates the src of the <img> tag to show the savd images.
            }
        };

        function pfpImage(event){ //it triggeers when the user selects new file. reads the image and display it immediately
            const reader = new FileReader(); //creates reader to comvert in uploaded file into readable format
            reader.onload = function (){ //defines what happens once the file is read
                const preview = document.getElementById('set-pfp');
                preview.src = reader.result; //updates the image preview with the upload image.
                localStorage.setItem('profile', reader.result); //saves the image data
            }
            reader.readAsDataURL(event.target.files[0]);
        }