I built two Stencil.js web components. The first one is Firebase Authentication Modal (sign in and sign up) web component and the second one is Firebase Database Tree Renderer web component. One great advantage is that a web component allows you to encapsulate logic and a user interface in one custom HTML tag, which can be used across our page or even reuse across multiple projects. We just take the JavaScript file and drop it into any other project.

We can even have a project, say, in Angular, React or Vue and use the same web component in all of them. That is a great advantage as normally we would not be able to share React components with Angular or Vue for example. We can also publish our component or a set of components even to npm and then install it into any project that we want to use it with npm install command. We are going exactly to do that; publish our components to npm and use it both in Angular, React and Vue projects.

[Stencil.js](https://stenciljs.com/) gives us a way nicer syntax and lot of convenience features which we can use to write web components in a more convenient and error safe way using JavaScript and also Typescript. If you are familiar with React, Stencil uses JSX and the same principles for displaying data.

Our two Stencil.js web components can talk to each other even without writing a single code to the page they have been added.

The app is hosted on Firebase https://stencil-firebase-618cb.web.app

To get started.

```
       Clone the repository

       git clone https://github.com/Ashot72/stenciljs-firebase
       cd stenciljs-firebase

       # installs dependencies
       npm install

       # to run locally
        npm start

       # To build the component for production
        npm run build

       # Angular
         cd projects/angular
         npm install
         npm start

       # React
         cd projects/react.js
         npm install
         npm start

       # Vue
         cd projects/vue.js
         npm install
         npm run serve
```

Go to [Stencil Firebase Web Components Video](https://youtu.be/_h2jh4JzfRM) page

Go to [Stencil Firebase Web Components description](https://ashot72.github.io/ml5-extension/) page
