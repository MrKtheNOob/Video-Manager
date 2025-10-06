export interface Video {
    id: number
    link: string
    title: string
    thumbnail_url: string
    platform: string
    uploader: string
    duration: string
}
const BASE_URL = "/api"

export async function getVideos() {
    const videos = fetch(BASE_URL + "/videos")
        .then(res => res.json())
        .then(data => {
            return data.data as Video[]
        }).catch(err => {
            console.log(err)
            return [] as Video[]
        })
    return videos
}
export async function searchVideos(query: string) {
    const videos = fetch(BASE_URL + "/videos/search?query=" + query)
        .then(res => res.json())
        .then(data => {
            return data.data as Video[]
        }).catch(err => {
            console.log(err)
            return [] as Video[]
        })
    return videos
}