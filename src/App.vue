<template>
  <NavBar :logo="logo_cliente" :alt="alt_logo" :nomeCliente="nome_cliente"/>
  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
      NavBar
    },
    data(){
      return {
        logo_cliente: "/img/logo.png",
        alt_logo:"Logo cliente",
        nome_cliente: ""
      }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
