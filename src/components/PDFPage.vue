<template>
  <canvas></canvas>
</template>
<script>
export default {
  props: ['page', 'scale'],
  mounted() {
    const viewport = this.page.getViewport({ scale: this.scale })
    const context = this.$el.getContext('2d')
    this.$el.height = viewport.height
    this.$el.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    const renderTask = this.page.render(renderContext)

    renderTask.promise.then(() => {
      this.$emit('rendered')
    })
  },
}
</script>

<style></style>
