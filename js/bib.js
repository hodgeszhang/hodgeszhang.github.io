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

        function getField(field) {
            const reg = new RegExp(
                field + "\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*(?:,|\\n\\})",
                "i"
            );
            const m = entry.match(reg);
            return m ? m[1].replace(/\s+/g, " ").trim() : "";
        }

        const title = getField("title");
        const author = getField("author");
        const venue = getField("journal") || getField("booktitle");
        const year = getField("year");
        const pdf = getField("pdf");
        const arxiv = getField("arxiv");
        const code = getField("code");

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
        </div>`;
    });

    document.getElementById("pubs").innerHTML = html;
})
.catch(err => {
    document.getElementById("pubs").innerHTML =
        "Error: " + err.message;
    console.error(err);
});
