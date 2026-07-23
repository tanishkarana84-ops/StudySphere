const btn = document.getElementById("generatePlan");
const output = document.getElementById("planOutput");

btn.addEventListener("click", async () => {

    const days = document.getElementById("days").value;
    const goal = document.getElementById("goal").value;

    output.innerText = "Generating your study plan...";

    try {

        const response = await fetch("/generate_plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                days: days,
                goal: goal
            })
        });

        const data = await response.json();

        output.innerText = data.plan;

    } catch (error) {

        output.innerText = "Error generating study plan.";

    }

});