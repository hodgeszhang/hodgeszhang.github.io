function escapeHTML(str) {
    return (str || "").replace(/[&<>"']/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
    }[c]));
}

function parseBib(text) {
    const entries = [];
    const chunks = text.split(/\n(?=@)/).filter(s => s.trim().startsWith("@"));
    chunks.forEach(chunk => {
        const fields = {};
        const body = chunk.substring(chunk.indexOf("{")+1);
        const regex = /([a-zA-Z][a-zA-Z0-9_-]*)\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*")/g;
        let m;
        while ((m = regex.exec(body))) {
            let value = m[2].trim();
            if ((value.startsWith("{") && value.endsWith("}")) ||
                (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1,-1);
            }
            fields[m[1].toLowerCase()] = value.replace(/\s+/g," ").trim();
        }
        entries.push(fields);
    });
    return entries;
}

fetch("publications.bib")
.then(r => {
    if (!r.ok) throw new Error("publications.bib cannot be loaded");
    return r.text();
})
.then(text => {
    const pubs = parseBib(text).filter(p => p.title);
    let html = "";

    pubs.forEach(p => {
        const links = [];
        if (p.pdf) links.push(`<a href="${escapeHTML(p.pdf)}" target="_blank">📄 PDF</a>`);
        if (p.arxiv) links.push(`<a href="${escapeHTML(p.arxiv)}" target="_blank">arXiv</a>`);
        if (p.code || p.github) links.push(`<a href="${escapeHTML(p.code || p.github)}" target="_blank">💻 Code</a>`);

        html += `
        <div class="publication">
          <h2>${escapeHTML(p.title)}</h2>
          <p>${escapeHTML(p.author || "")}</p>
          <p><i>${escapeHTML(p.journal || p.booktitle || p.venue || "")} ${escapeHTML(p.year || "")}</i></p>
          <p>${links.join(" &nbsp; ")}</p>
        </div>`;
    });

    document.getElementById("pubs").innerHTML =
        html || "<p>No publications found. Please check publications.bib.</p>";
})
.catch(e => {
    document.getElementById("pubs").innerHTML = 
        "<p>Failed to load publications: " + escapeHTML(e.message) + "</p>";
});
