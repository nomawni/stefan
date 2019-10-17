
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

console.log(Routes);

Routing.setRoutingData(Routes);

if(document.getElementById("userProfile")) {

let userProfile = document.getElementById("userProfile");

userProfile.addEventListener("click", e => {

    e.preventDefault();
    //alert(e.target);
    console.log(e.target);

    let userProfileModal = document.getElementById("userProfileModal");

    let userProfileModalBody = userProfileModal.querySelector("#userProfileModalBody");

     let showUrl = Routing.generate("user_show"); //"http://localhost:8001/profile/show";

     let response = fetch(showUrl, {
         "method": "POST",
         "cache": "no-cache",
         "credentials": "same-origin",
         headers: {
             "Content-Type": "application/json",
         },
     })
     .then(response => response.json())
     .then(data => {
         console.log(JSON.stringify(data));

         return data;
     })
     .catch(error => console.error(error));

     response.then(data => {

        let profileContainer = document.createElement("div");

        let profileImg = document.createElement("img");

        let userName = document.createElement("h3");

        let userEmail = document.createElement("p");

        let editButton = document.createElement("button");

        editButton.classList.add("btn", "btn-primary");

        editButton.innerHTML = "Edit";

        editButton.onclick = function() { editProfile(data); }

        if(data.avata) {
        profileImg.src = data.avatar.finalPath;

        profileImg.style.width ="50px";
        profileImg.style.height = "50px;";
        profileContainer.appendChild(profileImg);
        }

        userName.innerHTML = data.username;

        userEmail.innerHTML = data.email;    

        profileContainer.appendChild(userName);

        profileContainer.appendChild(userEmail);

        userProfileModalBody.appendChild(profileContainer);

        userProfileModalBody.appendChild(editButton);

     });

     let modalFooter = userProfileModal.querySelector('.modal-footer');

     let updateButton = modalFooter.lastElementChild;

     updateButton.style.display = "none";

     console.log(modalFooter);

     console.log(updateButton);

     //updateButton.style.display = "none";

    $("#userProfileModal").modal('show');

    function editProfile(data) {

        alert("Hello world");

        let url = Routing.generate("user_edit"); //"http://localhost:8001/profile/edit";

        let editForm = document.createElement("Form");
        editForm.setAttribute("method", "POST");
        editForm.setAttribute("enctype", "multipart/form-data");

        editForm.id ="editForm";

        /**
         * The user avatar
         */


        let userAvatar = document.createElement("img");

        if(data.avatar){
        userAvatar.src = data.avatar.finalPath ;

        userAvatar.alt = data.avatar.originalName;
        }

        userAvatar.classList.add("user-avatar");

        userAvatar.style.width = "100px";

        userAvatar.style.height = "100px";

        editForm.appendChild(userAvatar); 
    

        /**
         * Avatar Group
         */

        let avatarGroup = document.createElement("div");

        avatarGroup.classList.add("form-group");

        let avatarLabel = document.createElement("label");

        avatarLabel.setAttribute("for", "avatarFile");

        avatarLabel.style.backgroundImage = data.avatar ? data.avatar.originalName : "";

        avatarLabel.innerHTML = "update avatar";

        avatarGroup.appendChild(avatarLabel);

        let avatarInput = document.createElement("input");

        avatarInput.setAttribute("type", "file");

        avatarInput.setAttribute("name", "avatarFile");

        avatarInput.id = "avatarFile";

        avatarInput.style.opacity = 0;

        avatarInput.addEventListener('change', updateAvatarDisplay);

        avatarGroup.appendChild(avatarInput);

        /**
         * Username Group
         */

        let usernameGroup = document.createElement("div");

        usernameGroup.classList.add("form-group");

        let usernameInput = document.createElement("input");

        usernameInput.setAttribute("type", "text");

        usernameInput.setAttribute("name", "username");

        usernameInput.classList.add("form-control");

        usernameInput.value = data.username;

        usernameGroup.appendChild(usernameInput);

        /**
         * Email Group
         */

        let emailGroup = document.createElement("div");

        emailGroup.classList.add("form-group");

        let emailInput = document.createElement("input");

        emailInput.setAttribute("type", "email");

        emailInput.setAttribute("name", "email");

        emailInput.classList.add("form-control");

        emailInput.value = data.email;

        emailGroup.appendChild(emailInput);

        /**
         * Appending the groups to the 
         */

         editForm.appendChild(avatarGroup);

        editForm.appendChild(usernameGroup);

        editForm.appendChild(emailGroup);

        let response = fetch(url)
         .then(response => response)
         .then(data => { 
             console.log(data); 
            data });

        console.log(response);

        userProfileModalBody.innerHTML = "";

        userProfileModalBody.appendChild(editForm);

        updateButton.onclick = function() { updateProfile(); }

        updateButton.style.display = "inline";

        console.log(response);
    }

    function updateProfile() {

        //alert("Update");

        let profileData = $("#editForm").serializeArray();

        let avatarFile = document.getElementById("avatarFile");

        let userAvatar = userProfileModalBody.querySelector(".user-avatar");
      
        var selectedAvatar = avatarFile.files[0];

        console.log(profileData);

        console.log(selectedAvatar);

        let content = new Object();

        profileData.map(data => {

            content[data.name] = data.value;

        });

        console.log(content); 

        let editFormData = document.querySelector("#editForm");

        //let formData = new FormData(editFormData);

        //formData.append("avatarFile", selectedAvatar);

        //content["avatarFile"] = formData;

        console.log("------FormData------");

        //console.log(formData);

         content = JSON.stringify(content);

         let data = {
             content: content
         }

         /*const blob = new Blob([content], {
             type: "application/json"
         }); */

         let formData = new FormData();
         
         formData.append('data', content);

         formData.append("avatarFile", selectedAvatar);

        console.log(content);

        var sBoundary = "---------------------------" + Date.now().toString(16);

        let url = Routing.generate('user_edit'); //"http://localhost:8001/profile/edit";

        let response = fetch(url, {
            "method": "POST",
            "cache": "no-cache",
            "credentials": "same-origin", 
            headers: {
                //"Content-Type": "application/json",
                'Accept': 'application/json',
                //'Content-Type': `multipart/form-data; charset=UTF-8; boundary=${sBoundary}`,
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
             console.log(JSON.stringify(data));

             return data;
        })
        .catch(error => console.error(error));

        response.then(data => {

            let usernames = document.querySelectorAll(".username");

            usernames.forEach(function(elem, pos) {

                elem.innerHTML = data.username;

            });
            console.log(data);
        });
    }

    $("#userProfileModal").on('hidden.bs.modal', e => {
        userProfileModalBody.innerHTML = "";
    });

    function updateAvatarDisplay() {
        //while(preview.firstChild) {
         /// preview.removeChild(preview.firstChild);
        //}

        let avatarFile = document.getElementById("avatarFile");

        let userAvatar = userProfileModalBody.querySelector(".user-avatar");
      
        var selectedAvatar = avatarFile.files[0];
        if(selectedAvatar) {
            var para = document.createElement('p');

            if(validFileType(selectedAvatar)) {
                // para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                // var image = document.createElement('img');
                userAvatar.src = window.URL.createObjectURL(selectedAvatar);
         
                 //listItem.appendChild(image);
                // listItem.appendChild(para);
         
               } else {
                 para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                 //listItem.appendChild(para);
               }
        } else {

          var para = document.createElement('p');
          para.textContent = 'No files currently selected for upload';
          preview.appendChild(para);
         // var list = document.createElement('ol');
         // preview.appendChild(list);
         // for(var i = 0; i < curFiles.length; i++) {
          //  var listItem = document.createElement('li');
         //   var para = document.createElement('p');
            
      
            //list.appendChild(listItem);
        }
      }
    
      var fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
      ]
      
      function validFileType(file) {
        for(var i = 0; i < fileTypes.length; i++) {
          if(file.type === fileTypes[i]) {
            return true;
          }
        }
      
        return false;
      }
    
      function returnFileSize(number) {
        if(number < 1024) {
          return number + 'bytes';
        } else if(number >= 1024 && number < 1048576) {
          return (number/1024).toFixed(1) + 'KB';
        } else if(number >= 1048576) {
          return (number/1048576).toFixed(1) + 'MB';
        }
      } 
    
});

}