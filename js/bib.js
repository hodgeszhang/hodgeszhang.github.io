
async function loadPublications() {
    const container = document.getElementById("pubs");

    try {
        const response = await fetch("publications.bib?v=" + Date.now());
        const bib = await response.text();

        const entries = bib.match(/@\w+\s*\{[\s\S]*?(?=\n\s*@\w+\s*\{|$)/g);

        if (!entries) {
            container.innerHTML = "No publications found.";
            return;
        }

        function getField(entry, field) {
            const reg = new RegExp(
                field + "\\s*=\\s*(?:\\{([\\s\\S]*?)\\}|([^,\\n]+))",
                "i"
            );
            const m = entry.match(reg);
            return m ? (m[1] || m[2]).replace(/\n/g, " ").trim() : "";
        }

        let pubs = entries.map(entry => ({
            title: getField(entry, "title"),
            venue: getField(entry, "journal"),
            year: getField(entry, "year"),
            pdf: getField(entry, "pdf"),
            code: getField(entry, "code")
        }));

        pubs.sort((a,b)=>Number(b.year)-Number(a.year));

        const groups = {};
        pubs.forEach(p=>{
            if(!groups[p.year]) groups[p.year]=[];
            groups[p.year].push(p);
        });

        let html = "";

        Object.keys(groups).sort((a,b)=>b-a).forEach(year=>{
            html += `<section class="year-section">
            <h2>${year}</h2>`;

            groups[year].forEach(p=>{
                html += `
                <div class="publication">
                    <div class="pub-title">${p.title}</div>
                    <div class="pub-venue">${p.venue}</div>
                    <div class="pub-links">
                    ${p.pdf ? `<a href="${p.pdf}" target="_blank">📄 PDF</a>` : ""}
                    ${p.code ? `<a href="${p.code}" target="_blank">💻 Code</a>` : ""}
                    </div>
                </div>`;
            });

            html += "</section>";
        });

        container.innerHTML = html;

    } catch(e) {
        console.error(e);
        container.innerHTML = "Failed to load publications.bib";
    }
}

loadPublications();
