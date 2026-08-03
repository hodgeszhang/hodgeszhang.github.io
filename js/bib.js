fetch("publications.bib")

.then(response => response.text())

.then(text => {


let entries =
text.match(/@\w+\{[\s\S]*?\n\}/g);



let html="";



entries.forEach(entry=>{


function getField(field){


let regex =
new RegExp(
field+
"\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*,",
"i"
);


let match =
entry.match(regex);


if(match){

return match[1]
.replace(/\n/g," ")
.trim();

}


return "";

}



let title =
getField("title");


let author =
getField("author");


let venue =
getField("journal") ||
getField("booktitle");


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
${venue} ${year}
</i>
</p>



<p>

${pdf?
`<a href="${pdf}">
📄 PDF
</a>`
:""}


${arxiv?
`<a href="${arxiv}">
arXiv
</a>`
:""}



${code?
`<a href="${code}">
💻 Code
</a>`
:""}


</p>


</div>


`;



});



document
.getElementById("pubs")
.innerHTML=html;



})

.catch(err=>{


document
.getElementById("pubs")
.innerHTML=
"Error:"+err;


});
