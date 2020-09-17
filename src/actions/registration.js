export const createTeam = team => {
    return fetch(`${process.env.REACT_APP_API}/createTeam`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(team)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}