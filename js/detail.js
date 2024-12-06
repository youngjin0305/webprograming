const urlParams = new URLSearchParams(window.location.search);
const fileId = urlParams.get('fileId');
const serverUrl = "https://file-uploader-28lb.onrender.com";


async function fetchFileDetail() {
    try {
        const response = await fetch(`${serverUrl}/files/${fileId}`);
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

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
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
    let isImage = false;
    if (fileDetail.image_data) {
        file_image = `data:${fileDetail.file_type};base64,${fileDetail.image_data}`;
        isImage = true;
    } else if (fileDetail.file_type == "application/x-zip-compressed") {
        file_image = "https://img.icons8.com/ios/452/zip.png";
    } else {
        file_image = "https://img.icons8.com/ios/452/file.png";
    }

    const fileElement = template.content.cloneNode(true);
    const safeDescription = escapeHTML(fileDetail.description).replace(/\n/g, "<br>");
    fileElement.querySelector(".file-image").src = file_image;
    if (!isImage) {
        fileElement.querySelector(".file-image").classList.add("no-hover");
    }
    fileElement.querySelector(".file-name").textContent = "파일명: " + fileDetail.file_name;
    fileElement.querySelector(".file-type").textContent = "파일타입: " + fileDetail.file_type;
    fileElement.querySelector(".file-desc").innerHTML = safeDescription;
    fileElement.querySelector(".file-size").textContent = "파일크기: " + fileDetail.file_size;
    fileElement.querySelector(".file-date").textContent = fileDetail.uploaded_at + " 생성";

    container.appendChild(fileElement);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchFileDetail();

    document.addEventListener("click", async (event) => {
        if (event.target.id === "downloadButton") {
            try {
                const response = await fetch(`${serverUrl}/download/${fileId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileId;
                link.click();
                link.remove();
            } catch (error) {
                console.error("Error downloading file:", error);
                alert("파일 다운로드에 실패했습니다.");
            }
        }
    });

    document.addEventListener("click", async (event) => {
        if (event.target.id === "deleteButton") {
            if (confirm("정말 이 파일을 삭제하시겠습니까?")) {
                try {
                    const response = await fetch(`${serverUrl}/files/${fileId}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    alert("파일이 삭제되었습니다.");
                    window.location.href = "./fileList.html";
                } catch (error) {
                    console.error("Error deleting file:", error);
                    alert("파일 삭제에 실패했습니다.");
                }
            }
        }
    });
});
