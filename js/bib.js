fetch("./publications.bib")

.then(res => {

    if(!res.ok){

        throw new Error(
        "Cannot load publications.bib"
        );

    }

    return res.text();

})


.then(data=>{


let papers =
data.split("@")
.filter(x=>x.trim());



let html="";



papers.forEach(paper=>{


function getField(name){

let reg =
new RegExp(
name+"=\\{([^}]*)\\}",
"i"
);


let result =
paper.match(reg);


return result ? result[1] : "";

}



let title =
getField("title");


let author =
getField("author");


let venue =
getField("booktitle") ||
getField("journal");


let year =
getField("year");


let pdf =
getField("pdf");


let code =
getField("code");


let arxiv =
getField("arxiv");



html += `


<div class="publication">


<h2>
${title}
</h2>


<p>
${author}
</p>


<p>
<i>
${venue}
${year}
</i>
</p>



<div>


${pdf ?
`<a href="${pdf}">
📄 PDF
</a>`
:""}



${arxiv ?
`<a href="${arxiv}">
arXiv
</a>`
:""}



${code ?
`<a href="${code}">
💻 Code
</a>`
:""}



</div>


</div>


`;



});



document
.getElementById("pubs")
.innerHTML=html;



})



.catch(err=>{


console.error(err);


document
.getElementById("pubs")
.innerHTML=
"Failed to load publications";


});
