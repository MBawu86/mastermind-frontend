const BASE_URL = "http://localhost:3001/api";

export function fetchScoreData() {
    return fetch(BASE_URL + '/scores').then(res => res.json());
}