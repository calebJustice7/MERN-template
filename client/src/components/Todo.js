import React from 'react';
import store from '../store';
import services from '../helpers/services';

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: ''
    }
  }
  
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
    
    if(this.user()) {
      services('todos', 'find', {createdBy: services('users', 'getId')});
    }
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  user = () => {
    return store.getState().auth.user || {};
  }
  
  todos = () => {
    return store.getState().service.todos;
  }
  
  createTodo = () => {
    services('todos', 'create', {createdBy: this.user()._id, todo: this.state.inputVal})
    this.setState({inputVal: ''});
  }
  
  render() {
    return (
      <div className="todos">
        {this.todos().map((todo, idx) => (
          <div className="todo" key={idx}>
            <span>{todo.todo}</span>
          </div>
        ))}
        <input type="text" placeholder="Create Todo" value={this.state.inputVal} onChange={e => this.setState({inputVal: e.target.value})} />
        <button onClick={this.createTodo}>Create Todo</button>
      </div>
    )
  }
};