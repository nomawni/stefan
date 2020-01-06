
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../public/js/fos_js_routes.json';
import AccountValidation from './confirmation/account_validation.js';
import ChangePassword from './confirmation/change_password.js';

console.log(Routes);

Routing.setRoutingData(Routes);

if(document.getElementById("userProfile")) {

let userProfile = document.getElementById("userProfile");

userProfile.addEventListener("click", e => {

    e.preventDefault();
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
        
        let profileContainerWrapper = document.createElement('div');
        profileContainerWrapper.classList.add('profile-container-wrapper');
        let profileContainer = document.createElement("div");
        profileContainer.classList.add("profile-container");

        profileContainerWrapper.appendChild(profileContainer);

        let profileImg = document.createElement("img");

        let userName = document.createElement("h3");

        let userEmail = document.createElement("p");

        let editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary");
        editButton.innerHTML = "Edit";
        // When we clicks on the edit button we want to remove all the forms that are in the profile modal
        editButton.addEventListener("click", function(e) { removeAllForms(e);});
        editButton.onclick = function(e) { editProfile(data, e); }
        editButton.addEventListener("click", function(e) { addCancelButton(e);});

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

        //userProfileModalBody.appendChild(profileContainer);
        profileContainerWrapper.appendChild(editButton);

        //userProfileModalBody.appendChild(editButton);
        userProfileModalBody.appendChild(profileContainerWrapper);
        
        // We give the user the ability to change his password when ever he wants
        let changePassword = new ChangePassword();
        
        let changePasswordWrapper = document.createElement("div");
        changePasswordWrapper.classList.add("space-maker");
        userProfileModalBody.appendChild(changePasswordWrapper);
        let changePasswordBtn = document.createElement("button");
        changePasswordBtn.classList.add("btn", "btn-primary", "change-password-btn");
        changePasswordBtn.innerHTML = "Change your password";
        changePasswordWrapper.appendChild(changePasswordBtn);
         // This method will remove all of the forms in the profile modal
         changePasswordBtn.addEventListener("click", function(e){ removeAllForms(e)});
        changePasswordBtn.onclick = function(e) {changePassword.requestNewPassword(e)}
        // This cancel button will reset the profile modal to default 
        changePasswordBtn.addEventListener("click", function(e) {addCancelButton(e);});
        
        if(!data.isAccountConfirmed) {
          let accountValidation = new AccountValidation();
          let confirmAccountWrapper = document.createElement("div");
          confirmAccountWrapper.classList.add("confirm-account-wrapper");

          let statusMessages = document.createElement("div");
          statusMessages.classList.add("status", "status-messages");
          confirmAccountWrapper.appendChild(statusMessages);

          let confirmAccountBtn = document.createElement("button");
          confirmAccountBtn.classList.add("btn", "btn-primary", "confirm-account-btn");
          confirmAccountBtn.innerHTML = "Valide your account";
          confirmAccountWrapper.appendChild(confirmAccountBtn);
          userProfileModalBody.appendChild(confirmAccountWrapper);
          //userProfileModalBody.appendChild(confirmAccountBtn);
          // This method will remove all of the current forms in the profile modal
          confirmAccountBtn.addEventListener("click", function(e) {removeAllForms(e);});
          confirmAccountBtn.addEventListener("click", function(e) {accountValidation.requestAccountValidation(e)});
          confirmAccountBtn.addEventListener("click", function(e) {addCancelButton(e)});
        }

     });

     let modalFooter = userProfileModal.querySelector('.modal-footer');

     let updateButton = modalFooter.lastElementChild;

     updateButton.style.display = "none";

     console.log(modalFooter);

     console.log(updateButton);

     //updateButton.style.display = "none";

    $("#userProfileModal").modal('show');

    function editProfile(data,e) {
        
       e.preventDefault();
       let editBtn = e.currentTarget;

        let url = Routing.generate("user_edit"); //"http://localhost:8001/profile/edit";
        let editForm = document.createElement("Form");
        editForm.setAttribute("method", "POST");
        editForm.setAttribute("enctype", "multipart/form-data");

        editForm.id ="editForm";

        // The status message indicating if an error occured on the server or not
        let statusMessages = `<div class="edit-profile-status"> </div>`;
        editForm.insertAdjacentHTML("afterbegin", statusMessages);

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

       // userProfileModalBody.innerHTML = "";

        //userProfileModalBody.appendChild(editForm);
        editBtn.parentNode.insertBefore(editForm, editBtn);

        updateButton.onclick = function() { updateProfile(); }

        updateButton.style.display = "inline";

        console.log(response);
    }

    function updateProfile() {

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

         /*let data = {
             content: content
         } */

         /*const blob = new Blob([content], {
             type: "application/json"
         }); */

         let formData = new FormData();
         
         formData.append('data', content);

         formData.append("avatarFile", avatarFile.files[0]);

        console.log(content);

        var sBoundary = "---------------------------" + Date.now().toString(16);

        let url = Routing.generate('user_edit'); //"http://localhost:8001/profile/edit";

        let responseStatus = null;

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
        .then(response => { 
          responseStatus = response.status;
          return response.json()
        })
        .then(data => {
             console.log(JSON.stringify(data));
             return data;
        })
        .catch(error => console.error(error));

        response.then(data => {

            if(responseStatus === 200) {

            let usernames = document.querySelectorAll(".username");

            usernames.forEach(function(elem, pos) {

                elem.innerHTML = data.username;

            });
          }else if (responseStatus === 403) {

          }else {

          }
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

      // this funciton will remove all the forms that are currently in the profile modal
      function removeAllForms(e) {
        e.preventDefault();
        e.currentTarget.style.display = "none";
        // Remove all the div with class status
        let statusDiv = userProfileModalBody.querySelector(".status");
        if(statusDiv) statusDiv.remove();
        let allForms = userProfileModalBody.querySelectorAll("form");

        if(allForms) {
          allForms.forEach(function(form) {
            form.remove();
          })
        }
      }

      // This function resets the profile modal to its initial vlaue
      function addCancelButton(e) {
        let currentForm = userProfileModalBody.querySelector("form");
        let allHiddenBtn = userProfileModalBody.querySelectorAll("[style='display: none;'");
        cancelBtn.classList.add("btn", "btn-primary", "space-maker");
        cancelBtn.innerHTML = "Cancel";
        currentForm.lastChild.after(cancelBtn);
        cancelBtn.addEventListener("click", function(e) {
          e.preventDefault();
          currentForm.remove();
          // Remove all the div with class status
           let statusDiv = userProfileModalBody.querySelector(".status");
           if(statusDiv) statusDiv.remove();
          allHiddenBtn.forEach(function(btn) {
            btn.style.display = "inline";
          })
        })
      }
    
});

}