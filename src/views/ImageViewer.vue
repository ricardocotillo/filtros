<template>
  <section class="imageViewer">
    <SearchModal :loading="searchLoading" @search="search" :results="results" @goto="goto" />
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
      :totalPages="405"
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
      <br />
      <br />
      <div id="flipbook" v-show="!loading">
        <div v-for="i in 405" :key="i" :style="{background: 'white'}" :class="{hard: i === 0}">
          <img
            class="page-image"
            :src="`https://filtroswillybusch.com.pe/aplicativo/pdf/doc_page-${(i).toString().padStart(4, '0')}.jpg`"
            alt
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from "../firebase";
import $ from "jquery";
import "vue-turn/src/lib/turn";
import ToolBar from "../components/ToolBar";
import SearchModal from "../components/SearchModal";
export default {
  data() {
    return {
      inciales: [
        "HH",
        "BPE",
        "AE",
        "BLE",
        "BAE",
        "BPS",
        "HFA",
        "BPES",
        "BHE",
        "HFF",
        "HFL",
        "HS",
        "HWP",
        "BLS",
        "HFAR",
        "HFH"
      ],
      results: [],
      loading: true,
      x: 0,
      y: 0,
      page: 1,
      searchLoading: false
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
      this.book.turn("page", 1);
    },
    previous() {
      this.book.turn("previous");
    },
    next() {
      this.book.turn("next");
    },
    last() {
      this.book.turn("page", 405);
    },
    changePage() {
      this.book.turn("page", this.page);
    },
    goto(page) {
      this.book.turn("page", page);
    },
    search(text) {
      this.searchLoading = true
      let search = "";
      if (text.split("-").length > 1) {
        search = text.split("-").join("");
      } else {
        search = text;
      }
      db.collection("codigos")
        .where("item", ">=", search.toUpperCase())
        .where(
          "item",
          "<=",
          (
            search.substring(0, search.length - 1) +
            String.fromCharCode(search.charCodeAt(search.length - 1) + 1)
          ).toUpperCase()
        )
        .get()
        .then(docs => {
          if (!docs.empty) {
            docs.forEach(doc => {
              fetch(
                `https://filtroswillybusch.com.pe/aplicativo/api/pdf/search?code=${
                  doc.data()["item"]
                }`
              )
                .then(res => res.json())
                .then(data => {
                  data.pages.forEach(p =>
                    this.results.push({
                      id: p.id,
                      code: doc.data()["item"] + doc.data()["tipo"] + p.id.toString(),
                      text: `${doc.data()["item"]} tipo: ${doc.data()["tipo"]}`
                    })
                  );
                  this.searchLoading = false
                }).catch(() => this.searchLoading = false);
            });
          } else {
            fetch(
              `https://filtroswillybusch.com.pe/aplicativo/api/pdf/search?search=${text}`
            )
              .then(res => res.json())
              .then(data => {
                this.results = data.pages
                this.searchLoading = false
              }).catch(() => this.searchLoading = false);
          }
        }).catch(() => this.searchLoading = false);
    }
  },
  mounted() {
    this.loading = false;
    this.book = $("#flipbook");
    const deviceWidth = window.innerWidth;
    if (
      deviceWidth <= 1100 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.book.turn({
        width: deviceWidth,
        height: deviceWidth * 1.413376309,
        display: "single",
        autoCenter: true
      });
    } else {
      this.book.turn({ width: 1240, height: 877 });
    }
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