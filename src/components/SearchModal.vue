<template>
  <b-modal id="search-modal" size="md" centered title="Buscar" hide-footer>
    <b-input-group>
      <b-form-input v-model="text"></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="onSearch">
          <font-awesome-icon icon="search" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <br />
    <font-awesome-icon v-if="loading" icon="spinner" spin />
    <p v-if="results && results.length > 0">Página(s) {{results.length}}</p>
    <ul>
      <li class="result-item" @click="goto(r.id)" v-for="r in results" :key="r.code">
        <span style="font-weight: bold;">Página {{r.id}}</span>
        <br />
        <span>{{r.text}}</span>
      </li>
    </ul>
  </b-modal>
</template>

<script>
export default {
  props: {
    results: Array,
    loading: Boolean,
  },
  data() {
    return {
      text: ""
    };
  },
  methods: {
    goto(page) {
      this.$bvModal.hide("search-modal");
      this.$emit("goto", page);
    },
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
  max-width: 700px;
}
li {
  border-bottom: solid 1px lightgray;
}

li:hover {
  cursor: pointer;
}

.modal {
  height: 500px !important;
}
</style>