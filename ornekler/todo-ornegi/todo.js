// random id generator
let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

const addTodo = () => {
    if (!$state.todo) {
        alert('Lütfen bir todo başlığı belirtin!');
    } else {

        const find = $state.todos.find(t => t.content === $state.todo);
        if (find) {
            alert('Böyle bir todo zaten ekli!');
        } else {

            const newTodo = {
                id: s4(),
                content: $state.todo,
                done: $state.done
            };
            updateState('todos', [newTodo, ...$state.todos]);
            updateState('todo', '')
            updateState('done', false)

        }
    }
}

const deleteTodo = (id, e) => {
    e.stopPropagation();
    updateState('todos', $state.todos.filter(t => t.id !== id));
}

const updateTodo = (todo) => {
    updateState('todos', $state.todos.map(t => {
        if (t.id === todo.id) {
            t.done = !todo.done;
        }
        return t
    }))
}

const reverseTodo = () => {
    updateState('todos', $state.todos.reverse());
}

setState('todos', []);