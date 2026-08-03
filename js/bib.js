async function loadPublications() {
    const container = document.getElementById("pubs");

    try {
        const response = await fetch("publications.bib");
        if (!response.ok) {
            throw new Error("Cannot load publications.bib");
        }

        const bib = await response.text();

        // Split BibTeX entries robustly
        const entries = bib.match(/@\w+\s*\{[\s\S]*?(?=\n@\w+\s*\{|$)/g);

        if (!entries || entries.length === 0) {
            container.innerHTML = "No publications found. Please check publications.bib.";
            return;
        }

        let html = "";

        entries.forEach(entry => {
            const getField = (name) => {
                const match = entry.match(
                    new RegExp(name + "\\s*=\\s*(?:\\{([\\s\\S]*?)\\}|([^,\\n]+))", "i")
                );
                return match ? (match[1] || match[2]).trim() : "";
            };

            const title = getField("title");
            const author = getField("author");
            const journal = getField("journal");
            const year = getField("year");
            const pdf = getField("pdf");
            const code = getField("code");

            html += `
            <div class="publication">
                <div class="pub-title">${title}</div>
                <div class="pub-author">${author}</div>
                <div class="pub-venue">${journal}</div>
                <div class="pub-year">${year}</div>
                ${pdf ? `<div><a href="${pdf}" target="_blank">PDF</a></div>` : ""}
                ${code ? `<div><a href="${code}" target="_blank">Code</a></div>` : ""}
            </div>
            <hr>
            `;
        });

        container.innerHTML = html;

    } catch (error) {
        console.error(error);
        container.innerHTML = "Failed to load publications.bib";
    }
}

loadPublications();
