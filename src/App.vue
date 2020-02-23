<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-02-23 20:15:01
 -->
<template>
  <div id="app">
	<el-container>
		<el-main>
			<Home/>
		</el-main>
	</el-container>
  </div>
</template>

<script>
import Home from './components/Home'
export default {
  name: 'app',
  components: {
		Home
  }
}
</script>
