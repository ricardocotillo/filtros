<template>
  <div class="toolbar" :style="{ background: 'rgba(0, 0, 0, 0.5)' }">
    <font-awesome-icon
      @click="zoom"
      class="icon"
      :icon="zoomed ? 'search-minus' : 'search-plus'"
      size="lg"
    />
    <font-awesome-icon
      @click="first"
      class="icon"
      icon="fast-backward"
      size="lg"
    />
    <font-awesome-icon
      @click="previous"
      class="icon"
      icon="arrow-left"
      size="lg"
    />
    <b-form @submit.prevent="() => {}">
      <b-input-group :append="`/ ${totalPages}`" size="sm">
        <b-form-input
          :style="{ width: '55px' }"
          id="input-1"
          :value="value"
          type="number"
          min="1"
          :max="totalPages"
          name="pageNumber"
          @input="input"
        ></b-form-input>
      </b-input-group>
    </b-form>
    <font-awesome-icon
      @click="next"
      class="icon"
      icon="arrow-right"
      size="lg"
    />
    <font-awesome-icon
      @click="last"
      class="icon"
      icon="fast-forward"
      size="lg"
    />
    <font-awesome-icon @click="search" class="icon" icon="search" size="lg" />
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    totalPages: Number,
  },
  data() {
    return {
      zoomed: false,
    }
  },
  methods: {
    zoom() {
      this.zoomed = !this.zoomed
      this.$emit('zoom', this.zoomed)
    },
    first() {
      this.$emit('first')
    },
    previous() {
      this.$emit('previous')
    },
    next() {
      this.$emit('next')
    },
    last() {
      this.$emit('last')
    },
    search() {
      this.$emit('search')
    },
    input(value) {
      this.$emit('input', value)
    }
  },
}
</script>

<style scoped>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  margin: 15px auto;
  z-index: 9999;
  height: 200px;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-evenly;
}
.icon {
  color: white;
  cursor: pointer;
}
</style>
