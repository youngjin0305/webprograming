document.addEventListener("DOMContentLoaded", function () {
    const darkenBackground = document.getElementById("darken-background");
    const uploadButton = document.getElementById("uploadButton");
    const lightboxClose = document.getElementById("lightboxClose");
    const cancelButton = document.getElementById("cancelButton");
  
    uploadButton.addEventListener("click", function () {
      darkenBackground.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  
    function closeLightbox() {
      darkenBackground.classList.add("hidden");
      document.body.style.overflow = "";
    }
  
    lightboxClose.addEventListener("click", closeLightbox);
    cancelButton.addEventListener("click", closeLightbox);
  
    darkenBackground.addEventListener("click", function (event) {
      if (event.target === darkenBackground) {
        closeLightbox();
      }
    });
  });
  