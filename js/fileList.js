document.addEventListener("DOMContentLoaded", function () {
  const darkenBackground = document.getElementById("darken-background");
  const uploadButton = document.getElementById("uploadButton");
  const lightboxClose = document.getElementById("lightboxClose");
  const cancelButton = document.getElementById("cancelButton");
  const uploadForm = document.getElementById("uploadForm");

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

  // 파일 업로드 기능
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("file");
    const fileType = document.getElementById("file_type").value;
    const description = document.getElementById("description").value;

    if (!fileInput.files.length) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("file_type", fileType);
    formData.append("description", description);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.statusText}`);
      }

      const result = await response.json();
      alert(result.message || "파일 업로드 완료");
      lightbox.classList.add("hidden");
      uploadForm.reset();
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  });
});

async function fetchFileList() {
  try {
    const response = await fetch("http://127.0.0.1:5000/files");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fileList = await response.json();
    displayFileList(fileList);
  } catch (error) {
    console.error("Error fetching file list:", error);
    document.querySelector(".container").innerHTML = `
          <p class="text-danger">파일 목록을 불러오는 데 실패했습니다. (${error.message})</p>
      `;
  }
}

function displayFileList(fileList) {
  const container = document.querySelector(".container");

  container.innerHTML = "";

  if (fileList.length === 0) {
    container.innerHTML = "<p>등록된 파일이 없습니다.</p>";
    return;
  }

  fileList.forEach((file) => {
    const fileCard = document.createElement("div");
    fileCard.classList.add("card", "mb-3");

    fileCard.innerHTML = `
          <div class="card-body">
              <h5 class="card-title">${file.file_name}</h5>
              <p class="card-text">파일 종류: ${file.file_type}</p>
              <p class="card-text">${file.uploaded_at}</p>
              <p class="card-text">${file.description || "설명이 없습니다."}</p>
              <a href="./detail.html?fileId=${file.id}" class="btn btn-primary">자세히 보기</a>
          </div>
      `;
    container.appendChild(fileCard);
  });
}

document.addEventListener("DOMContentLoaded", fetchFileList);
