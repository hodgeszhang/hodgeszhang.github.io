fetch("./publications.bib")
.then(response => {

    if (!response.ok) {
        throw new Error("Cannot load publications.bib");
    }

    return response.text();

})
.then(text => {


    let papers = text.split("@")
        .filter(x => x.trim().length > 0);


    let html = "";


    papers.forEach(item => {


        let title =
            item.match(/title=\{([^}]*)\}/i);


        let author =
            item.match(/author=\{([^}]*)\}/i);


        let venue =
            item.match(/booktitle=\{([^}]*)\}|journal=\{([^}]*)\}/i);


        let year =
            item.match(/year=\{([^}]*)\}/i);



        html += `

        <div class="publication">

        <h2>
        ${title ? title[1] : ""}
        </h2>


        <p>
        ${author ? author[1] : ""}
        </p>


        <p>
        ${venue ? (venue[1] || venue[2]) : ""}
        ${year ? year[1] : ""}
        </p>


        </div>

        `;


    });


    document.getElementById("pubs").innerHTML = html;


})
.catch(error=>{


console.error(error);


document.getElementById("pubs").innerHTML =
"Failed to load publications";


});
