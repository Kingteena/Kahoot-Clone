export function Leaderboard({ scores }) {
  return (
    <div className="">
      <h1>Leaderboards</h1>
      <div className="center">
        <table>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
          {scores.map((player) => (
            <tr key={player.socketID}>
              <td>{player.socketID}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
