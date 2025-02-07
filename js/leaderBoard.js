export function createLeaderBoard(board) {
    const list = document.createElement('li');
    list.classList.add('player-score')

    //username
    const username = document.createElement('span');
    username.classList.add('username');
    username.textContent = board.username;

    //points
    const points = document.createElement('span');
    points.classList.add('points');
    points.textContent = board.score;

    //Date
    const date = document.createElement('span');
    date.classList.add('times');
    date.textContent = board.date;

    list.appendChild(username)
    list.appendChild(points)
    list.appendChild(date)

    document.getElementById('player-score-list').appendChild(list)
}