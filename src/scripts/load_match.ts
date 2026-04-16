function formToDict(form: HTMLFormElement) {
    const formData = new FormData(form); // FormData maneja inputs + archivos
    // pero para usarlo en el backend necesitamos un paquete como multer
    const data: { [key: string]: string; } = {};
    formData.forEach((value, key) => {
        data[key] = value?.toString();
    });
    return data;
}


async function addMatch(url: string) {
    const form: HTMLFormElement = document.getElementById("load_match") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); //para que no recargue la página

        const data: { [key: string]: string; } = formToDict(form);
        let set_number = 1;
        let current_set_p1 = `set_${set_number}_p1`
        let current_set_p2 = `set_${set_number}_p2`

        const sets = [];
        
        for(set_number; set_number < 4; set_number++){
            sets.push({points_player_1: data[current_set_p1], points_player_2: data[current_set_p2]})
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