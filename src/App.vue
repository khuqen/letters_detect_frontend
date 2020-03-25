<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-23 21:36:15
 -->
<template>
  <div id="app">
    <Nav></Nav>
    <router-view></router-view>   
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  name: 'app',
  components: {
	Nav
  }
}
</script>
