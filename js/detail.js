const urlParams = new URLSearchParams(window.location.search);
const fileId = urlParams.get('fileId');

async function fetchFileDetail() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/files/${fileId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fileDetail = await response.json();
        displayFileDetail(fileDetail);
    } catch (error) {
        console.error("Error fetching file list:", error);
        document.querySelector(".container").innerHTML = `
            <p class="text-danger">파일 세부 정보를 불러오는 데 실패했습니다. (${error.message})</p>
        `;
    }
}

function displayFileDetail(fileDetail) {
    const container = document.querySelector(".container");
    const template = document.getElementById("file-template");
    const title = document.getElementById("title");
    container.innerHTML = "";

    if (!fileDetail || Object.keys(fileDetail).length === 0) {
        container.innerHTML = "<p>파일을 찾을 수 없습니다.</p>";
        return;
    }

    title.textContent = fileDetail.file_name;

    let file_image;
    if (fileDetail.image_data) {
        file_image = `data:${fileDetail.file_type};base64,${fileDetail.image_data}`;
    } else if (fileDetail.file_type == ".zip") {
        file_image = "https://img.icons8.com/ios/452/zip.png";
    } else {
        file_image = "https://img.icons8.com/ios/452/file.png";
    }

    const fileElement = template.content.cloneNode(true);
    fileElement.querySelector(".file-image").src = file_image;
    fileElement.querySelector(".file-name").textContent = fileDetail.file_name;
    fileElement.querySelector(".file-type").textContent = fileDetail.file_type;
    fileElement.querySelector(".file-desc").textContent = fileDetail.description;
    fileElement.querySelector(".file-uploaded").textContent = fileDetail.uploaded_at;

    container.appendChild(fileElement);
}

document.addEventListener("DOMContentLoaded", fetchFileDetail);
