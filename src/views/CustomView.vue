<template>
<div class="container-fluid" id="main-container">
<h2>Alterações</h2>
<div id="pedidoscard" v-for="pedido in pedidos" :key="pedido.id">

<div class="card">
  <div class="card-body" id="cardpedido">
      <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6">
                {{pedido.id}} - {{pedido.cliente}}
            </div>
            <div class="col-md-4">
                {{pedido.ambiente}}
            </div>
            <div class="col-md-2">
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#confirmDelete" @click="atribuiId(pedido.id, pedido.cliente)">Excluir</button>
                    <button type="button" class="btn btn-sm btn-warning"  data-bs-toggle="modal" data-bs-target="#confirmEdit" aria-controls="offcanvasTop">Editar</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
</div>

<!-- Modal Exluir-->
<div :class="classModal" id="confirmDelete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Deseja Excluir?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Você tem certeza que deseja excluir o pedido <strong>{{pedido}} - {{cliente}}</strong>?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-danger" @click="excluirPedido(pedido)">Excluir</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Editar-->
<div class="modal fade" id="confirmEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Editar</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="container">
            <div class="mb-3 row">
                <div class="col">
                    <label for="entrega" class="col-form-label">Previsão de Entrega</label>
                    <input type="date" class="form-control" id="entrega">
                </div>
                <div class="col">
                    <label for="entrega" class="col-form-label">Previsão de Embalagem</label>
                    <input type="date" class="form-control" id="entrega">
                </div>
            </div>

            <div class="mb-3 row">
                <div class="col">
                    <label for="entrega" class="col-form-label">Previsão de Produção</label>
                    <input type="date" class="form-control" id="entrega">
                </div>
                <div class="col">
                    <label for="entrega" class="col-form-label">Previsão de Carga</label>
                    <input type="date" class="form-control" id="entrega">
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col">
                    <label for="entrega" class="col-form-label">Previsão de Montagem</label>
                    <input type="date" class="form-control" id="entrega">
                </div>
                <div class="col">
                    <label for="entrega" class="col-form-label">Status do pedido</label>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Selecione o Status</option>
                        <option v-for="s in situacao" :key=s.id :value="s.tipo">{{s.tipo}}</option>
                    </select>
                </div>
            </div>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-success">Salvar</button>
      </div>
    </div>
  </div>
</div>
</div>    
</template>

<script>
export default {
    name: "CustomView",  
    data(){
    return {
        situacao:[],
        pedidos:[],
        pedido: null,
        cliente: null,  
        classModal: "modal fade",     
    }
    },
    methods:{
        atribuiId(id, cliente){
            this.pedido = id;
            this.cliente = cliente;
            this.classModal= "modal open";
        },
        async excluirPedido(id){
            const req = await fetch(`http://localhost:3000/pedidos/${id}`,{
                method: "DELETE"
            });
            const res = await req.json();
            this.getPedidos();
            this.classModal= "modal fade";
        },
        async getSituacao() {
            const req = await fetch("http://localhost:3000/situacao");
            const data = await req.json();
            this.situacao = data;

        },
        async getPedidos(){
            const req = await fetch("http://localhost:3000/pedidos");
            const data = await req.json();
            this.pedidos = data;
        }
    },
    mounted() {
        this.getSituacao();
        this.getPedidos();
    }
}
</script>

<style scoped>
#main-container{
  margin-top: 65px;
}
#cardpedido{
    font-weight: bold;
}
#pedidoscard{
    padding-top: 5px;
}
</style>