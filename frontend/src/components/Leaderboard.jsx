export function Leaderboard({ scores }) {
    console.log(scores);
  return (
    <div className="">
      <h1>Leaderboards</h1>
      <div className="center">
        <table>
          <tbody>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
            {scores.map((player) => (
              <tr key={player.socketID}>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
