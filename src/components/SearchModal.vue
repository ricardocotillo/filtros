<template>
  <b-modal id="search-modal" size="sm" centered title="Buscar" hide-footer>
    <b-input-group>
      <b-form-input v-model="text"></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="onSearch">
          <font-awesome-icon icon="search" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <br />
    <p v-if="results.length > 0">Página(s) {{results.length}}</p>
    <ul>
      <li v-for="r in results" :key="r.key">
        <span style="font-weight: bold;">Página {{r.page}}</span>
        <br />
        <span>{{r.text}}</span>
      </li>
    </ul>
  </b-modal>
</template>

<script>
export default {
  props: {
    results: Array
  },
  data() {
    return {
      text: ""
    };
  },
  methods: {
    onSearch() {
      this.$emit("search", this.text);
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
  overflow: scroll;
  max-height: 400px;
}
li {
  border-bottom: solid 1px lightgray;
}

.modal {
  height: 500px !important;
}
</style>