export class API_SCORE {

    async postScore(data) {
        console.log(data)
        try {
            const response = await fetch("/api/postScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            return response.ok
        } catch (error) {
            console.error("Erreur lors de la l'envoie du score :", error);
        }
    }

    async getScore() {
        try {
            const response = await fetch("/api/getScore", {
                headers: { "Content-Type": "application/json" },
                method: "GET",
            })
            if (response.ok) {
                const data = await response.json()
                return data
            }
            console.error("faut faire mieux")
        } catch (error) {
            console.error("Erreur lors de la récupération du score :", error);
        }
    }
}