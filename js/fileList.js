const serverUrl = "https://file-uploader-28lb.onrender.com";

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
      const response = await fetch(`${serverUrl}/upload`, {
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
    const response = await fetch(`${serverUrl}/files`);
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

  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-bordered");
  table.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>파일 이름</th>
        <th>파일 종류</th>
        <th>업로드 시간</th>
        <th>파일 크기</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector("tbody");

  fileList.forEach((file) => {
    const row = document.createElement("tr");
    row.setAttribute("data-file-id", file.id);

    row.innerHTML = `
      <td>${file.file_name}</td>
      <td>${file.file_type}</td>
      <td>${file.uploaded_at}</td>
      <td>${file.file_size}</td>
    `;

    row.addEventListener("click", () => {
      window.location.href = `./detail.html?fileId=${file.id}`;
    });

    tbody.appendChild(row);
  });

  container.appendChild(table);
}

document.addEventListener("DOMContentLoaded", fetchFileList);
