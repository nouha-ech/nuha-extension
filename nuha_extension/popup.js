document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("link-form");
  const list = document.getElementById("link-list");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const link = document.getElementById("link").value;

    if (title && link) {
      const internshipLink = { title, link };

      chrome.storage.sync.get({ internshipLinks: [] }, function (data) {
        const internshipLinks = data.internshipLinks;
        internshipLinks.push(internshipLink);
        chrome.storage.sync.set({ internshipLinks }, function () {
          addLinkToList(internshipLink);
          form.reset();
        });
      });
    }
  });

  function addLinkToList(internshipLink) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = internshipLink.link;
    a.textContent = internshipLink.title;
    a.target = "_blank";
    li.appendChild(a);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteLink(internshipLink);
    });
    li.appendChild(deleteButton);

    list.appendChild(li);
  }

  function deleteLink(internshipLink) {
    chrome.storage.sync.get({ internshipLinks: [] }, function (data) {
      const internshipLinks = data.internshipLinks;
      const index = internshipLinks.findIndex(
        (link) =>
          link.title === internshipLink.title &&
          link.link === internshipLink.link
      );
      if (index > -1) {
        internshipLinks.splice(index, 1);
        chrome.storage.sync.set({ internshipLinks }, function () {
          list.innerHTML = "";
          internshipLinks.forEach(addLinkToList);
        });
      }
    });
  }

  chrome.storage.sync.get({ internshipLinks: [] }, function (data) {
    data.internshipLinks.forEach(addLinkToList);
  });
});
