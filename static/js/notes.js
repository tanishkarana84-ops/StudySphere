const generateBtn = document.getElementById("generateBtn");
const topic = document.getElementById("topic");
const reference = document.getElementById("reference");
const notesOutput = document.getElementById("notesOutput");

generateBtn.addEventListener("click", async () => {

    if (topic.value.trim() === "") {
        alert("Please enter a topic.");
        return;
    }

    notesOutput.innerHTML = "🤖 Generating notes...";

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Topic: ${topic.value}

Reference Material:
${reference.value}`
            })
        });

        const data = await response.json();

        notesOutput.innerHTML = data.reply.replace(/\n/g, "<br>");

    } catch (err) {

        notesOutput.innerHTML = "❌ Error generating notes.";

        console.error(err);

    }

});