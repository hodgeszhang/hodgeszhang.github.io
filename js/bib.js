fetch('publications.bib')
    .then(response => response.text())
    .then(data => {

        const entries = data.match(
            /@\w+\s*\{[\s\S]*?(?=\n@\w+\s*\{|$)/g
        );

        if (!entries) {
            document.getElementById("publications").innerHTML =
                "No publications found. Please check publications.bib.";
            return;
        }

        let html = "";

        entries.forEach(entry => {

            let title = entry.match(
                /title\s*=\s*\{([\s\S]*?)\}/i
            );

            let year = entry.match(
                /year\s*=\s*\{(.*?)\}/i
            );

            let author = entry.match(
                /author\s*=\s*\{([\s\S]*?)\}/i
            );

            html += `
            <div class="publication">
                <div class="pub-title">
                    ${title ? title[1] : ""}
                </div>

                <div class="pub-author">
                    ${author ? author[1] : ""}
                </div>

                <div class="pub-year">
                    ${year ? year[1] : ""}
                </div>
            </div>
            `;
        });


        document.getElementById("publications").innerHTML = html;

    })
    .catch(error => {
        console.error(error);
        document.getElementById("publications").innerHTML =
        "Failed to load publications.bib";
    });
