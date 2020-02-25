import React, { Component } from 'react'

import './App.css'

class App extends Component {
  state = {
    header: '',
    mode: 'SignIn',
    authKey: 'AIzaSyAJbvF6_AozZdUQ1wEloNMUrsTUDzebjO0',
    dbPath: 'https://svelte-forum.firebaseio.com/forums.json',
    path: ''
  }

  render () {
    const { header, mode, authKey, dbPath, path } = this.state
    return (
      <div>
        <ul>
          <li>
            <a href='https://stenciljs.com/'>
              Stencil.js&nbsp;
              <span className='framewrok'>React</span>
            </a>
          </li>
          <li style={{ float: 'right' }}>
            <a className='active' onClick={e => this.auth('SignUp')}>
              Sign Up
            </a>
          </li>
          <li style={{ float: 'right', marginRight: '1px' }}>
            <a
              className='active'
              id='signIn'
              onClick={e => this.auth('SignIn')}
            >
              Sign In
            </a>
          </li>
        </ul>
        <fbs-auth-modal mode={mode} db-key={authKey} ref='modal'>
          <h1 id='header'>{header}</h1>
          <span id='submit' slot='submit'>
            {header}
          </span>
        </fbs-auth-modal>

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <fbs-db-tree db-path={dbPath} ref='path'></fbs-db-tree>
          </div>
          <div
            className='form'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div>
              <label htmlFor='dbkey'>Web API Key</label>
              <br />
              <input
                type='text'
                id='dbkey'
                value={authKey}
                onChange={e => this.setState({ authKey: e.target.value })}
              />
              <br />
              <label htmlFor='dbPath'>Database Path</label>
              <br />
              <input
                type='text'
                id='dbPath'
                value={dbPath}
                onChange={e => this.setState({ dbPath: e.target.value })}
              />
              <br />
              <br />
            </div>
            <div className='form result'>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                Selected Tree Path
              </div>
              <div id='tree'>{path}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  auth (mode) {
    const modal = this.refs.modal
    this.setState({ mode })

    mode === 'SignIn'
      ? this.setState({ header: 'Sign In' })
      : this.setState({ header: 'Sign Up' })
    if (!modal.isOpened) {
      modal.open()
    }
  }

  componentDidMount () {
    this.refs.path.addEventListener('fbsDbPathSelected', event =>
      this.setState({ path: event.detail })
    )
  }
}

export default App
