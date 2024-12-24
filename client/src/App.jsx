import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { Table } from "@mui/material"; // Add this import or use your preferred table component

const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(query);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div className="container">
      <Table>
        <thead>
          <tr>
            <th>Todo Title</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {data.getTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo?.user?.name || "No user assigned"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
