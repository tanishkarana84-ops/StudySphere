const btn = document.getElementById("generateLearning");

const output = document.getElementById("learningOutput");

btn.addEventListener("click", async () => {

    const topic = document.getElementById("topic").value;

    const level = document.getElementById("level").value;

    const goal = document.getElementById("goal").value;

    output.innerText = "Generating recommendations...";

    try{

        const response = await fetch("/generate_learning",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                topic:topic,

                level:level,

                goal:goal

            })

        });

        const data = await response.json();

        output.innerText=data.learning;

    }

    catch(error){

        output.innerText="Something went wrong.";

    }

});