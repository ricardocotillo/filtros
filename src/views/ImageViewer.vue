<template>
  <section class="imageViewer">
    <SearchModal />
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
      :totalPages="225"
      v-model.number="page"
      @input="changePage"
    />
    <div
      @mousedown="startDrag"
      @mousemove="doDrag"
      @mouseup="stopDrag"
      id="imageviewer-wrapper"
      :style="{ transform: `translate(${x}px, ${y}px)` }"
    >
      <div id="flipbook" v-show="!loading">
        <div class="hard portada">
          <img src="@/assets/logo.png" alt />
        </div>
        <div v-for="i in 244" :key="i" :style="{background: 'white'}">
          <img
            class="page-image"
            :src="`/doc/doc_page-${(i+1).toString().padStart(4, '0')}.jpg`"
            alt
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from "jquery";
import "vue-turn/src/lib/turn";
import ToolBar from "../components/ToolBar";
import SearchModal from "../components/SearchModal";
export default {
  data() {
    return {
      loading: true,
      x: 0,
      y: 0,
      page: 1
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
    }
  },
  mounted() {
    this.loading = false;
    this.book = $("#flipbook");
    this.book.turn({ width: 1240, height: 877 });
    this.book.bind("turned", (e, page) => {
      this.page = page;
    });
  },
  components: {
    ToolBar,
    SearchModal
  }
};
</script>

<style>
.imageViewer {
  background: #2b2b2b;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 12fr;
  justify-items: center;
  align-items: center;
  overflow: hidden;
}
#imageviewer-wrapper {
  grid-column: 1 / 13;
}
.portada {
  display: flex;
  align-items: center;
  justify-content: center;
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

.page-image {
  max-width: 100%;
}

@media only screen and (max-width: 1000px) {
  #toolbar {
    width: 95%;
    max-width: 95%;
  }
}
</style>