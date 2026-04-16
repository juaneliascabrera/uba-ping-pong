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

function validSets(sets: SetScore[]): boolean {
    if (sets.length === 0) {
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
    }

    const setsToWin = Math.max(setsWonByP1, setsWonByP2);

    let currentP1 = 0;
    let currentP2 = 0;
    for (let i = 0; i < sets.length; i++) {
        const p1 = sets[i].points_player_1;
        const p2 = sets[i].points_player_2;
        
        if (p1 > p2) {
            currentP1++;
        } else {
            currentP2++;
        }
        
        // If somebody won, then we need to be in the last set.
        if (currentP1 === setsToWin || currentP2 === setsToWin) {
            return i === sets.length - 1;
        }
    }
    return false;
}

function setupDynamicSets() {
    const addSetBtn = document.getElementById('add_set_btn');
    if (!addSetBtn) return;

    addSetBtn.addEventListener('click', () => {
        const container = document.getElementById('sets_container');
        if (!container) return;
        
        const currentSetCount = container.children.length + 1;
        
        const newSetDiv = document.createElement('div');
        newSetDiv.className = 'set-inputs';
        newSetDiv.id = `set_${currentSetCount}_inputs`;
        
        newSetDiv.innerHTML = `
        <label for="set_${currentSetCount}_p1">Set ${currentSetCount} P1:</label>
        <input type="number" id="set_${currentSetCount}_p1" name="set_${currentSetCount}_p1" required><br><br>

        <label for="set_${currentSetCount}_p2">Set ${currentSetCount} P2:</label>
        <input type="number" id="set_${currentSetCount}_p2" name="set_${currentSetCount}_p2" required><br><br>
        `;
        
        container.appendChild(newSetDiv);
    });
}

async function addMatch(url: string) {
    const form: HTMLFormElement = document.getElementById("load_match") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); //para que no recargue la página

        const data: { [key: string]: string; } = formToDict(form);
        const sets = [];

        let set_number = 1;
        while (true) {
            let current_set_p1 = `set_${set_number}_p1`;
            let current_set_p2 = `set_${set_number}_p2`;
            if (data[current_set_p1] !== undefined && data[current_set_p2] !== undefined) {
                sets.push({ points_player_1: Number(data[current_set_p1]), points_player_2: Number(data[current_set_p2]) });
                set_number++;
            } else {
                break;
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
                const container = document.getElementById('sets_container');
                if (container) {
                    while (container.children.length > 1) {
                        container.removeChild(container.lastChild as Node);
                    }
                }
            } else {
                alert("It did not add match");
            }
        } catch (err) {
            console.error(err);
            alert("Error query");
        }
    });
}

setupDynamicSets();
addMatch("/matches");