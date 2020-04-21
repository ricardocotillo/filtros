<template>
  <section class="pdfViewer">
    <ToolBar
      v-if="!loading"
      id="toolbar"
      @zoom="zoom"
      @first="first"
      @previous="previous"
      @next="next"
      @last="last"
      @search="search"
      @changePage="changePage"
      :pageNumber="page"
      :totalPages="this.pdf.numPages"
      v-model.number="page"
      @input="changePage"
    />
    <div
      @mousedown="startDrag"
      @mousemove="doDrag"
      @mouseup="stopDrag"
      id="pdf-wrapper"
      :style="{ transform: `translate(${x}px, ${y}px)` }"
    >
      <div id="flipbook" v-show="!loading">
        <div class="hard">{{ loading }}</div>
        <PDFPage
          v-for="page in pages"
          :key="page.pageNumber"
          v-on:rendered="renderedPage"
          class="page"
          :page="page"
          :scale="scale"
        />
      </div>
    </div>
    <b-progress
      :value="progress"
      :max="pdf ? pdf.numPages : 0"
      show-progress
      animated
      class="w-25 mb-2"
      v-if="loading"
    ></b-progress>
  </section>
</template>

<script>
import * as pdfjs from 'pdfjs-dist/webpack'
import $ from 'jquery'
import 'vue-turn/src/lib/turn'
import PDFPage from '../components/PDFPage'
import ToolBar from '../components/ToolBar'
export default {
  data() {
    return {
      zoomed: false,
      dragging: false,
      x: 0,
      y: 0,
      url: '/doc.pdf',
      scale: 1,
      pdf: null,
      pageNumber: 1,
      loading: true,
      pages: [],
      progress: 0,
      book: null,
      page: 1,
    }
  },
  methods: {
    startDrag() {
      this.dragging = true
    },
    doDrag(e) {
      if (this.dragging && this.zoomed) {
        this.x += e.movementX
        this.y += e.movementY
      }
    },
    stopDrag() {
      this.dragging = false
      this.x = this.y = 0
    },
    zoom(zoomed) {
      this.zoomed = !this.zoomed
      this.book.turn('zoom', zoomed ? 1.5 : 1)
    },
    first() {
      this.book.turn('page', 2)
    },
    previous() {
      if (this.page > 1) {
        this.page = this.page - 2 < 1 ? 1 : this.page - 2
        this.book.turn('previous')
      }
    },
    next() {
      if (this.page < this.pdf.numPages) {
        this.page =
          this.page === 1
            ? this.page + 1
            : this.page + 2 > this.pdf.numPages
            ? this.pdf.numPages
            : this.page + 2
        this.book.turn('next')
      }
    },
    last() {
      this.book.turn('page', 7)
    },
    changePage() {
      this.book.turn('page', this.page)
    },
    search() {
      this.pages.forEach((p) =>
        p
          .getTextContent()
          .then((data) =>
            data.items.forEach((item) => console.log(item.str.match(/AE/gi))),
          ),
      )
    },
    renderedPage() {
      this.progress += 1
      if (this.pdf && this.progress == 6) {
        this.loading = false
        this.$nextTick(() => {
          this.flipBook()
        })
      }
    },
    async getPages(pageNumber, numPages) {
      numPages = 6
      for (let i = 1; i <= numPages; i++) {
        const page = await this.pdf.getPage(i)
        this.pages.push(page)
      }
    },

    flipBook() {
      const viewport = this.pages[0].getViewport({ scale: this.scale })
      this.book = $('#flipbook')
      this.width = viewport.width
      this.book.turn({
        width: viewport.width * 2,
        height: viewport.height,
      })
      this.book.bind('turned', (e, page) => {
        console.log(page)
      })
    },
  },
  mounted() {
    const loadingTask = pdfjs.getDocument(this.url)
    loadingTask.promise.then((pdf) => {
      this.pdf = pdf
      return this.getPages(this.pageNumber, pdf.numPages)
    })
  },
  components: {
    PDFPage,
    ToolBar,
  },
}
</script>

<style scoped>
.page {
  border: black 1px solid;
}
.pdfViewer {
  background: #2b2b2b;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 12fr;
  justify-items: center;
  align-items: center;
  overflow: hidden;
}
#pdf-wrapper {
  grid-column: 1 / 13;
}
.hard {
  background: white;
}
#toolbar {
  grid-row: 1 / 2;
  height: 50px;
  width: 700px;
  border-radius: 15px;
}
</style>
