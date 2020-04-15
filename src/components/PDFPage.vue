<template>
  <canvas :id="`pdfpage${page.pageNumber}`"></canvas>
</template>
<script>
export default {
  props: ['page', 'scale'],
  mounted() {
    const viewport = this.page.getViewport({ scale: this.scale })

    // Prepare canvas using PDF page dimensions
    const canvas = document.getElementById(`pdfpage${this.page.pageNumber}`)
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    const renderTask = this.page.render(renderContext)

    renderTask.promise.then(function() {
      console.log('Page rendered')
    })
  },
}
</script>

<style></style>
