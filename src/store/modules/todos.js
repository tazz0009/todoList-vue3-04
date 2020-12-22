import axios from "axios";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.baseURL = "http://localhost:8080/api/";

const state = () => ({
  all: [],
});

// getters
const getters = {
  remaining(state) {
    return state.all.filter((el) => el.completed === false).length;
  },
  showClearCompletedButton(state) {
    return state.all.filter((el) => el.completed === true).length > 0;
  },
};

// actions
const actions = {
  getAllTodos(context) {
    axios
      .get("/todo")
      .then((response) => context.commit("setTodos", response.data))
      .catch((error) => console.log("error :", error));
  },
  addTodos(context, todo) {
    axios
      .post("/todo", {
        title: todo.title,
        completed: todo.completed,
      })
      .then((response) => {
        context.commit("addTodo", response.data);
      })
      .catch((error) => console.log("error :", error));
  },
  updateTodos(context, todo) {
    axios
      .put("/todo", {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
      })
      .then((response) => {
        response.data.editing = false;
        context.commit("doneEdit", response.data);
      })
      .catch((error) => console.log("error :", error));
  },
  deleteTodos(context, todo) {
    axios
      .delete("/todo/" + todo.id)
      .then(() => {
        context.commit("removeTodo", todo);
      })
      .catch((error) => console.log("error :", error));
  },
  checkAllTodos(context, completed) {
    axios
      .patch("/todoCheckAll/" + completed)
      .then(() => {
        context.commit("checkAllTodos", completed);
      })
      .catch((error) => console.log("error :", error));
  },
  clearCompleted(context) {
    axios
      .patch("/clearCompleted")
      .then(() => {
        context.commit("clearCompleted");
      })
      .catch((error) => console.log("error :", error));
  },
};

// mutations
const mutations = {
  addTodo(state, todo) {
    state.all.push(todo);
  },
  editTodo(state, todo) {
    const item = state.all.find((el) => el.id == todo.id);
    item.editing = true;
  },
  doneEdit(state, todo) {
    const item = state.all.find((el) => el.id == todo.id);
    item.editing = false;
    item.title = todo.title;
  },
  cancelEdit(state, todo) {
    const item = state.all.find((el) => el.id == todo.id);
    item.editing = false;
  },
  removeTodo(state, todo) {
    const index = state.all.findIndex((el) => {
      return el.id == todo.id;
    });
    state.all.splice(index, 1);
  },
  checkAllTodos(state, completed) {
    state.all.forEach((el) => {
      el.completed = completed;
    });
  },
  clearCompleted(state) {
    state.all = state.all.filter((el) => el.completed == false);
  },
  setTodos(state, todos) {
    todos.forEach((el) => (el.editing = false));
    state.all = todos;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
