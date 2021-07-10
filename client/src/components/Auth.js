import React from 'react';
// import store from '../store';
import services from '../helpers/services';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  
  componentDidMount() {
    this.login(true);
  }
  
  login = (jwt) => {
    if (jwt) {
      services('users', 'auth', {}).then(res => {
        if (res.data.success) this.props.history.push('/todos');
      })
    } else {
      services('users', 'auth', {...this.state}).then(res => {
        if (res.data.success) this.props.history.push('/todos');
      })
    }
  }
  
  render() {
    return (
      <div className="auth">
        <input type="text" placeholder="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
        <input type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
        <button onClick={() => this.login(false)}>Login</button>
      </div>
    );
  }
}