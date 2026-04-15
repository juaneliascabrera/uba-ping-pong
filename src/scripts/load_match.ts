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
        console.log("MATCH:", data);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
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