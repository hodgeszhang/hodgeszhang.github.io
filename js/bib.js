/*
 * Academic Publication Renderer
 * For hodgeszhang.github.io
 *
 * Features:
 * - Parse BibTeX
 * - Hide author
 * - Hide arXiv link
 * - Show PDF / Code / Project
 * - Sort by year descending
 */


async function loadBib() {

    const response = await fetch("publications.bib");

    const bibText = await response.text();

    const papers = parseBibtex(bibText);


    // newest first
    papers.sort((a,b)=>{
        return parseInt(b.year || 0) - parseInt(a.year || 0);
    });


    renderPublications(papers);

}



/*
 Simple BibTeX parser
 Supports multiline {...}
*/


function parseBibtex(text){

    let entries = [];

    let regex = /@(\w+)\s*\{\s*([^,]+),([\s\S]*?)\n\}/g;


    let match;


    while((match = regex.exec(text)) !== null){


        let type = match[1];

        let key = match[2];

        let body = match[3];


        let paper = {

            type:type,
            key:key

        };


        let fieldRegex =
        /(\w+)\s*=\s*(\{([\s\S]*?)\}|\"([\s\S]*?)\")\s*,?/g;


        let field;


        while((field = fieldRegex.exec(body)) !== null){

            let name =
            field[1].toLowerCase();


            let value =
            field[3] || field[4] || "";


            value =
            cleanLatex(value);


            paper[name]=value;

        }


        entries.push(paper);

    }


    return entries;

}




/*
 Remove LaTeX commands
*/

function cleanLatex(str){


    return str

    .replace(/\\&/g,"&")

    .replace(/\{|\}/g,"")

    .replace(/\\textbf\{(.*?)\}/g,"$1")

    .replace(/\\emph\{(.*?)\}/g,"$1")

    .trim();

}





function renderPublications(papers){


    const container =
    document.getElementById(
        "publications"
    );


    if(!container){

        console.error(
        "Cannot find #publications"
        );

        return;

    }


    let html="";


    papers.forEach(p=>{


        let venue =
        p.journal ||
        p.booktitle ||
        p.publisher ||
        "arXiv";


        html += `


<div class="publication">


<h3>
${p.title || "Untitled"}
</h3>



<p class="venue">

${venue}

${p.year ? " " + p.year : ""}

</p>



<div class="links">


${p.pdf ? `

<a href="${p.pdf}"
target="_blank">

📄 PDF

</a>

` : ""}



${p.code ? `

<a href="${p.code}"
target="_blank">

💻 Code

</a>

` : ""}



${p.github ? `

<a href="${p.github}"
target="_blank">

💻 GitHub

</a>

` : ""}



${p.project ? `

<a href="${p.project}"
target="_blank">

🌐 Project

</a>

` : ""}



</div>


</div>



`;



    });



    container.innerHTML = html;


}




// start

document.addEventListener(
"DOMContentLoaded",
loadBib
);
