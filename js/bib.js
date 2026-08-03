fetch("publications.bib")
.then(response => {
    if (!response.ok) {
        throw new Error("Cannot load publications.bib");
    }
    return response.text();
})
.then(text => {

    const entries = text.match(/@\w+\{[\s\S]*?\n\}/g) || [];
    let html = "";

    entries.forEach(entry => {

        function field(name) {
            const m = entry.match(
                new RegExp(name + "\\s*=\\s*\\{([\\s\\S]*?)\\}", "i")
            );
            return m ? m[1].replace(/\s+/g, " ").trim() : "";
        }

        const title = field("title");
        const author = field("author");
        const venue = field("booktitle") || field("journal");
        const year = field("year");
        const pdf = field("pdf");
        const arxiv = field("arxiv");
        const code = field("code");

        html += `
        <div class="publication">
          <h2>${title}</h2>
          <p>${author}</p>
          <p><i>${venue} ${year}</i></p>
          <p>
          ${pdf ? `<a href="${pdf}">📄 PDF</a>` : ""}
          ${arxiv ? `<a href="${arxiv}">arXiv</a>` : ""}
          ${code ? `<a href="${code}">💻 Code</a>` : ""}
          </p>
        </div>
        `;
    });

    document.getElementById("pubs").innerHTML = html;

})
.catch(err => {
    console.error(err);
    document.getElementById("pubs").innerHTML =
    "Failed to load publications: " + err.message;
});
