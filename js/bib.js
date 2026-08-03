async function loadPublications() {


const container = document.getElementById("pubs");


try {


const response = await fetch("publications.bib");


const bib = await response.text();



/*
 Extract BibTeX entries
*/

const entries = bib.match(
/@\w+\s*\{[\s\S]*?(?=\n@\w+\s*\{|$)/g
);



if(!entries){

container.innerHTML =
"No publications found.";

return;

}



/*
 Parse fields
*/

function getField(entry, field){


let reg = new RegExp(
field +
"\\s*=\\s*\\{([\\s\\S]*?)\\}",
"i"
);


let match = entry.match(reg);


if(match)
return match[1]
.replace(/\n/g," ")
.trim();


return "";

}



let publications = [];



entries.forEach(entry=>{


let title =
getField(entry,"title");


let journal =
getField(entry,"journal");


let year =
getField(entry,"year");


let pdf =
getField(entry,"pdf");


let code =
getField(entry,"code");



publications.push({

title,
journal,
year,
pdf,
code

});


});



/*
 Sort by year descending
*/

publications.sort(
(a,b)=>
parseInt(b.year)-parseInt(a.year)
);



/*
 Group by year
*/


let groups={};


publications.forEach(pub=>{


if(!groups[pub.year])
groups[pub.year]=[];


groups[pub.year].push(pub);


});




let html="";



Object.keys(groups)
.sort((a,b)=>b-a)
.forEach(year=>{



html += `

<div class="year-section">

<h2>${year}</h2>

`;



groups[year].forEach(pub=>{


html += `

<div class="publication">


<div class="title">

${pub.title}

</div>


<div class="venue">

${pub.journal}

</div>


<div class="links">


${
pub.pdf
?
`
<a class="link"
href="${pub.pdf}"
target="_blank">

<span>📄</span>
PDF

</a>
`
:""
}



${
pub.code
?
`
<a class="link"
href="${pub.code}"
target="_blank">

<span>💻</span>
Code

</a>
`
:""
}



</div>



</div>

`;

});


html += "</div>";


});



container.innerHTML=html;



}

catch(error){


console.error(error);


container.innerHTML =
"Failed to load publications.bib";


}



}



loadPublications();
