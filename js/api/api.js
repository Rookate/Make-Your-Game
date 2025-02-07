export class API_SCORE {

    async postScore(data) {
        try {
            const response = await fetch("/api/postScore", {
                method: "POST",
                data: data,
            })
            if (!response.ok) {
                console.error("server error")
            }
            console.error("faut faire mieux")
        } catch (error) {
            console.error("Erreur lors de la récupération du score :", error);
        }
    }

    async getScore() {
        try {
            const response = await fetch("/api/getScore", {
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