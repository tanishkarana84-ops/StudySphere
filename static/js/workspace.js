const generateBtn = document.getElementById("generateBtn");
const topic = document.getElementById("topic");
const output = document.getElementById("output");

generateBtn.addEventListener("click", async () => {

    const userTopic = topic.value.trim();

    if(userTopic === ""){
        alert("Please enter a topic.");
        return;
    }

    output.innerHTML = `
        <h3>🤖 Generating Learning Material...</h3>
    `;

    try{

        const response = await fetch("/ask",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                message:userTopic
            })

        });

        const data = await response.json();

        output.innerHTML = formatNotes(data.reply);

    }

    catch(error){

        output.innerHTML = `
            <h3>❌ Failed to generate notes.</h3>
        `;

    }

});


function formatNotes(reply){

    const headings=[
        "📖 Overview",
        "🧠 Key Concepts",
        "📚 Detailed Explanation",
        "💡 Example",
        "⚠️ Common Mistakes",
        "📝 Quick Revision"
    ];

    let html="";

    for(let i=0;i<headings.length;i++){

        const start=reply.indexOf(headings[i]);

        if(start===-1) continue;

        let end=reply.length;

        for(let j=i+1;j<headings.length;j++){

            const next=reply.indexOf(headings[j]);

            if(next!==-1){
                end=next;
                break;
            }

        }

        const content=reply
            .substring(start+headings[i].length,end)
            .trim();

        html+=`

        <div class="note-card">

            <h3>${headings[i]}</h3>

            <p>${content.replace(/\n/g,"<br>")}</p>

        </div>

        `;

    }

    return html;

}