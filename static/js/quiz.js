const generateBtn = document.getElementById("generateQuizBtn");
const topic = document.getElementById("topic");
const difficulty = document.getElementById("difficulty");
const quizOutput = document.getElementById("quizOutput");

generateBtn.addEventListener("click", generateQuiz);

async function generateQuiz() {

    if (topic.value.trim() === "") {
        alert("Please enter a topic.");
        return;
    }

    quizOutput.innerHTML = "🤖 Generating quiz...";

    try {

        const response = await fetch("/generate_quiz", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: `${topic.value} (${difficulty.value})`
            })

        });

        const data = await response.json();

        quizOutput.innerHTML = data.quiz.replace(/\n/g, "<br>");

    }

    catch (error) {

        quizOutput.innerHTML = "❌ Unable to generate quiz.";

        console.error(error);

    }

}