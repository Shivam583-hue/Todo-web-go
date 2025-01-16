import { useEffect, useState } from "react";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  completed: string;
};

function App() {
  const [chana, setChana] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");

  // Fetch todos from the server
  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get("http://localhost:5000/todos");
        setChana(res.data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        alert("Could not load todos. Please try again.");
      }
    }
    getData();
  }, []);

  // Function to add a new todo
  const addTodo = async () => {
    if (!title.trim()) {
      alert("Todo title cannot be empty!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/todos", { title });
      setChana([...chana, { id: res.data.id, title, completed: "incomplete" }]);
      setTitle(""); // Clear the input field
    } catch (error) {
      console.error("Failed to add todo:", error);
      alert("Could not add todo. Please try again.");
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setChana(chana.filter((todo) => todo.id !== id)); // Update state immediately
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert("Could not delete todo. Please try again.");
    }
  };

  // Function to toggle todo completion
  const toggleCompletion = async (id: number, currentStatus: string) => {
    console.log(id, currentStatus);
    const newStatus = currentStatus === "incomplete" ? "completed" : "incomplete";
    try {
      await axios.patch(`http://localhost:5000/todos/${id}`, { completed: newStatus });
      setChana(
        chana.map((todo) =>
          todo.id === id ? { ...todo, completed: newStatus } : todo
        )
      ); // Update state immediately
    } catch (error) {
      console.error("Failed to update todo status:", error);
      alert("Could not update todo. Please try again.");
    }
  };

  console.log(chana);

  return (
    <div className="bg-black text-white p-10 flex flex-col items-center justify-center h-screen w-screen">
      <input
        type="text"
        value={title}
        className="p-4 rounded-lg bg-gray-900 w-full"
        placeholder="Add Todo"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTodo} className="bg-gray-500 p-4 rounded-lg mt-2">
        Add Todo
      </button>
      <ul className="p-10 bg-gray-600 rounded-lg m-10">
        {chana.length === 0 ? (
          <li>No todos found</li>
        ) : (
          chana.map((todo) => (
            <li key={todo.id} className="mb-2">
              {todo.completed === "incomplete" ? (
                <span className="text-white">{todo.title}</span>
              ) : (
                <span className="text-green-500">{todo.title}</span>
              )}
              <button
                className="p-3 bg-gray-500 rounded-lg ml-2"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
              <button
                className="p-3 bg-gray-500 rounded-lg ml-2"
                onClick={() => toggleCompletion(todo.id, todo.completed)}
              >
                {todo.completed === "incomplete"
                  ? "Mark Completed"
                  : "Mark Incomplete"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
