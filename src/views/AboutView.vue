<template>
<div class="container-fluid" id="main-container">
  <div class="text-center section">
    <h2 class="h2">Calendário de Produção</h2>
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return {
      masks: {
        weekdays: 'WWW',
      },
      attributes: [],
      situacao: "bg-primary",
    };
  },
      methods: {
        async getPedidos(){
          const req = await fetch("http://localhost:3000/pedidos");
          const data = await req.json();
          this.pedidos = data;
          for(var i=0; i<data.length; i++){
          this.verificaSituacao(data[i].dataentrega);
          this.attributes.push({
                key: data[i].id,
                customData: {
                  title: data[i].id +" - "+ data[i].cliente,
                  class: `${this.situacao} text-white`,
                },
                dates: new Date(data[i].dataentrega),
          })
          }
        },
        async verificaSituacao(entrega){
          this.dataHoje = moment(this.getData).format("YYYY/MM/DD");
          if(this.dataHoje > entrega){
            this.situacao = "bg-danger"
          }else{
              if(this.dataHoje == entrega){
                this.situacao = "bg-warning"
              }else{
                this.situacao = "bg-success"
              }
          }
        }
      },
        mounted(){
        this.getPedidos();
      },
};
</script>

<style scoped>
#main-container{
  margin-top: 65px;
  padding-left:100px;
  padding-right:100px;
}
.scrollbar {
  width: 0px;
}
.scrollbar-track {
  display: none;
}
.custom-calendar.vc-container {
  border-radius: 0;
  width: 100%;
}
.custom-calendar.vc-container .vc-header {
  background-color: #f1f5f8;
  padding: 10px 0;
}
.custom-calendar.vc-container .vc-weeks {
  padding: 0;
}
.custom-calendar.vc-container .vc-weekday {
  background-color: #f8fafc;
  border-bottom: 1px solid #eaeaea;
  border-top: 1px solid #eaeaea;
  padding: 5px 0;
}
.custom-calendar.vc-container .vc-day {
  padding: 0 5px 3px 5px;
  text-align: left;
  min-height: 90px;
  min-width: 90px;
  overflow: auto;
  background-color: white;
}
.custom-calendar.vc-container .vc-day.weekday-1,
.custom-calendar.vc-container .vc-day.weekday-7 {
  background-color: #eff8ff;
}
.custom-calendar.vc-container .vc-day:not(.on-bottom) {
  border-bottom: 1px solid #b8c2cc;
}
.custom-calendar.vc-container .vc-day:not(.on-bottom).weekday-1 {
  border-bottom: 1px solid #b8c2cc;
}
.custom-calendar.vc-container .vc-day:not(.on-right) {
  border-right: 1px solid #b8c2cc;
}
.custom-calendar.vc-container .vc-day-dots {
  margin-bottom: 5px;
}
</style>