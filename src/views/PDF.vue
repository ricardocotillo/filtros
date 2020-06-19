<template>
  <section class="pdfViewer">
    <SearchModal @search="search" :results="searchedResults" />
    <!-- :totalPages="this.pdf.numPages" -->
    <ToolBar
      v-if="!loading"
      id="toolbar"
      @zoom="zoom"
      @first="first"
      @previous="previous"
      @next="next"
      @last="last"
      @changePage="changePage"
      :pageNumber="page"
      :totalPages="30"
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
        <div class="hard portada">
          <img src="@/assets/logo.png" alt />
        </div>
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
import * as pdfjs from "pdfjs-dist/webpack";
import $ from "jquery";
import "vue-turn/src/lib/turn";
import PDFPage from "../components/PDFPage";
import ToolBar from "../components/ToolBar";
import SearchModal from "../components/SearchModal";
export default {
  data() {
    return {
      zoomed: false,
      dragging: false,
      x: 0,
      y: 0,
      url: "/doc.pdf",
      scale: 1,
      pdf: null,
      pageNumber: 1,
      loading: true,
      pages: [],
      progress: 0,
      book: null,
      page: 1,
      searchedResults: []
    };
  },
  methods: {
    startDrag() {
      this.dragging = true;
    },
    doDrag(e) {
      if (this.dragging && this.zoomed) {
        this.x += e.movementX;
        this.y += e.movementY;
      }
    },
    stopDrag() {
      this.dragging = false;
      this.x = this.y = 0;
    },
    zoom(zoomed) {
      this.zoomed = !this.zoomed;
      this.book.turn("zoom", zoomed ? 1.5 : 1);
    },
    first() {
      this.book.turn("page", 2);
    },
    previous() {
      this.book.turn("previous");
    },
    next() {
      this.book.turn("next");
    },
    last() {
      this.book.turn("page", 7);
    },
    changePage() {
      this.book.turn("page", this.page);
    },
    search(text) {
      this.searchedResults = [];
      const re = new RegExp(text, "gi");
      this.pages.forEach((p, i) =>
        p.getTextContent().then(data =>
          data.items.forEach((item, index) => {
            if (item.str.match(re) != null) {
              this.searchedResults.push({
                key: index,
                page: i + 1,
                text: item.str
              });
            }
          })
        )
      );
    },
    renderedPage() {
      this.progress += 1;
      if (this.pdf && this.progress == 6) {
        this.loading = false;
        this.$nextTick(() => {
          this.flipBook();
        });
      }
    },
    async getPages(pageNumber, numPages) {
      numPages = 30;
      for (let i = 1; i <= numPages; i++) {
        const page = await this.pdf.getPage(i);
        this.pages.push(page);
      }
    },

    flipBook() {
      const viewport = this.pages[0].getViewport({ scale: this.scale });
      this.book = $("#flipbook");
      this.width = viewport.width;
      const deviceWidth = window.innerWidth;

      if (deviceWidth >= 1000) {
        this.book.turn({
          width: viewport.width * 1.8,
          height: (viewport.height * 1.8) / 2
        });
      } else {
        this.book.turn({
          width: deviceWidth - 5,
          display: "single",
          autoCenter: true,
          height: ((deviceWidth - 5) / viewport.width) * viewport.height
        });
      }
      this.book.bind("turned", (e, page) => {
        this.page = page;
      });
    }
  },
  mounted() {
    const loadingTask = pdfjs.getDocument(this.url);
    loadingTask.promise.then(pdf => {
      this.pdf = pdf;
      return this.getPages(this.pageNumber, pdf.numPages);
    });
  },
  components: {
    PDFPage,
    ToolBar,
    SearchModal
  }
};
</script>

<style scoped>
.portada {
  display: flex;
  align-items: center;
  justify-content: center;
}
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

@media only screen and (max-width: 1000px) {
  #toolbar {
    width: 95%;
    max-width: 95%;
  }
}
</style>
