<template>
  <div>
    <ul>
      <li>
        <a href="https://stenciljs.com/">
          Stencil.js
          <span class="framewrok">Vue</span>
        </a>
      </li>
      <li style="float:right">
        <a class="active" @click="auth('SignUp')">Sign Up</a>
      </li>
      <li style="float:right; margin-right: 1px;">
        <a class="active" id="signIn" @click="auth('SignIn')">Sign In</a>
      </li>
    </ul>

    <fbs-auth-modal v-bind:mode="mode" v-bind:db-key="authKey" ref="modal">
      <h1 id="header">{{ header }}</h1>
      <span id="submit" slot="submit">{{ header }}</span>
    </fbs-auth-modal>

    <div style="display:flex; justify-content: space-around;">
      <div>
        <fbs-db-tree v-bind:db-path="dbPath" ref="path"></fbs-db-tree>
      </div>
      <div class="form" style="display:flex; flex-direction: column;">
        <div>
          <label for="dbkey">Web API Key</label>
          <br />
          <input type="text" id="dbkey" v-model="authKey" />
          <br />
          <label for="dbPath">Database Path</label>
          <br />
          <input type="text" id="dbPath" v-model="dbPath" />
          <br />
          <br />
        </div>
        <div class="form result">
          <div style="display: flex; justify-content: center;">Selected Tree Path</div>
          <div id="tree">{{ path}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      header: "",
      mode: "SignIn",
      authKey: "AIzaSyAJbvF6_AozZdUQ1wEloNMUrsTUDzebjO0",
      dbPath: "https://svelte-forum.firebaseio.com/forums.json",
      path: ""
    };
  },
  methods: {
    auth(mode) {
      const modal = this.$refs.modal;
      this.mode = mode;

      mode === "SignIn" ? (this.header = "Sign In") : (this.header = "Sign Up");
      if (!modal.isOpened) {
        modal.open();
      }
    }
  },
  mounted() {
    this.$refs.path.addEventListener(
      "fbsDbPathSelected",
      event => (this.path = event.detail)
    );
  }
};
</script>

  <style>
html {
  --color-primary: #45a049;
}

body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover:not(.active) {
  background-color: #111;
}

.active {
  background-color: #007bff;
  cursor: pointer;
}

input[type="text"] {
  width: 400px;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form {
  margin-top: 2rem;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 1rem;
  height: 150px;
}

.result {
  width: 365px;
  word-break: break-all;
}

.framewrok {
  font-weight: bold;
  color: red;
}
</style>
