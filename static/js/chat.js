let lastResponse = "";
const sendBtn = document.getElementById("sendBtn");
const message = document.getElementById("message");
const chatArea = document.getElementById("chatArea");

async function sendMessage() {

    const text = message.value.trim();

    if (text === "") return;

    // Show user's message
    chatArea.innerHTML += `
        <div class="user-message">
            ${text}
        </div>
    `;

    message.value = "";

    // Show loading
    chatArea.innerHTML += `
        <div class="bot" id="loading">
            Thinking...
        </div>
    `;

    chatArea.scrollTop = chatArea.scrollHeight;

    try {

        const response = await fetch("/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        document.getElementById("loading").remove();

let reply = data.reply;

lastResponse = reply;


const sections = [
    "📖 Overview",
    "🧠 Key Concepts",
    "📚 Detailed Explanation",
    "💡 Example",
    "⚠️ Common Mistakes",
    "📝 Quick Revision"
];

let html = "";

for(let i=0;i<sections.length;i++){

    const start = reply.indexOf(sections[i]);

    if(start==-1) continue;

    let end = reply.length;

    for(let j=i+1;j<sections.length;j++){

        let next = reply.indexOf(sections[j]);

        if(next!=-1){

            end = next;
            break;

        }

    }

    let content = reply.substring(start + sections[i].length,end).trim();

    html += `

    <div class="ai-card">

        <h3>${sections[i]}</h3>

        <p>${content.replace(/\n/g,"<br>")}</p>

    </div>

    `;

}

html += `

<div class="button-group">

<button class="action-btn">

📄 Save Notes

</button>

<button
class="action-btn"
id="mcqBtn">

📝 Generate MCQ

</button>

<button class="action-btn">

📚 Subjective Quiz

</button>

<button class="action-btn">

🃏 Flashcards

</button>

</div>

`;

chatArea.innerHTML += html;

    }

    catch(error){

        document.getElementById("loading").remove();

        chatArea.innerHTML += `
            <div class="bot">
                Error connecting to AI.
            </div>
        `;

    }

    chatArea.scrollTop = chatArea.scrollHeight;

}

sendBtn.addEventListener("click", sendMessage);

message.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});
document.addEventListener("click", async function(e){

    if(e.target.id==="mcqBtn"){

        if(lastResponse===""){

            alert("Ask AI something first!");

            return;

        }

        chatArea.innerHTML += `

        <div class="bot">

        Generating Quiz...

        </div>

        `;

        const response = await fetch("/generate_quiz",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                topic:lastResponse

            })

        });

        const data = await response.json();

        chatArea.innerHTML += `

        <div class="ai-card">

        <h3>📝 MCQ Quiz</h3>

        <p>${data.quiz.replace(/\n/g,"<br>")}</p>

        </div>

        `;

    }

});
document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("mcq-btn")) return;

    if (lastResponse === "") {
        alert("Ask something first!");
        return;
    }

    chatArea.innerHTML += `
        <div class="bot" id="quizLoading">
            Generating Quiz...
        </div>
    `;

    chatArea.scrollTop = chatArea.scrollHeight;

    try {

        const response = await fetch("/generate_quiz", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: lastResponse
            })

        });

        const data = await response.json();

        document.getElementById("quizLoading").remove();

        chatArea.innerHTML += `
            <div class="ai-card">

                <h3>📝 MCQ Quiz</h3>

                <p>${data.quiz.replace(/\n/g, "<br>")}</p>

            </div>
        `;

        chatArea.scrollTop = chatArea.scrollHeight;

    } catch (error) {

        document.getElementById("quizLoading").remove();

        chatArea.innerHTML += `
            <div class="bot">
                Failed to generate quiz.
            </div>
        `;
    }

});