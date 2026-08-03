fetch("publications.bib")

.then(response => response.text())

.then(text => {


let papers = bibtexParse.toJSON(text);


let html = "";


papers.forEach(function(item){


let p = item.entry;



html += `

<div class="publication">

<h2>
${p.title}
</h2>


<p>
${p.author}
</p>


<p>
<i>
${p.booktitle || p.journal || ""}
${p.year}
</i>
</p>

`;



if(p.pdf){

html += `
<a href="${p.pdf}">
📄 PDF
</a>
`;

}



if(p.arxiv){

html += `
<a href="${p.arxiv}">
arXiv
</a>
`;

}



if(p.code){

html += `
<a href="${p.code}">
💻 Code
</a>
`;

}


html += `

</div>

`;



});


document.getElementById("pubs").innerHTML = html;



})

.catch(error=>{

console.log(error);

document.getElementById("pubs").innerHTML =
"Failed to load publications";

});
