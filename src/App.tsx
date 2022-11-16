// The following App.tsx is from https://github.com/aws-amplify/amplify-js/issues/10487

// @ts-nocheck
import React from "react";
import { Amplify, DataStore } from "aws-amplify";
import { Todo, User } from "./models";
// import { DISCARD } from "@aws-amplify/datastore";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

// https://github.com/aws-amplify/amplify-js/issues/10487#issue-1410485813
// DataStore.configure({
//   conflictHandler: ({ modelConstructor, remoteModel, localModel }) => {
//     console.log(
//       "DataStore has found a conflict",
//       modelConstructor,
//       remoteModel,
//       localModel
//     );
//     return DISCARD;
//   },
// });

const convertToOject = (array) => {
  const obj = {};
  array.forEach((item) => {
    obj[item.id] = item;
  });
  return obj;
};

function App() {
  const [whoami, setWhoami] = React.useState(null);
  const [todos, setTodos] = React.useState({});

  const addWhoami = async () => {
    const users = await DataStore.query(User);
    if (users.length > 0) {
      setWhoami(users[0]);
    } else {
      const newWhoami = await DataStore.save(new User({}));
      setWhoami(newWhoami);
    }
  };

  React.useEffect(() => {
    addWhoami();
  }, []);

  React.useEffect(() => {
    DataStore.observeQuery(Todo).subscribe(({ items }) => {
      setTodos(convertToOject(items));
    });
  }, []);

  const handleUpdateTodo = async (data) => {
    const todo = await DataStore.query(Todo, data.id);
    await DataStore.save(
      Todo.copyOf(todo, (updated) => {
        updated.name = data.name;
        updated.description = data.description;
      })
    );
  };

  const handleChangeTodo = (todoId, data, key) => {
    const todo = todos[todoId];
    setTodos({ ...todos, [todoId]: { ...todo, [key]: data } });
  };

  const handleAddTodo = async () => {
    await DataStore.save(
      new Todo({
        createdBy: whoami,
        name: "",
        description: "",
        complete: false,
      })
    );
  };

  return (
    <div>
      {Object.values(todos).map((todo) => (
        <form key={todo.id}>
          <label>
            Name:
            <input
              value={todo.name}
              onChange={(e) =>
                handleChangeTodo(todo.id, e.target.value, "name")
              }
              type="text"
              name="name"
            />
          </label>
          <label>
            Description:
            <input
              value={todo.description}
              onChange={(e) =>
                handleChangeTodo(todo.id, e.target.value, "description")
              }
              type="text"
              name="description"
            />
          </label>
          <input
            onClick={() => handleUpdateTodo(todos[todo.id])}
            type="button"
            value="Save"
          />
        </form>
      ))}
      <input onClick={handleAddTodo} type="submit" value="Add todo" />
    </div>
  );
}

export default App;
