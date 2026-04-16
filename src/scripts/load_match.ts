function formToDict(form: HTMLFormElement) {
    const formData = new FormData(form); // FormData maneja inputs + archivos
    // pero para usarlo en el backend necesitamos un paquete como multer
    const data: { [key: string]: string; } = {};
    formData.forEach((value, key) => {
        data[key] = value?.toString();
    });
    return data;
}

function validSets(sets: any[]) {
    // First we'll ensure that sets length is odd.
    if (sets.length % 2 != 1) {
        return false;
    }
    //Now we'll ensure every set has been won by 2 points of difference or more.
    for (let set of sets) {
        if (set['player_1_points'] - set['player_2_points'] < 2) {
            return false;
        }

    }

}

async function addMatch(url: string) {
    const form: HTMLFormElement = document.getElementById("load_match") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); //para que no recargue la página

        const data: { [key: string]: string; } = formToDict(form);
        let set_number = 1;

        const sets = [];

        for (set_number = 1; set_number <= 3; set_number++) {
            let current_set_p1 = `set_${set_number}_p1`;
            let current_set_p2 = `set_${set_number}_p2`;
            if (data[current_set_p1] && data[current_set_p2]) {
                sets.push({ points_player_1: Number(data[current_set_p1]), points_player_2: Number(data[current_set_p2]) });
            }
        }
        if (!validSets(sets)) {
            alert('Invalid sets')
            return;
        }
        const formatted_data = {
            player_1_username: data.player_1_username,
            player_2_username: data.player_2_username,
            sets: sets
        }
        console.log(formatted_data);
        console.log("MATCH:", data);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formatted_data)

            });

            if (response.ok) {
                alert("Match added succesfully");
                form.reset();
            } else {
                alert("It did not add match");
            }
        } catch (err) {
            console.error(err);
            alert("Error query");
        }
    });
}

addMatch("/matches");