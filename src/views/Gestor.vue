<template>
  <div class="about">
    <b-container>
      <b-row>
        <b-col><i class="fas fa-calendar-check fa-4x"></i></b-col>
        <b-col><i class="fas fa-users fa-4x"></i></b-col>
      </b-row>
      <br><br><br>
      <b-row>
        <b-col><i class="fas fa-box-open fa-4x"></i></b-col>
        <b-col><i class="fas fa-clipboard-list fa-4x"></i></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import mayoristas from '../mayoristas.json'
export default {
  data() {
    return {
      model: true,
      titulo: '',
      mayoristas: mayoristas
    }
  }
}
</script>

