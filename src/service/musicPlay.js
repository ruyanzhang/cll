export async function getLyrics (songLrc) {
    return fetch(songLrc).then(response=>response.text()).catch((error)=>console.log(error));
}
