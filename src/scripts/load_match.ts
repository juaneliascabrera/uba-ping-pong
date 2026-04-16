function formToDict(form: HTMLFormElement) {
    const formData = new FormData(form); // FormData maneja inputs + archivos
    // pero para usarlo en el backend necesitamos un paquete como multer
    const data: { [key: string]: string; } = {};
    formData.forEach((value, key) => {
        data[key] = value?.toString();
    });
    return data;
}

type SetScore = {
    points_player_1: number;
    points_player_2: number;
};

function validSets(best_of: number, sets: SetScore[]): boolean {
    if (!Number.isInteger(best_of) || best_of <= 0 || best_of % 2 === 0) {
        return false;
    }

    const setsToWin = Math.ceil(best_of / 2);

    if (sets.length === 0 || sets.length > best_of) {
        return false;
    }

    let setsWonByP1 = 0;
    let setsWonByP2 = 0;

    for (let i = 0; i < sets.length; i++) {
        const set = sets[i];

        const p1 = set.points_player_1;
        const p2 = set.points_player_2;


        if (
            !Number.isInteger(p1) ||
            !Number.isInteger(p2) ||
            p1 < 0 ||
            p2 < 0
        ) {
            return false;
        }
        const diff = Math.abs(p1 - p2);

        if (diff < 2) {
            return false;
        }

        if (p1 > p2) {
            setsWonByP1++;
        } else {
            setsWonByP2++;
        }

        // If somebody won, then we need to be in the last set.
        if (setsWonByP1 === setsToWin || setsWonByP2 === setsToWin) {
            return i === sets.length - 1;
        }
    }
    return false;
}

async function addMatch(url: string) {
    const form: HTMLFormElement = document.getElementById("load_match") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); //para que no recargue la página

        const data: { [key: string]: string; } = formToDict(form);
        const best_of = Number(data['best_of']);
        const sets = [];

        for (let set_number = 1; set_number <= 3; set_number++) {
            let current_set_p1 = `set_${set_number}_p1`;
            let current_set_p2 = `set_${set_number}_p2`;
            if (data[current_set_p1] && data[current_set_p2]) {
                sets.push({ points_player_1: Number(data[current_set_p1]), points_player_2: Number(data[current_set_p2]) });
            }
        }
        if (!validSets(best_of, sets)) {
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